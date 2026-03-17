/**
 * Shift report rendering and study-mode anomaly cycling.
 * Extracted from game-ui.js to keep it under the 200-line cap.
 */

const ROOMS = ['living-room','kitchen','bedroom','hallway','office','bathroom','basement','attic','garage','nursery'];
const LABELS = ['LIVING ROOM','KITCHEN','BEDROOM','HALLWAY','OFFICE','BATHROOM','BASEMENT','ATTIC','GARAGE','NURSERY'];

export function showShiftReport(ui, won) {
    const { engine } = ui;
    const log = engine.anomalyManager.roomLog;
    const total = engine.anomalyManager.totalTriggered;
    const resolved = engine.anomalyManager.totalResolved;
    const missed = total - resolved;

    ui.srTitle.textContent = won
        ? '✓ SHIFT COMPLETE — 02:00 AM'
        : '✗ MISSION FAILED — HOUSE COMPROMISED';
    ui.srTitle.style.color = won ? '#00ff00' : '#ff4444';

    ui.srGrid.innerHTML = '';
    ROOMS.forEach((r, i) => {
        const stat = log[r] || { triggered: 0, resolved: 0 };
        const card = document.createElement('div');
        card.className = 'sr-room-card';
        card.innerHTML = `
            <div class="sr-room-name">${LABELS[i]}</div>
            <div class="sr-room-stat">TRIGGERED: <span>${stat.triggered}</span></div>
            <div class="sr-room-stat">RESOLVED: <span>${stat.resolved}</span></div>
            <div class="sr-room-stat">MISSED: <span style="color:${stat.triggered - stat.resolved > 0 ? '#ff4444' : '#00ff00'}">${stat.triggered - stat.resolved}</span></div>
        `;
        ui.srGrid.appendChild(card);
    });

    const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;
    const history = engine.anomalyManager.detectionHistory;
    const avgTime = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.duration, 0) / history.length / 1000) : 0;
    const fastest = history.length > 0 ? Math.round(Math.min(...history.map(h => h.duration)) / 1000) : 0;
    const slowest = history.length > 0 ? Math.round(Math.max(...history.map(h => h.duration)) / 1000) : 0;

    ui.srTotal.innerHTML = `
        TOTAL ANOMALIES: <strong>${total}</strong> &nbsp;|&nbsp;
        RESOLVED: <strong>${resolved}</strong> &nbsp;|&nbsp;
        MISSED: <strong style="color:${missed > 0 ? '#ff4444' : '#00ff00'}">${missed}</strong><br>
        DETECTION RATE: <strong>${rate}%</strong> &nbsp;|&nbsp;
        AVG DETECTION: <strong>${avgTime}s</strong> &nbsp;|&nbsp;
        FASTEST: <strong>${fastest}s</strong> &nbsp;|&nbsp;
        SLOWEST: <strong>${slowest}s</strong>
    `;

    ui.shiftReport.classList.remove('hidden');
    document.body.classList.remove('glitch-active', 'glitch-heavy');
}

export function cycleAnomaly(ui, roomName, resolveCategory) {
    const am = ui.engine.anomalyManager;
    const compatible = am.getCompatibleTypes(roomName);
    if (!compatible.length) return;

    if (ui._studyIndices[roomName] == null) ui._studyIndices[roomName] = 0;
    const idx = ui._studyIndices[roomName];

    const prev = am.activeAnomalies.find(a => a.room === roomName);
    if (prev) am.resolveAnomaly(roomName, prev.type);

    if (idx >= compatible.length) {
        if (ui.studyBanner) ui.studyBanner.textContent = 'All anomaly types cycled for this room.';
        ui._studyIndices[roomName] = 0;
        return;
    }

    const type = compatible[idx];
    const room = am.rooms[roomName];
    const anomaly = {
        id: Date.now(), room: roomName, type,
        category: resolveCategory(type),
        difficulty: am.getDifficulty(type),
        target: room.objects[Math.floor(Math.random() * room.objects.length)],
        originalState: null, ghost: null, triggerTime: Date.now(), intensity: 1.0,
    };

    am.studyMode = true;
    am.applyAnomaly(room, anomaly);
    am.activeAnomalies.push(anomaly);
    am.studyMode = false;

    if (ui.studyBanner) {
        ui.studyBanner.textContent = `Study: ${type.replace(/_/g, ' ')} (${idx + 1}/${compatible.length})`;
    }
    ui._studyIndices[roomName] = idx + 1;
}
