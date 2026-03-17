// Report menu: dropdown population, descriptions, keyboard navigation

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

export const ANOMALY_DESCRIPTIONS = {
    displaced:         'An object has been moved from its original position.',
    extra:             'An unexpected object has appeared in the room.',
    missing:           'An object that should be here is gone.',
    painting:          'A painting is tilted or replaced.',
    tv:                'The TV is on when it should be off.',
    chair_floor:       'A chair has fallen or is on its side.',
    books_floating:    'Books are hovering off the shelf.',
    lamp_flickering:   'A lamp is flickering erratically.',
    cushion_displaced: 'A cushion is out of place.',
    door_ajar:         'A door is slightly open.',
    curtains_moving:   'Curtains are moving with no wind.',
    mirror_reflection: 'The mirror shows something that isn\'t there.',
    rocking_chair:     'A rocking chair is moving on its own.',
    spinning_fan:      'A ceiling fan is spinning without power.',
    dripping_faucet:   'A faucet is dripping rhythmically.',
    swinging_light:    'A light fixture is swinging.',
    crawling_shadow:   'A shadow is moving independently.',
    temperature_drop:  'The room feels unnaturally cold.',
    fog_room:          'A thick fog has filled the room.',
    red_tint:          'Everything has a red hue.',
    gravity_shift:     'Objects are behaving as if gravity changed.',
    time_freeze:       'Time seems to have stopped in this room.',
    static_noise:      'A persistent static hiss fills the air.',
    light:             'The lighting has changed abnormally.',
    tv_on_empty_room:  'The TV turned on by itself.',
    monitor_glitch:    'A monitor is displaying glitched output.',
    phone_ringing:     'A phone is ringing with no caller.',
    radio_static:      'A radio is emitting static.',
    all_electronics_on:'All electronics activated simultaneously.',
    intruder:          'There is an unknown presence in the room.',
};

/**
 * Populate the anomaly type <select> with categorised <optgroup> elements.
 * @param {HTMLSelectElement} selectEl
 */
export function populateAnomalyDropdown(selectEl) {
    selectEl.innerHTML = '<option value="">-- Select type --</option>';
    for (const [category, types] of Object.entries(ANOMALY_CATEGORIES)) {
        const group = document.createElement('optgroup');
        group.label = category;
        [...types].sort().forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type.replace(/_/g, ' ');
            group.appendChild(opt);
        });
        selectEl.appendChild(group);
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
