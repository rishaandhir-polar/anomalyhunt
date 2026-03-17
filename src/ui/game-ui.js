import { populateAnomalyDropdown, wireDescriptionDisplay, wireKeyboardNav } from './report-menu.js';
import { showShiftReport as _showShiftReport, cycleAnomaly as _cycleAnomaly } from './shift-report.js';
import { OBJECT_ANOMALY_TYPES } from '../entities/anomaly-types/object-anomalies.js';
import { AUTONOMOUS_ANOMALY_TYPES } from '../entities/anomaly-types/autonomous-anomalies.js';
import { ENVIRONMENTAL_ANOMALY_TYPES } from '../entities/anomaly-types/environmental-anomalies.js';
import { ELECTRONIC_ANOMALY_TYPES } from '../entities/anomaly-types/electronic-anomalies.js';

function resolveCategory(type) {
    if (AUTONOMOUS_ANOMALY_TYPES.includes(type)) return 'autonomous';
    if (ENVIRONMENTAL_ANOMALY_TYPES.includes(type)) return 'environmental';
    if (ELECTRONIC_ANOMALY_TYPES.includes(type)) return 'electronic';
    return 'object';
}

export class GameUI {
    constructor(engine, soundManager) {
        this.engine = engine;
        this.sound = soundManager;

        this.modal = document.getElementById('game-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDesc = document.getElementById('modal-desc');
        this.startBtn = document.getElementById('start-btn');
        this.studyBtn = document.getElementById('study-btn');
        this.cctvUI = document.getElementById('cctv-ui');
        this.timerDisplay = document.getElementById('timer');
        this.camLabel = document.getElementById('cam-label');
        this.reportMenu = document.getElementById('report-menu');
        this.reportBtn = document.getElementById('report-btn');
        this.submitReport = document.getElementById('submit-report');
        this.cancelReport = document.getElementById('cancel-report');
        this.reportRoom = document.getElementById('report-room');
        this.reportType = document.getElementById('report-type');
        this.reportTypeDesc = document.getElementById('report-type-desc');
        this.statsCount = document.getElementById('anomaly-count');
        this.anomalyAlert = document.getElementById('anomaly-alert');
        this.studyBanner = document.getElementById('study-banner');
        this.readyBtn = document.getElementById('ready-btn');
        this.shiftReport = document.getElementById('shift-report');
        this.srTitle = document.getElementById('sr-title');
        this.srGrid = document.getElementById('sr-grid');
        this.srTotal = document.getElementById('sr-total');
        this.srCloseBtn = document.getElementById('sr-close-btn');

        this.ROOM_LABELS = [
            'CAM 01 — LIVING ROOM', 'CAM 02 — KITCHEN',
            'CAM 03 — BEDROOM',     'CAM 04 — HALLWAY',
            'CAM 05 — OFFICE',      'CAM 06 — BATHROOM',
            'CAM 07 — BASEMENT',    'CAM 08 — ATTIC',
            'CAM 09 — GARAGE',      'CAM 10 — NURSERY',
        ];

        this.MAX_ANOMALIES = 5;
        this.onEndGame = null;
        this.onStartMission = null;
        this.onStartStudy = null;
        this.onRenderStudy = null;
        this._studyIndices = {};

        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('.cam-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchCamera(parseInt(btn.dataset.cam)));
        });

        this.reportBtn.addEventListener('click', () => this.openReportMenu());
        this.cancelReport.addEventListener('click', () => this.closeReportMenu());
        this.submitReport.addEventListener('click', () => this.submitReportHandler());
        populateAnomalyDropdown(this.reportType);
        wireDescriptionDisplay(this.reportType, this.reportTypeDesc);
        wireKeyboardNav(this.reportType, () => this.closeReportMenu());

        this.studyBtn.addEventListener('click', () => {
            this.sound.init();
            this.modal.classList.add('hidden');
            this.studyBanner.classList.remove('hidden');
            this.cctvUI.classList.remove('hidden');
            this.camLabel.textContent = this.ROOM_LABELS[0];
            this.engine.switchCamera(0);
            if (this.onStartStudy) this.onStartStudy();
        });

        this.readyBtn.addEventListener('click', () => {
            this.studyBanner.classList.add('hidden');
            if (this.onStartMission) this.onStartMission();
        });

        this.startBtn.addEventListener('click', () => {
            this.sound.init();
            this.modal.classList.add('hidden');
            this.cctvUI.classList.remove('hidden');
            this.camLabel.textContent = this.ROOM_LABELS[0];
            this.engine.switchCamera(0);
            if (this.onStartMission) this.onStartMission();
        });

        this.srCloseBtn.addEventListener('click', () => {
            this.shiftReport.classList.add('hidden');
            this.modal.classList.remove('hidden');
            this.cctvUI.classList.add('hidden');
            this.modalTitle.textContent = 'OBSERVATION';
            this.modalDesc.textContent = 'MONITOR THE HOUSE. REPORT ANOMALIES.\nDON\'T LET THEM ACCUMULATE.';
        });
    }

    switchCamera(index) {
        this.engine.switchCamera(index);
        this.camLabel.textContent = this.ROOM_LABELS[index];
        document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cam-btn')[index].classList.add('active');
        this.updateGlitch();
    }

    openReportMenu() { this.reportMenu.classList.toggle('hidden'); }

    closeReportMenu() {
        this.reportMenu.classList.add('hidden');
        this.reportRoom.value = '';
        this.reportType.value = '';
    }

    submitReportHandler() {
        if (!this.reportRoom.value || !this.reportType.value) return;
        const resolved = this.engine.anomalyManager.resolveAnomaly(this.reportRoom.value, this.reportType.value);
        if (resolved) {
            this.sound.playSuccess();
            this.statsCount.textContent = this.engine.anomalyManager.undetectedCount;
            if (this.engine.anomalyManager.undetectedCount === 0) {
                this.anomalyAlert.classList.add('hidden');
                this.sound.setAmbientTension(false);
            }
            this.updateGlitch();
        } else {
            this.sound.playFail();
            this.engine.anomalyManager.undetectedCount = Math.min(
                this.engine.anomalyManager.undetectedCount + 1, this.MAX_ANOMALIES
            );
            this.statsCount.textContent = this.engine.anomalyManager.undetectedCount;
            if (this.engine.anomalyManager.undetectedCount >= this.MAX_ANOMALIES) {
                if (this.onEndGame) this.onEndGame(false);
            }
        }
        this.closeReportMenu();
    }

    updateGlitch() {
        const roomKeys = Object.keys(this.engine.rooms);
        const roomName = roomKeys[this.engine.currentCamIndex];
        const count = this.engine.anomalyManager.activeAnomalies.filter(a => a.room === roomName).length;
        document.body.classList.toggle('glitch-active', count === 1);
        document.body.classList.toggle('glitch-heavy', count >= 2);
    }

    updateTimer(timeString) { this.timerDisplay.textContent = timeString; }

    updateAnomalyCount() {
        this.statsCount.textContent = this.engine.anomalyManager.undetectedCount;
        this.anomalyAlert.classList.remove('hidden');
        this.updateGlitch();
    }

    showShiftReport(won) { _showShiftReport(this, won); }

    resetUI() {
        this.statsCount.textContent = '0';
        this.anomalyAlert.classList.add('hidden');
        document.body.classList.remove('glitch-active', 'glitch-heavy');
    }

    cycleAnomaly(roomName) { _cycleAnomaly(this, roomName, resolveCategory); }
}
