// --- Music Theory Constants ---
const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24, 27, 29, 31, 33, 36];
const CIRCLE_OF_FIFTHS = ['Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#'];
const CHORD_ROWS = ['Maj', 'Min', 'Maj7', '7', 'm7', '6', 'm6', 'Aug', 'Dim', 'm7b5'];

const SCALES = {
    "Ionian (Major)": [0, 2, 4, 5, 7, 9, 11],
    "Dorian": [0, 2, 3, 5, 7, 9, 10],
    "Phrygian": [0, 1, 3, 5, 7, 8, 10],
    "Lydian": [0, 2, 4, 6, 7, 9, 11],
    "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
    "Aeolian (Minor)": [0, 2, 3, 5, 7, 8, 10],
    "Locrian": [0, 1, 3, 5, 6, 8, 10],
    "Major Pentatonic": [0, 2, 4, 7, 9],
    "Minor Pentatonic": [0, 3, 5, 7, 10],
    "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
    "Chromatic": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

const CHORD_FORMULAS = {
    'Maj': [0, 4, 7],
    'Min': [0, 3, 7],
    'Maj7': [0, 4, 7, 11],
    '7': [0, 4, 7, 10],
    'm7': [0, 3, 7, 10],
    '6': [0, 4, 7, 9],
    'm6': [0, 3, 7, 9],
    'Aug': [0, 4, 8],
    'Dim': [0, 3, 6],
    'm7b5': [0, 3, 6, 10]
};

// --- Copedent Library ---
const COPEDENT_LIBRARY = {
    "E9 Custom": {
        num_strings: 10,
        tuning: {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        pedals: [
            {id: "A", label: "A", changes: {"5": 2, "10": 2}},
            {id: "B", label: "B", changes: {"3": 1, "6": 1}},
            {id: "C", label: "C", changes: {"4": 2, "5": 2}},
            {id: "D", label: "D", changes: {"5": -2, "6": -2, "10": -2}}
        ],
        levers: [
            {id: "LL", label: "LL", group: "Left Knee", changes: {"4": 1, "8": 1}},
            {id: "LV", label: "LV", group: "Left Knee", changes: {"6": -1}},
            {id: "LR", label: "LR", group: "Left Knee", changes: {"4": -1, "8": -1}},
            {id: "RL", label: "RL", group: "Right Knee", changes: {"1": 1, "7": 1}},
            {id: "RR1", label: "RR1", group: "Right Knee", changes: {"2": -1, "9": -1}},
            {id: "RR2", label: "RR2", group: "Right Knee", changes: {"2": -2, "9": -1}}
        ],
        compounds: [
            {id: "AB", label: "", components: ["A", "B"], title: "Toggle A+B"},
            {id: "BC", label: "", components: ["B", "C"], title: "Toggle B+C"}
        ]
    },
    "E9 Emmons": {
        num_strings: 10,
        tuning: {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        pedals: [
            {id: "A", label: "A", changes: {"5": 2, "10": 2}},
            {id: "B", label: "B", changes: {"3": 1, "6": 1}},
            {id: "C", label: "C", changes: {"4": 2, "5": 2}}
        ],
        levers: [
            {id: "LL", label: "LL", group: "Left Knee", changes: {"4": 1, "8": 1}},
            {id: "LR", label: "LR", group: "Left Knee", changes: {"4": -1, "8": -1}},
            {id: "RL", label: "RL", group: "Right Knee", changes: {"1": 1, "7": 1}},
            {id: "RR", label: "RR", group: "Right Knee", changes: {"2": -1, "9": -1}}
        ],
        compounds: [{id: "AB", label: "", components: ["A", "B"], title: "Toggle A+B"}]
    },
    "E9 Day": {
        num_strings: 10,
        tuning: {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        pedals: [
            {id: "A", label: "A", changes: {"3": 1, "6": 1}},
            {id: "B", label: "B", changes: {"5": 2, "10": 2}},
            {id: "C", label: "C", changes: {"4": 2, "5": 2}}
        ],
        levers: [
            {id: "LL", label: "LL", group: "Left Knee", changes: {"4": 1, "8": 1}},
            {id: "LR", label: "LR", group: "Left Knee", changes: {"4": -1, "8": -1}},
            {id: "RL", label: "RL", group: "Right Knee", changes: {"1": 1, "7": 1}},
            {id: "RR", label: "RR", group: "Right Knee", changes: {"2": -1, "9": -1}}
        ]
    },
    "C6 Standard": {
        num_strings: 10,
        tuning: {1: 67, 2: 64, 3: 60, 4: 57, 5: 55, 6: 52, 7: 48, 8: 45, 9: 41, 10: 36},
        pedals: [
            {id: "P4", label: "P4", changes: {"4": 2, "8": 2}},
            {id: "P5", label: "P5", changes: {"1": 1, "5": 1, "9": 2, "10": 2}},
            {id: "P6", label: "P6", changes: {"2": -1, "6": -1}},
            {id: "P7", label: "P7", changes: {"3": 2, "7": 2}},
            {id: "P8", label: "P8", changes: {"4": -2, "8": -2}}
        ],
        levers: [
            {id: "LL", label: "LL", group: "Left Knee", changes: {"1": -1, "5": -1}},
            {id: "LR", label: "LR", group: "Left Knee", changes: {"2": 1, "6": 1}},
            {id: "RL", label: "RL", group: "Right Knee", changes: {"3": -1}},
            {id: "RR", label: "RR", group: "Right Knee", changes: {"4": -2}}
        ]
    },
    "12-string Universal": {
        num_strings: 12,
        tuning: {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 51, 10: 49, 11: 47, 12: 44},
        pedals: [
            {id: "A", label: "A", changes: {"5": 2, "10": 2}},
            {id: "B", label: "B", changes: {"3": 1, "6": 1}},
            {id: "C", label: "C", changes: {"4": 2, "5": 2}},
            {id: "P5", label: "P5", changes: {"9": -1, "10": -1}},
            {id: "P6", label: "P6", changes: {"2": -1}}
        ],
        levers: [
            {id: "LL", label: "LL", group: "Left Knee", changes: {"4": 1, "8": 1}},
            {id: "LR", label: "LR", group: "Left Knee", changes: {"4": -1, "8": -1}},
            {id: "RL", label: "RL", group: "Right Knee", changes: {"1": 1, "7": 1}},
            {id: "RR", label: "RR", group: "Right Knee", changes: {"2": -1, "9": -1}}
        ],
        compounds: [{id: "AB", label: "", components: ["A", "B"], title: "Toggle A+B"}]
    }
};

// --- State Management ---
const state = {
    activeModifiers: new Set(),
    selectedChord: null, // {root: "C", type: "Maj"}
    hoveredChord: null   // {root: "C", type: "Maj"} (Preview)
};

// --- Helpers ---
function getNoteName(midi, useFlats) {
    const notes = useFlats ? NOTES_FLAT : NOTES_SHARP;
    return notes[midi % 12];
}

function getNoteIndex(noteName) {
    let idx = NOTES_SHARP.indexOf(noteName);
    if (idx === -1) idx = NOTES_FLAT.indexOf(noteName);
    return idx !== -1 ? idx : 0;
}

// --- UI Generators ---

function renderPedalControls() {
    const container = document.getElementById('dynamic-controls');
    const tuningName = document.getElementById('tuning-select').value;
    const copedent = COPEDENT_LIBRARY[tuningName];
    
    container.innerHTML = '';

    // 1. Levers (Grouped)
    const levers = copedent.levers || [];
    const groups = {};
    levers.forEach(l => {
        const g = l.group || "Other";
        if (!groups[g]) groups[g] = [];
        groups[g].push(l);
    });

    const groupNames = Object.keys(groups).sort((a, b) => (a.includes('Left') ? -1 : 1));
    
    const leversRow = document.createElement('div');
    leversRow.className = 'levers-row';
    
    groupNames.forEach((gName, i) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'lever-group';
        groups[gName].forEach(l => {
            const btn = createControlBtn(l.label, l.id);
            groupDiv.appendChild(btn);
        });
        leversRow.appendChild(groupDiv);
        if (i < groupNames.length - 1) {
            const spacer = document.createElement('div');
            spacer.style.width = '40px';
            leversRow.appendChild(spacer);
        }
    });
    container.appendChild(leversRow);

    // 2. Pedals (Row with Compounds)
    const pedals = copedent.pedals || [];
    const compounds = copedent.compounds || [];
    const pedalsRow = document.createElement('div');
    pedalsRow.className = 'pedals-row';

    pedals.forEach((p, i) => {
        pedalsRow.appendChild(createControlBtn(p.label, p.id));
        
        if (i < pedals.length - 1) {
            const nextP = pedals[i+1];
            // Find existing compound or create a default one
            let comp = compounds.find(c => 
                c.components.includes(p.id) && c.components.includes(nextP.id)
            );
            
            if (!comp) {
                comp = {
                    components: [p.id, nextP.id],
                    title: `Toggle ${p.label}+${nextP.label}`
                };
            }
            pedalsRow.appendChild(createCompoundBtn(comp));
        }
    });
    container.appendChild(pedalsRow);
}

function createControlBtn(label, id) {
    const btn = document.createElement('button');
    btn.className = 'control-btn';
    btn.textContent = label;
    btn.dataset.id = id;
    if (state.activeModifiers.has(id)) btn.classList.add('active');
    
    btn.onclick = () => {
        if (state.activeModifiers.has(id)) {
            state.activeModifiers.delete(id);
        } else {
            // Mutual Exclusion for RR1/RR2
            if (id === 'RR1' && state.activeModifiers.has('RR2')) {
                state.activeModifiers.delete('RR2');
            }
            if (id === 'RR2' && state.activeModifiers.has('RR1')) {
                state.activeModifiers.delete('RR1');
            }
            state.activeModifiers.add(id);
        }
        renderPedalControls();
        update();
    };
    return btn;
}

function createCompoundBtn(comp) {
    const btn = document.createElement('button');
    btn.className = 'compound-btn';
    btn.title = comp.title;
    
    // Check state
    const isActive = comp.components.every(c => state.activeModifiers.has(c));
    if (isActive) btn.classList.add('active');

    btn.onclick = () => {
        const allActive = comp.components.every(c => state.activeModifiers.has(c));
        comp.components.forEach(c => {
            if (allActive) state.activeModifiers.delete(c);
            else state.activeModifiers.add(c);
        });
        // Re-render all controls to update states
        renderPedalControls(); 
        update();
    };
    return btn;
}

function renderChordSelector() {
    const container = document.getElementById('chord-selector-container');
    container.innerHTML = '';
    
    const selectedKey = document.getElementById('root-select').options[document.getElementById('root-select').selectedIndex].text;
    const scaleName = document.getElementById('mode-select').value;
    const complexity = document.getElementById('complexity-select').value;
    const useFlats = document.getElementById('accidental-mode').value === 'flat';
    
    // Determine Key Index for centering
    let keyIdx = CIRCLE_OF_FIFTHS.indexOf(selectedKey);
    if (keyIdx === -1) {
        // Handle enharmonics roughly
        if (selectedKey === 'C#') keyIdx = CIRCLE_OF_FIFTHS.indexOf('Db');
        else if (selectedKey === 'F#') keyIdx = CIRCLE_OF_FIFTHS.indexOf('Gb');
        else keyIdx = 5; // Default C
    }
    const startIdx = (keyIdx - 6 + 12) % 12;

    // Scale Intervals for highlighting
    const rootIdx = getNoteIndex(selectedKey);
    const scaleIntervals = SCALES[scaleName] || SCALES['Ionian (Major)'];
    const scaleIndices = new Set(scaleIntervals.map(i => (rootIdx + i) % 12));

    // Determine Visible Rows based on Complexity
    let visibleRows = ['Maj', 'Min'];
    if (complexity === 'moderate') visibleRows.push('Maj7', '7', 'm7');
    if (complexity === 'advanced') visibleRows.push('Maj7', '7', 'm7', '6', 'm6', 'Aug', 'Dim', 'm7b5');
    const visibleSet = new Set(visibleRows);

    for (let i = 0; i < 12; i++) {
        const noteIdx = (startIdx + i) % 12;
        const noteName = CIRCLE_OF_FIFTHS[noteIdx];
        const displayLabel = getNoteName(getNoteIndex(noteName), useFlats);
        
        const col = document.createElement('div');
        col.className = 'chord-col';
        
        const label = document.createElement('div');
        label.className = 'chord-col-label';
        label.textContent = displayLabel;
        col.appendChild(label);

        CHORD_ROWS.forEach(rowType => {
            // Simplified visibility logic (show basic by default)
            if (!visibleSet.has(rowType)) return; 

            const btn = document.createElement('button');
            btn.className = 'chord-btn';
            btn.textContent = rowType === 'Maj' ? displayLabel : `${displayLabel}\n${rowType}`;
            
            // Check if in key
            const cRootIdx = getNoteIndex(noteName);
            const cIntervals = CHORD_FORMULAS[rowType];
            const inKey = cIntervals.every(int => scaleIndices.has((cRootIdx + int) % 12));

            // Tooltip: Show chord tones
            const chordNotes = cIntervals.map(i => getNoteName(cRootIdx + i, useFlats)).join(', ');
            btn.title = `${displayLabel} ${rowType}: ${chordNotes}`;
            
            if (inKey) btn.classList.add('in-key');
            
            // Check if selected
            if (state.selectedChord && state.selectedChord.root === noteName && state.selectedChord.type === rowType) {
                btn.classList.add('selected');
            }

            btn.onclick = () => {
                if (state.selectedChord && state.selectedChord.root === noteName && state.selectedChord.type === rowType) {
                    state.selectedChord = null;
                } else {
                    state.selectedChord = { root: noteName, type: rowType };
                }
                renderChordSelector(); // Re-render to update selection styles
                update();
            };

            // Hover Effects
            btn.onmouseenter = () => {
                state.hoveredChord = { root: noteName, type: rowType };
                update();
            };
            btn.onmouseleave = () => {
                state.hoveredChord = null;
                update();
            };
            col.appendChild(btn);
        });
        container.appendChild(col);
    }
}

// --- Core Logic ---

function calculateTuning(copedent) {
    const currentTuning = {...copedent.tuning};
    const allControls = [...(copedent.pedals || []), ...(copedent.levers || [])];

    allControls.forEach(ctrl => {
        if (state.activeModifiers.has(ctrl.id)) {
            Object.entries(ctrl.changes).forEach(([s, shift]) => {
                if (currentTuning[s]) currentTuning[s] += shift;
            });
        }
    });
    return currentTuning;
}

function generateData() {
    const tuningName = document.getElementById('tuning-select').value;
    const copedent = COPEDENT_LIBRARY[tuningName];
    const currentTuning = calculateTuning(copedent);
    
    const rootVal = document.getElementById('root-select').value;
    const rootIndex = parseInt(rootVal);
    const scaleName = document.getElementById('mode-select').value;
    const scaleIntervals = SCALES[scaleName];
    
    const maxFret = parseInt(document.getElementById('max-fret').value) || 15;
    const showMarkers = true;
    const showFreq = document.getElementById('show-freq').checked;
    const labelMode = document.getElementById('fret-label-mode').value;
    const useFlats = document.getElementById('accidental-mode').value === 'flat';

    // Chord Logic
    let chordIndices = new Set();
    const activeChord = state.hoveredChord || state.selectedChord;
    if (activeChord) {
        const cRootIdx = getNoteIndex(activeChord.root);
        const cIntervals = CHORD_FORMULAS[activeChord.type];
        cIntervals.forEach(i => chordIndices.add((cRootIdx + i) % 12));
    }

    const notes = [];
    const fretLabels = [];

    // Generate Fret Labels (All frets) - Use BASE tuning (copedent), not currentTuning
    const string8Pitch = copedent.tuning[8] || 52; 
    for (let f = 0; f <= maxFret; f++) {
        let labelText;
        if (labelMode === 'note') {
            labelText = getNoteName(string8Pitch + f, useFlats);
        } else {
            labelText = f === 0 ? "Open" : f.toString();
        }
        fretLabels.push({fret: f, label: labelText});
    }

    // Generate Notes
    for (let s = 1; s <= copedent.num_strings; s++) {
        const openPitch = currentTuning[s];
        
        for (let f = -1; f <= maxFret + 1; f++) {
            const pitch = openPitch + f;
            const noteIndex = pitch % 12;
            const noteName = getNoteName(pitch, useFlats);
            
            // Determine Category
            let cat = 0; // Out
            let interval = (noteIndex - rootIndex + 12) % 12;
            
            if (interval === 0) cat = 2; // Root
            else if (scaleIntervals.includes(interval)) cat = 1; // Scale

            const isChordTone = chordIndices.size > 0 && chordIndices.has(noteIndex);
            
            // Frequency
            const freq = 440.0 * Math.pow(2, (pitch - 69) / 12.0);

            // ID Generation: String-Pitch (Enables sliding animation)
            const id = `S${s}-P${pitch}`;

            notes.push({
                id: id,
                fret: f,
                string: s,
                note: noteName,
                cat: cat,
                is_chord: isChordTone,
                freq: Math.round(freq) + "Hz"
            });
        }
    }

    return {
        max_fret: maxFret,
        num_strings: copedent.num_strings,
        show_markers: showMarkers,
        highlight_frets: MARKERS,
        show_freq: showFreq,
        min_adjacency: 1,
        fret_labels: fretLabels,
        notes: notes
    };
}

function update() {
    const data = generateData();
    
    // Render D3
    if (window.dash_clientside && window.dash_clientside.clientside.render_fretboard) {
        window.dash_clientside.clientside.render_fretboard(data);
    }
}

function updateRootOptions() {
    const rootSelect = document.getElementById('root-select');
    const useFlats = document.getElementById('accidental-mode').value === 'flat';
    const notes = useFlats ? NOTES_FLAT : NOTES_SHARP;
    const currentVal = rootSelect.value;
    
    rootSelect.innerHTML = '';
    notes.forEach((note, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = note;
        rootSelect.appendChild(opt);
    });
    rootSelect.value = currentVal;
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Populate Dropdowns
    const rootSelect = document.getElementById('root-select');
    NOTES_SHARP.forEach((note, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = note;
        if (note === "C") opt.selected = true;
        rootSelect.appendChild(opt);
    });

    const tuningSelect = document.getElementById('tuning-select');
    Object.keys(COPEDENT_LIBRARY).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.text = k;
        tuningSelect.appendChild(opt);
    });

    const modeSelect = document.getElementById('mode-select');
    Object.keys(SCALES).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.text = k;
        modeSelect.appendChild(opt);
    });

    // Listeners
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', () => {
            if (el.id === 'tuning-select') {
                state.activeModifiers.clear();
                renderPedalControls();
            }
            if (el.id === 'accidental-mode') {
                updateRootOptions();
            }
            if (el.id === 'root-select' || el.id === 'mode-select' || el.id === 'complexity-select' || el.id === 'accidental-mode') {
                renderChordSelector();
            }
            update();
        });
    });

    // --- Custom Tuning Modal Logic ---
    const tuningModal = document.getElementById("custom-tuning-modal");
    const tuningBtn = document.getElementById("custom-tuning-btn");
    const closeTuningBtn = document.getElementById("close-tuning-modal");
    const applyTuningBtn = document.getElementById("apply-custom-tuning");
    const tuningErrorMsg = document.getElementById("tuning-error");

    if (tuningBtn) {
        tuningBtn.onclick = () => {
            tuningModal.style.display = "block";
            const currentTuning = document.getElementById('tuning-select').value;
            const data = COPEDENT_LIBRARY[currentTuning];
            if (window.jsyaml) {
                document.getElementById("custom-tuning-input").value = jsyaml.dump(data);
            } else {
                document.getElementById("custom-tuning-input").value = "Error: js-yaml library not loaded.";
            }
            tuningErrorMsg.textContent = "";
        };
    }

    if (closeTuningBtn) {
        closeTuningBtn.onclick = () => { tuningModal.style.display = "none"; };
    }

    if (applyTuningBtn) {
        applyTuningBtn.onclick = () => {
            try {
                const input = document.getElementById("custom-tuning-input").value;
                const parsed = jsyaml.load(input);
                
                if (!parsed || !parsed.num_strings || !parsed.tuning) {
                    throw new Error("Invalid tuning definition. Must contain 'num_strings' and 'tuning'.");
                }

                COPEDENT_LIBRARY["User-defined"] = parsed;
                
                const tuningSelect = document.getElementById('tuning-select');
                let found = false;
                for (let i = 0; i < tuningSelect.options.length; i++) {
                    if (tuningSelect.options[i].value === "User-defined") {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    const opt = document.createElement('option');
                    opt.value = "User-defined";
                    opt.text = "User-defined";
                    tuningSelect.appendChild(opt);
                }
                
                tuningSelect.value = "User-defined";
                state.activeModifiers.clear();
                renderPedalControls();
                update();
                tuningModal.style.display = "none";
            } catch (e) {
                tuningErrorMsg.textContent = e.message;
            }
        };
    }

    // --- Custom Scale Modal Logic ---
    const scaleModal = document.getElementById("custom-scale-modal");
    const scaleBtn = document.getElementById("custom-scale-btn");
    const closeScaleBtn = document.getElementById("close-scale-modal");
    const applyScaleBtn = document.getElementById("apply-custom-scale");
    const scaleErrorMsg = document.getElementById("scale-error");

    if (scaleBtn) {
        scaleBtn.onclick = () => {
            scaleModal.style.display = "block";
            const currentScale = document.getElementById('mode-select').value;
            const data = SCALES[currentScale];
            if (window.jsyaml) {
                document.getElementById("custom-scale-input").value = jsyaml.dump(data);
            } else {
                document.getElementById("custom-scale-input").value = "Error: js-yaml library not loaded.";
            }
            scaleErrorMsg.textContent = "";
        };
    }

    if (closeScaleBtn) {
        closeScaleBtn.onclick = () => { scaleModal.style.display = "none"; };
    }

    if (applyScaleBtn) {
        applyScaleBtn.onclick = () => {
            try {
                const input = document.getElementById("custom-scale-input").value;
                const parsed = jsyaml.load(input);

                if (!Array.isArray(parsed) || !parsed.every(Number.isInteger)) {
                    throw new Error("Invalid scale definition. Must be a list of integers (e.g., [0, 2, 4...]).");
                }

                SCALES["User-defined"] = parsed;

                const modeSelect = document.getElementById('mode-select');
                // Add option if it doesn't exist
                if (![...modeSelect.options].some(opt => opt.value === "User-defined")) {
                    const opt = document.createElement('option');
                    opt.value = "User-defined";
                    opt.text = "User-defined";
                    modeSelect.appendChild(opt);
                }

                modeSelect.value = "User-defined";
                renderChordSelector();
                update();
                scaleModal.style.display = "none";
            } catch (e) {
                scaleErrorMsg.textContent = e.message;
            }
        };
    }

    // Close modals on outside click
    window.onclick = (event) => {
        if (event.target == tuningModal) { tuningModal.style.display = "none"; }
        if (event.target == scaleModal) { scaleModal.style.display = "none"; }
    };

    // Initial Render
    renderPedalControls();
    renderChordSelector();
    update();
});