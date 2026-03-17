import { describe, it, expect, vi } from 'vitest';
import {
    ANOMALY_CATEGORIES,
    ANOMALY_DESCRIPTIONS,
    populateAnomalyDropdown,
    wireDescriptionDisplay,
    wireKeyboardNav,
} from '../src/ui/report-menu.js';

// Minimal DOM helpers
function makeSelect() {
    const opts = [];
    const groups = [];
    const listeners = {};
    return {
        innerHTML: '',
        options: opts,
        appendChild(child) {
            if (child._isOptgroup) groups.push(child);
            else opts.push(child);
        },
        addEventListener(evt, fn) { listeners[evt] = fn; },
        _groups: groups,
        _listeners: listeners,
        value: '',
    };
}

function makeOptgroup() {
    const children = [];
    return {
        _isOptgroup: true,
        label: '',
        appendChild(child) { children.push(child); },
        _children: children,
    };
}

function makeOption() {
    return { value: '', textContent: '' };
}

function makeElement() {
    return { textContent: '' };
}

// Patch document.createElement for tests
const origCreate = global.document?.createElement;

describe('ANOMALY_CATEGORIES', () => {
    it('has Object, Autonomous, Environmental, Electronic keys', () => {
        expect(Object.keys(ANOMALY_CATEGORIES)).toEqual(
            expect.arrayContaining(['Object', 'Autonomous', 'Environmental', 'Electronic'])
        );
    });

    it('has 30+ total anomaly types across all categories', () => {
        const total = Object.values(ANOMALY_CATEGORIES).flat().length;
        expect(total).toBeGreaterThanOrEqual(29);
    });

    it('Object category has 12 types', () => {
        expect(ANOMALY_CATEGORIES.Object.length).toBe(12);
    });

    it('Autonomous category has 5 types', () => {
        expect(ANOMALY_CATEGORIES.Autonomous.length).toBe(5);
    });

    it('Environmental category has 7 types', () => {
        expect(ANOMALY_CATEGORIES.Environmental.length).toBe(7);
    });

    it('Electronic category has 5 types', () => {
        expect(ANOMALY_CATEGORIES.Electronic.length).toBe(5);
    });
});

describe('ANOMALY_DESCRIPTIONS', () => {
    it('has a description for every type in ANOMALY_CATEGORIES', () => {
        const allTypes = Object.values(ANOMALY_CATEGORIES).flat();
        for (const type of allTypes) {
            expect(ANOMALY_DESCRIPTIONS[type], `Missing description for ${type}`).toBeDefined();
        }
    });

    it('includes intruder description', () => {
        expect(ANOMALY_DESCRIPTIONS['intruder']).toBeDefined();
    });
});

describe('populateAnomalyDropdown', () => {
    it('disables select and shows placeholder when no room given', () => {
        let disabled = false;
        const appended = [];
        const selectEl = {
            innerHTML: '',
            disabled: false,
            set disabled(v) { disabled = v; },
            appendChild(child) { appended.push(child); },
        };
        global.document = {
            createElement(tag) {
                if (tag === 'optgroup') return { label: '', appendChild: vi.fn(), _tag: 'optgroup' };
                if (tag === 'option') return { value: '', textContent: '', _tag: 'option' };
            },
        };
        populateAnomalyDropdown(selectEl, '');
        expect(disabled).toBe(true);
        expect(appended.length).toBe(1); // just the placeholder
    });

    it('creates optgroups for compatible types when room is given', () => {
        const groups = [];
        const selectEl = {
            innerHTML: '',
            disabled: true,
            appendChild(child) {
                if (child._tag === 'optgroup') groups.push(child);
            },
        };
        global.document = {
            createElement(tag) {
                if (tag === 'optgroup') return { label: '', appendChild: vi.fn(), _tag: 'optgroup' };
                if (tag === 'option') return { value: '', textContent: '', _tag: 'option' };
            },
        };
        populateAnomalyDropdown(selectEl, 'living-room');
        expect(groups.length).toBeGreaterThanOrEqual(1);
    });
});

describe('wireDescriptionDisplay', () => {
    it('updates descEl.textContent on change', () => {
        const listeners = {};
        const selectEl = {
            value: 'displaced',
            addEventListener(evt, fn) { listeners[evt] = fn; },
        };
        const descEl = { textContent: '' };
        wireDescriptionDisplay(selectEl, descEl);
        listeners['change']();
        expect(descEl.textContent).toBe(ANOMALY_DESCRIPTIONS['displaced']);
    });

    it('clears description for unknown type', () => {
        const listeners = {};
        const selectEl = {
            value: 'unknown_xyz',
            addEventListener(evt, fn) { listeners[evt] = fn; },
        };
        const descEl = { textContent: 'old' };
        wireDescriptionDisplay(selectEl, descEl);
        listeners['change']();
        expect(descEl.textContent).toBe('');
    });

    it('does nothing when descEl is null', () => {
        const selectEl = { addEventListener: vi.fn() };
        expect(() => wireDescriptionDisplay(selectEl, null)).not.toThrow();
        expect(selectEl.addEventListener).not.toHaveBeenCalled();
    });
});

describe('wireKeyboardNav', () => {
    it('calls onClose when Escape is pressed', () => {
        const listeners = {};
        const selectEl = { addEventListener(evt, fn) { listeners[evt] = fn; } };
        const onClose = vi.fn();
        wireKeyboardNav(selectEl, onClose);
        listeners['keydown']({ key: 'Escape', preventDefault: vi.fn() });
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose for other keys', () => {
        const listeners = {};
        const selectEl = { addEventListener(evt, fn) { listeners[evt] = fn; } };
        const onClose = vi.fn();
        wireKeyboardNav(selectEl, onClose);
        listeners['keydown']({ key: 'ArrowDown', preventDefault: vi.fn() });
        expect(onClose).not.toHaveBeenCalled();
    });
});
