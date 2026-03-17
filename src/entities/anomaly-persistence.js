/**
 * Serialization, deserialization, and intensity scaling for AnomalyManager.
 * Extracted from anomaly.js to keep it under the 200-line cap.
 */

/**
 * Serialize active anomaly state to a JSON string.
 * @param {AnomalyManager} manager
 * @returns {string}
 */
export function serialize(manager) {
    const data = {
        version: '1.0',
        anomalies: manager.activeAnomalies.map(a => ({
            id: a.id,
            room: a.room,
            type: a.type,
            category: a.category,
            difficulty: a.difficulty,
            triggerTime: a.triggerTime,
            intensity: a.intensity,
            targetIndex: a.target && manager.rooms[a.room]
                ? manager.rooms[a.room].objects.indexOf(a.target)
                : null,
            animationState: a.animationState ? { ...a.animationState } : null,
        })),
        roomLog: { ...manager.roomLog },
        stats: {
            undetectedCount: manager.undetectedCount,
            totalTriggered: manager.totalTriggered,
            totalResolved: manager.totalResolved,
        },
    };
    return JSON.stringify(data);
}

/**
 * Restore state from a JSON string.
 * @param {AnomalyManager} manager
 * @param {string} json
 * @returns {{ success: true } | { error: string }}
 */
export function deserialize(manager, json) {
    try {
        const data = JSON.parse(json);
        if (!data.version || !Array.isArray(data.anomalies)) {
            return { error: 'Invalid game state format: missing required fields' };
        }
        manager.activeAnomalies = data.anomalies.map(a => ({
            id: a.id,
            room: a.room,
            type: a.type,
            category: a.category,
            difficulty: a.difficulty,
            triggerTime: a.triggerTime,
            intensity: a.intensity,
            target: (a.targetIndex != null && manager.rooms[a.room])
                ? manager.rooms[a.room].objects[a.targetIndex] ?? null
                : null,
            originalState: null,
            ghost: null,
            animationState: a.animationState ? { ...a.animationState } : null,
        }));
        manager.roomLog = { ...data.roomLog };
        manager.undetectedCount = data.stats.undetectedCount;
        manager.totalTriggered = data.stats.totalTriggered;
        manager.totalResolved = data.stats.totalResolved;
        return { success: true };
    } catch (error) {
        return { error: `Deserialization failed: ${error.message}` };
    }
}

/**
 * Update intensity for all active anomalies based on elapsed time.
 * @param {AnomalyManager} manager
 */
export function updateIntensity(manager) {
    const now = Date.now();
    for (const anomaly of manager.activeAnomalies) {
        const elapsed = (now - anomaly.triggerTime) / 1000;
        if (elapsed >= 60) {
            anomaly.intensity = 1.5;
        } else if (elapsed >= 30) {
            anomaly.intensity = 1.2;
        }
        applyIntensityModifier(anomaly);
    }
}

/**
 * Apply visual intensity modifier to a single anomaly.
 * @param {object} anomaly
 */
export function applyIntensityModifier(anomaly) {
    const i = anomaly.intensity;
    if (i <= 1.0) return;

    switch (anomaly.type) {
        case 'light':
            if (anomaly.target && anomaly.target.intensity != null) {
                anomaly.target.intensity = i * 2.0;
            }
            break;
        case 'extra':
        case 'intruder':
            if (anomaly.ghost) {
                anomaly.ghost.traverse(child => {
                    if (child.material) child.material.opacity = Math.min(1, i * 0.8);
                });
            }
            break;
        case 'lamp_flickering':
            if (anomaly.target && anomaly.target.intensity != null) {
                anomaly.target.intensity = (Math.random() > 0.5 ? i : 0);
            }
            break;
        default:
            break;
    }
}
