import { updateAutonomousAnomaly } from '../entities/anomaly-types/autonomous-anomalies.js';

export class GameState {
    constructor(engine, soundManager) {
        this.engine = engine;
        this.sound = soundManager;
        this.state = 'LOBBY';  // LOBBY | STUDY | PLAYING | OVER
        this.gameTime = 0;
        this.lastTs = 0;
        this.anomalyInterval = null;
        
        // Constants
        this.GAME_DURATION = 7200;  // 2 in-game hours
        this.REAL_PER_HOUR = 300;   // 1 real second = 12 in-game seconds (5 min real per in-game hour → ~10 min shift)
        this.REAL_PER_SECOND = this.REAL_PER_HOUR / 3600;
        this.MAX_ANOMALIES = 5;
        
        // Callbacks
        this.onTimerUpdate = null;
        this.onAnomalySpawn = null;
        this.onGameEnd = null;
    }
    
    // Time formatting
    formatTime(seconds) {
        // Start at midnight (00:00)
        const totalMinutes = Math.floor(seconds / 60);
        let h = Math.floor(totalMinutes / 60) % 24;
        let m = totalMinutes % 60;
        const ampm = h < 12 ? 'AM' : 'PM';
        const displayHour = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    }
    
    // Adaptive spawn delay based on progress
    getSpawnDelay() {
        return 30000 + Math.random() * 20000;  // 30-50s between anomalies
    }
    
    // Start anomaly spawning loop
    startAnomalyLoop() {
        let isFirstAnomaly = true;
        const scheduleNext = () => {
            const delay = isFirstAnomaly ? 3000 : this.getSpawnDelay();
            isFirstAnomaly = false;
            this.anomalyInterval = setTimeout(() => {
                if (this.state !== 'PLAYING') return;
                
                this.engine.anomalyManager.triggerRandomAnomaly();
                this.sound.playAnomalySpawn();
                
                if (this.onAnomalySpawn) this.onAnomalySpawn();
                
                this.sound.setAmbientTension(this.engine.anomalyManager.undetectedCount > 0);
                if (this.engine.anomalyManager.undetectedCount >= 3) this.sound.playAlert();
                
                if (this.engine.anomalyManager.undetectedCount >= this.MAX_ANOMALIES) {
                    this.endGame(false);
                } else {
                    scheduleNext();
                }
            }, delay);
        };
        scheduleNext();
    }
    
    // Update all active autonomous anomaly animations
    updateAutonomousAnomalies(deltaTime) {
        const anomalies = this.engine.anomalyManager.activeAnomalies;
        for (const anomaly of anomalies) {
            if (anomaly.category === 'autonomous') {
                updateAutonomousAnomaly(anomaly, deltaTime);
            }
        }
    }

    // Game loop
    gameLoop(ts) {
        if (this.state !== 'PLAYING') return;
        
        const dt = this.lastTs ? (ts - this.lastTs) / 1000 : 0;
        this.lastTs = ts;
        this.gameTime += dt / this.REAL_PER_SECOND;
        
        if (this.onTimerUpdate) this.onTimerUpdate(this.formatTime(this.gameTime));
        
        this.engine.render();
        
        this.updateAutonomousAnomalies(dt);
        this.engine.anomalyManager.updateIntensity();

        if (this.onGlitchUpdate) this.onGlitchUpdate();
        
        if (this.gameTime >= this.GAME_DURATION) {
            this.endGame(true);
        } else {
            requestAnimationFrame((ts) => this.gameLoop(ts));
        }
    }
    
    // Start mission
    startMission() {
        this.state = 'PLAYING';
        this.gameTime = 0;
        this.lastTs = 0;
        
        // Reset anomaly manager
        this.engine.anomalyManager.activeAnomalies = [];
        this.engine.anomalyManager.undetectedCount = 0;
        this.engine.anomalyManager.totalTriggered = 0;
        this.engine.anomalyManager.totalResolved = 0;
        this.engine.anomalyManager.roomLog = {};
        
        this.sound.setAmbientTension(false);
        this.startAnomalyLoop();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    // End game
    endGame(won) {
        this.state = 'OVER';
        clearTimeout(this.anomalyInterval);
        
        won ? this.sound.playWin() : this.sound.playLoss();
        
        // Trigger callback for UI updates
        if (this.onGameEnd) {
            this.onGameEnd(won);
        }
    }
}
