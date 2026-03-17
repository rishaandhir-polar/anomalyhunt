import { GameEngine } from './core/engine.js';
import { SoundManager } from './core/sound-manager.js';
import { GameState } from './core/game-state.js';
import { GameUI } from './ui/game-ui.js';

// ── Initialize modules ────────────────────────────────────────────────────────
const engine = new GameEngine(document.getElementById('game-container'));
const sound = new SoundManager();
const gameState = new GameState(engine, sound);
const gameUI = new GameUI(engine, sound);

// ── Wire GameState → GameUI callbacks ─────────────────────────────────────────
gameState.onTimerUpdate = (timeString) => {
    gameUI.updateTimer(timeString);
};

gameState.onAnomalySpawn = () => {
    gameUI.updateAnomalyCount();
};

gameState.onGameEnd = (won) => {
    gameUI.showShiftReport(won);
};

gameState.onGlitchUpdate = () => {
    gameUI.updateGlitch();
};

// ── Wire GameUI → GameState callbacks ─────────────────────────────────────────
gameUI.onStartMission = () => {
    gameUI.resetUI();
    gameState.startMission();
};

gameUI.onEndGame = (won) => {
    gameState.endGame(won);
};

gameUI.onStartStudy = () => {
    gameState.state = 'STUDY';
    function studyRender() {
        if (gameState.state !== 'STUDY') return;
        engine.render();
        requestAnimationFrame(studyRender);
    }
    studyRender();
};
