import { GameEngine } from './core/engine.js';
import { SoundManager } from './core/sound-manager.js';

// ── Engine & Sound ────────────────────────────────────────────────────────────
const engine = new GameEngine(document.getElementById('game-container'));
const sound = new SoundManager();

// ── DOM refs ─────────────────────────────────────────────────────────────────
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const startBtn = document.getElementById('start-btn');
const studyBtn = document.getElementById('study-btn');
const studyBanner = document.getElementById('study-banner');
const readyBtn = document.getElementById('ready-btn');
const cctvUI = document.getElementById('cctv-ui');
const camLabel = document.getElementById('cam-label');
const timerDisplay = document.getElementById('timer');
const anomalyAlert = document.getElementById('anomaly-alert');
const statsCount = document.getElementById('anomaly-count');
const reportMenu = document.getElementById('report-menu');
const reportBtn = document.getElementById('report-btn');
const submitReport = document.getElementById('submit-report');
const cancelReport = document.getElementById('cancel-report');
const reportRoom = document.getElementById('report-room');
const reportType = document.getElementById('report-type');
const shiftReport = document.getElementById('shift-report');
const srTitle = document.getElementById('sr-title');
const srGrid = document.getElementById('sr-grid');
const srTotal = document.getElementById('sr-total');
const srCloseBtn = document.getElementById('sr-close-btn');

// ── State ─────────────────────────────────────────────────────────────────────
let gameState = 'LOBBY';  // LOBBY | STUDY | PLAYING | OVER
let gameTime = 0;        // in-game seconds (0 = midnight, 21600 = 06:00)
let realDelta = 0;
let lastTs = 0;
let anomalyInterval = null;

const GAME_DURATION = 7200;  // 2 in-game hours (midnight → 2:00 AM) in game-seconds
const REAL_PER_HOUR = 1500;  // 1500 real-seconds per in-game hour → 1 game-min ≈ 25 real-sec
const REAL_PER_SECOND = REAL_PER_HOUR / 3600; // game-time scalar
const MAX_ANOMALIES = 5;

const ROOM_LABELS = [
    'CAM 01 — LIVING ROOM', 'CAM 02 — KITCHEN',
    'CAM 03 — BEDROOM', 'CAM 04 — HALLWAY',
    'CAM 05 — OFFICE', 'CAM 06 — BATHROOM'
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
    // Start at midnight (00:00)
    const totalMinutes = Math.floor(seconds / 60);
    let h = Math.floor(totalMinutes / 60) % 24;
    let m = totalMinutes % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const displayHour = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

function updateGlitch() {
    const roomKeys = Object.keys(engine.rooms);
    const roomName = roomKeys[engine.currentCamIndex];
    const roomAnomalies = engine.anomalyManager.activeAnomalies.filter(a => a.room === roomName);
    document.body.classList.toggle('glitch-active', roomAnomalies.length === 1);
    document.body.classList.toggle('glitch-heavy', roomAnomalies.length >= 2);
}

// ── Camera switching ──────────────────────────────────────────────────────────
document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.cam);
        engine.switchCamera(idx);
        camLabel.textContent = ROOM_LABELS[idx];
        document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateGlitch();
    });
});

// ── Report Menu ───────────────────────────────────────────────────────────────
reportBtn.addEventListener('click', () => {
    reportMenu.classList.toggle('hidden');
});

cancelReport.addEventListener('click', () => {
    reportMenu.classList.add('hidden');
    reportRoom.value = '';
    reportType.value = '';
});

submitReport.addEventListener('click', () => {
    if (!reportRoom.value || !reportType.value) return;
    const resolved = engine.anomalyManager.resolveAnomaly(reportRoom.value, reportType.value);
    if (resolved) {
        sound.playSuccess();
        statsCount.textContent = engine.anomalyManager.undetectedCount;
        // Hide alert if no anomalies remain
        if (engine.anomalyManager.undetectedCount === 0) {
            anomalyAlert.classList.add('hidden');
            sound.setAmbientTension(false);
        }
        updateGlitch();
    } else {
        sound.playFail();
        // Wrong claim — counts as a miss penalty
        engine.anomalyManager.undetectedCount = Math.min(
            engine.anomalyManager.undetectedCount + 1,
            MAX_ANOMALIES
        );
        statsCount.textContent = engine.anomalyManager.undetectedCount;
        if (engine.anomalyManager.undetectedCount >= MAX_ANOMALIES) endGame(false);
    }
    reportMenu.classList.add('hidden');
    reportRoom.value = '';
    reportType.value = '';
});

// ── Adaptive spawn delay based on progress ───────────────────────────────────
// Early shift: slow, forgiving (every 90-120s)
// Mid shift:   moderate (every 60-80s)
// Final 30%:   tense (every 35-55s)
function getSpawnDelay() {
    const progress = gameTime / GAME_DURATION;
    if (progress < 0.33) return 90000 + Math.random() * 30000;   // 90–120s
    if (progress < 0.67) return 60000 + Math.random() * 20000;   // 60–80s
    return 35000 + Math.random() * 20000;                        // 35–55s
}

// ── Spawn loop ────────────────────────────────────────────────────────────────
function startAnomalyLoop() {
    let isFirstAnomaly = true;
    function scheduleNext() {
        const delay = isFirstAnomaly ? 15000 : getSpawnDelay(); // First after 15s
        isFirstAnomaly = false;
        anomalyInterval = setTimeout(() => {
            if (gameState !== 'PLAYING') return;
            const anomaly = engine.anomalyManager.triggerRandomAnomaly();
            sound.playAnomalySpawn();
            statsCount.textContent = engine.anomalyManager.undetectedCount;
            anomalyAlert.classList.remove('hidden');
            updateGlitch();
            sound.setAmbientTension(engine.anomalyManager.undetectedCount > 0);

            if (engine.anomalyManager.undetectedCount >= 3) sound.playAlert();
            if (engine.anomalyManager.undetectedCount >= MAX_ANOMALIES) {
                endGame(false);
            } else {
                scheduleNext();
            }
        }, delay);
    }
    scheduleNext();
}

// ── Game loop ─────────────────────────────────────────────────────────────────
function gameLoop(ts) {
    if (gameState !== 'PLAYING') return;

    const dt = lastTs ? (ts - lastTs) / 1000 : 0;
    lastTs = ts;
    gameTime += dt / REAL_PER_SECOND;

    timerDisplay.textContent = formatTime(gameTime);
    engine.render();
    updateGlitch();

    if (gameTime >= GAME_DURATION) {
        endGame(true);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// ── Shift report builder ──────────────────────────────────────────────────────
function showShiftReport(won) {
    const log = engine.anomalyManager.roomLog;
    const total = engine.anomalyManager.totalTriggered;
    const resolved = engine.anomalyManager.totalResolved;
    const missed = total - resolved;

    srTitle.textContent = won
        ? '✓ SHIFT COMPLETE — 02:00 AM'
        : '✗ MISSION FAILED — HOUSE COMPROMISED';
    srTitle.style.color = won ? '#00ff00' : '#ff4444';

    srGrid.innerHTML = '';
    const rooms = ['living-room', 'kitchen', 'bedroom', 'hallway', 'office', 'bathroom'];
    const labels = ['LIVING ROOM', 'KITCHEN', 'BEDROOM', 'HALLWAY', 'OFFICE', 'BATHROOM'];
    rooms.forEach((r, i) => {
        const stat = log[r] || { triggered: 0, resolved: 0 };
        const card = document.createElement('div');
        card.className = 'sr-room-card';
        card.innerHTML = `
            <div class="sr-room-name">${labels[i]}</div>
            <div class="sr-room-stat">TRIGGERED: <span>${stat.triggered}</span></div>
            <div class="sr-room-stat">RESOLVED: <span>${stat.resolved}</span></div>
            <div class="sr-room-stat">MISSED: <span style="color:${stat.triggered - stat.resolved > 0 ? '#ff4444' : '#00ff00'}">${stat.triggered - stat.resolved}</span></div>
        `;
        srGrid.appendChild(card);
    });

    const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    srTotal.innerHTML = `
        TOTAL ANOMALIES: <strong>${total}</strong> &nbsp;|&nbsp;
        RESOLVED: <strong>${resolved}</strong> &nbsp;|&nbsp;
        MISSED: <strong style="color:${missed > 0 ? '#ff4444' : '#00ff00'}">${missed}</strong><br>
        DETECTION RATE: <strong>${rate}%</strong>
    `;

    shiftReport.classList.remove('hidden');
}

// ── End game ──────────────────────────────────────────────────────────────────
function endGame(won) {
    gameState = 'OVER';
    clearTimeout(anomalyInterval);
    document.body.classList.remove('glitch-active', 'glitch-heavy');
    won ? sound.playWin() : sound.playLoss();
    showShiftReport(won);
}

srCloseBtn.addEventListener('click', () => {
    shiftReport.classList.add('hidden');
    // Show game over modal
    modal.classList.remove('hidden');
    cctvUI.classList.add('hidden');
    modalTitle.textContent = 'OBSERVATION';
    modalDesc.textContent = 'MONITOR THE HOUSE. REPORT ANOMALIES.\nDON\'T LET THEM ACCUMULATE.';
});

// ── Study mode ────────────────────────────────────────────────────────────────
studyBtn.addEventListener('click', () => {
    sound.init();
    modal.classList.add('hidden');
    studyBanner.classList.remove('hidden');
    cctvUI.classList.remove('hidden');
    camLabel.textContent = ROOM_LABELS[0];
    gameState = 'STUDY';
    engine.switchCamera(0);
    // Still render
    function studyRender() {
        if (gameState !== 'STUDY') return;
        engine.render();
        requestAnimationFrame(studyRender);
    }
    studyRender();
});

readyBtn.addEventListener('click', () => {
    studyBanner.classList.add('hidden');
    startMission();
});

// ── Start mission ─────────────────────────────────────────────────────────────
function startMission() {
    gameState = 'PLAYING';
    gameTime = 0;
    lastTs = 0;
    // Reset anomaly manager
    engine.anomalyManager.activeAnomalies = [];
    engine.anomalyManager.undetectedCount = 0;
    engine.anomalyManager.totalTriggered = 0;
    engine.anomalyManager.totalResolved = 0;
    engine.anomalyManager.roomLog = {};
    statsCount.textContent = '0';
    anomalyAlert.classList.add('hidden');
    document.body.classList.remove('glitch-active', 'glitch-heavy');
    sound.setAmbientTension(false);
    startAnomalyLoop();
    requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', () => {
    sound.init();
    modal.classList.add('hidden');
    cctvUI.classList.remove('hidden');
    camLabel.textContent = ROOM_LABELS[0];
    engine.switchCamera(0);
    startMission();
});
