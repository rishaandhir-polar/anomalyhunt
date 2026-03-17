// Report menu: dropdown population, descriptions, keyboard navigation
import { ROOM_ANOMALY_COMPATIBILITY } from '../entities/anomaly.js';

export const ANOMALY_CATEGORIES = {
    Object: [
        'displaced', 'extra', 'missing', 'painting', 'tv',
        'chair_floor', 'books_floating', 'lamp_flickering',
        'cushion_displaced', 'door_ajar', 'curtains_moving', 'mirror_reflection',
    ],
    Autonomous: [
        'rocking_chair', 'spinning_fan', 'dripping_faucet',
        'swinging_light', 'crawling_shadow',
    ],
    Environmental: [
        'temperature_drop', 'fog_room', 'red_tint', 'gravity_shift',
        'time_freeze', 'static_noise', 'light',
    ],
    Electronic: [
        'tv_on_empty_room', 'monitor_glitch', 'phone_ringing',
        'radio_static', 'all_electronics_on',
    ],
};

export const ANOMALY_LABELS = {
    displaced:          'Object Moved',
    extra:              'Unknown Object Present',
    missing:            'Object Missing',
    painting:           'Painting Changed',
    tv:                 'TV Anomaly',
    chair_floor:        'Chair Knocked Over',
    books_floating:     'Books Floating',
    lamp_flickering:    'Lamp Flickering',
    cushion_displaced:  'Cushion Out of Place',
    door_ajar:          'Door Left Open',
    curtains_moving:    'Curtains Moving',
    mirror_reflection:  'Mirror Reflection Wrong',
    rocking_chair:      'Rocking Chair Moving Alone',
    spinning_fan:       'Fan Spinning (No Power)',
    dripping_faucet:    'Faucet Dripping',
    swinging_light:     'Light Swinging',
    crawling_shadow:    'Shadow Moving Independently',
    temperature_drop:   'Room Unnaturally Cold',
    fog_room:           'Room Filled with Fog',
    red_tint:           'Red Light / Red Hue',
    gravity_shift:      'Object Floating Mid-Air',
    time_freeze:        'Time Appears Frozen',
    static_noise:       'Bright Static / Light Surge',
    light:              'Lights Out / Wrong Color',
    tv_on_empty_room:   'TV On By Itself',
    monitor_glitch:     'Monitor Glitching',
    phone_ringing:      'Phone Ringing (No Caller)',
    radio_static:       'Radio Static',
    all_electronics_on: 'All Electronics On',
    intruder:           'Unknown Presence / Intruder',
};

export const ANOMALY_DESCRIPTIONS = {
    displaced:          'An object has been moved from its original position.',
    extra:              'An unexpected object has appeared in the room.',
    missing:            'An object that should be here is gone.',
    painting:           'A painting has changed color.',
    tv:                 'The TV screen has changed color or turned on.',
    chair_floor:        'A chair has fallen or is on its side.',
    books_floating:     'Books are hovering off the shelf.',
    lamp_flickering:    'A lamp is flickering erratically.',
    cushion_displaced:  'A cushion has dropped to the floor.',
    door_ajar:          'A door is slightly open.',
    curtains_moving:    'Curtains are moving with no wind.',
    mirror_reflection:  'The mirror is glowing red.',
    rocking_chair:      'A rocking chair is moving on its own.',
    spinning_fan:       'A ceiling fan is spinning without power.',
    dripping_faucet:    'A faucet is dripping rhythmically.',
    swinging_light:     'A light fixture is swinging.',
    crawling_shadow:    'A shadow is moving independently across the floor.',
    temperature_drop:   'The room light has turned icy blue — unnaturally cold.',
    fog_room:           'The room light has gone nearly dark — thick fog.',
    red_tint:           'The room is bathed in bright red light.',
    gravity_shift:      'A floor object is floating at eye level.',
    time_freeze:        'Time seems to have stopped in this room.',
    static_noise:       'The room light surged to a bright white flash.',
    light:              'The lights went out or turned an unusual color.',
    tv_on_empty_room:   'The TV turned on and is glowing blue.',
    monitor_glitch:     'A monitor is displaying green glitched output.',
    phone_ringing:      'A phone is ringing with no caller.',
    radio_static:       'A radio is emitting static.',
    all_electronics_on: 'All electronics activated simultaneously.',
    intruder:           'A dark humanoid figure is standing in the room.',
};

/**
 * Populate the anomaly type <select> filtered to types compatible with the given room.
 * If no room is selected, shows a prompt to select a room first.
 * @param {HTMLSelectElement} selectEl
 * @param {string} roomName  — key from ROOM_ANOMALY_COMPATIBILITY, or ''
 */
export function populateAnomalyDropdown(selectEl, roomName = '') {
    selectEl.innerHTML = '';

    if (!roomName) {
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '— SELECT ROOM FIRST —';
        selectEl.appendChild(placeholder);
        selectEl.disabled = true;
        return;
    }

    selectEl.disabled = false;
    const compatible = new Set(ROOM_ANOMALY_COMPATIBILITY[roomName] || []);

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— SELECT TYPE —';
    selectEl.appendChild(placeholder);

    for (const [category, types] of Object.entries(ANOMALY_CATEGORIES)) {
        const roomTypes = types.filter(t => compatible.has(t));
        if (roomTypes.length === 0) continue;
        const group = document.createElement('optgroup');
        group.label = category;
        roomTypes.sort().forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = ANOMALY_LABELS[type] || type.replace(/_/g, ' ');
            group.appendChild(opt);
        });
        selectEl.appendChild(group);
    }

    // intruder is compatible with all rooms but not in any category list
    if (compatible.has('intruder')) {
        const opt = document.createElement('option');
        opt.value = 'intruder';
        opt.textContent = ANOMALY_LABELS['intruder'];
        selectEl.appendChild(opt);
    }
}

/**
 * Wire description display when a type is selected.
 * @param {HTMLSelectElement} selectEl
 * @param {HTMLElement} descEl  — element to write description into
 */
export function wireDescriptionDisplay(selectEl, descEl) {
    if (!descEl) return;
    selectEl.addEventListener('change', () => {
        descEl.textContent = ANOMALY_DESCRIPTIONS[selectEl.value] || '';
    });
}

/**
 * Wire keyboard navigation for the report menu.
 * Arrow keys navigate options; Enter selects; Escape closes.
 * @param {HTMLSelectElement} selectEl
 * @param {Function} onClose  — called on Escape
 */
export function wireKeyboardNav(selectEl, onClose) {
    selectEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
        // Arrow key navigation is native for <select> — no extra handling needed
    });
}
