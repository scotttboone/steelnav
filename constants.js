export const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const INTERVAL_NAMES = ['1', 'b2', '2', 'm3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

export const SCALE_DEFINITIONS = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Minor': [0, 2, 3, 5, 7, 8, 10],
  'Major Pentatonic': [0, 2, 4, 7, 9],
  'Minor Pentatonic': [0, 3, 5, 7, 10],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10]
};

export const CHORD_FORMULAS = {
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

export const CIRCLE_OF_FIFTHS = ['Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#'];
export const CHORD_ROWS = ['Maj', 'Min', 'Maj7', '7', 'm7', '6', 'm6', 'Aug', 'Dim', 'm7b5'];

// Generate Lookup Map
export const NOTE_TO_INT = {};
NOTES_SHARP.forEach((n, i) => NOTE_TO_INT[n] = i);
NOTES_FLAT.forEach((n, i) => NOTE_TO_INT[n] = i);

export const COPEDENT_LIBRARY = {
  "E9 Custom": {
    "num_strings": 10,
    "tuning": { 1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47 },
    "pedals": [
      { "id": "A", "label": "A", "changes": { "5": 2, "10": 2 } },
      { "id": "B", "label": "B", "changes": { "3": 1, "6": 1 } },
      { "id": "C", "label": "C", "changes": { "4": 2, "5": 2 } },
      { "id": "D", "label": "D", "changes": { "5": -1, "6": -2, "10": -1 } }
    ],
    "levers": [
      { "id": "LL", "label": "LL", "group": "Left Knee", "changes": { "4": 1, "8": 1 } },
      { "id": "LV", "label": "LV", "group": "Left Knee", "changes": { "6": -1 } },
      { "id": "LR", "label": "LR", "group": "Left Knee", "changes": { "4": -1, "8": -1 } },
      { "id": "RL", "label": "RL", "group": "Right Knee", "changes": { "1": 1, "7": 1 } },
      { "id": "RR1", "label": "RR1", "group": "Right Knee", "changes": { "2": -1, "9": -1 } },
      { "id": "RR2", "label": "RR2", "group": "Right Knee", "changes": { "2": -2, "9": -1 } }
    ],
    "compounds": [
      { "id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B" },
      { "id": "BC", "label": "", "components": ["B", "C"], "title": "Toggle B+C" }
    ]
  },
  "E9 Emmons": {
    "num_strings": 10,
    "tuning": { 1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47 },
    "pedals": [
      { "id": "A", "label": "A", "changes": { "5": 2, "10": 2 } },
      { "id": "B", "label": "B", "changes": { "3": 1, "6": 1 } },
      { "id": "C", "label": "C", "changes": { "4": 2, "5": 2 } }
    ],
    "levers": [
      { "id": "LKL", "label": "LKL", "group": "Left Knee", "changes": { "4": 1, "8": 1 } },
      { "id": "LKR", "label": "LKR", "group": "Left Knee", "changes": { "4": -1, "8": -1 } },
      { "id": "RKL", "label": "RKL", "group": "Right Knee", "changes": { "1": 1, "7": 1 } },
      { "id": "RKR", "label": "RKR", "group": "Right Knee", "changes": { "2": -1, "9": -1 } }
    ],
    "compounds": [{ "id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B" }]
  },
  "E9 Day": {
    "num_strings": 10,
    "tuning": { 1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47 },
    "pedals": [
      { "id": "A", "label": "A", "changes": { "3": 1, "6": 1 } },
      { "id": "B", "label": "B", "changes": { "5": 2, "10": 2 } },
      { "id": "C", "label": "C", "changes": { "4": 2, "5": 2 } }
    ],
    "levers": [
      { "id": "LKL", "label": "LKL", "group": "Left Knee", "changes": { "4": 1, "8": 1 } },
      { "id": "LKR", "label": "LKR", "group": "Left Knee", "changes": { "4": -1, "8": -1 } }
    ],
    "compounds": []
  },
  "C6 Standard": {
    "num_strings": 10,
    "tuning": { 1: 67, 2: 64, 3: 60, 4: 57, 5: 55, 6: 52, 7: 48, 8: 45, 9: 41, 10: 36 },
    "pedals": [
      { "id": "P4", "label": "P4", "changes": { "4": 2, "8": 2 } },
      { "id": "P5", "label": "P5", "changes": { "1": 1, "5": 1, "9": 2, "10": 2 } },
      { "id": "P6", "label": "P6", "changes": { "2": -1, "6": -1 } },
      { "id": "P7", "label": "P7", "changes": { "3": 2, "7": 2 } },
      { "id": "P8", "label": "P8", "changes": { "4": -2, "8": -2 } }
    ],
    "levers": [
      { "id": "LKL", "label": "LKL", "group": "Left Knee", "changes": { "1": -1, "5": -1 } },
      { "id": "LKR", "label": "LKR", "group": "Left Knee", "changes": { "2": 1, "6": 1 } }
    ],
    "compounds": []
  },
  "12-string Universal": {
    "num_strings": 12,
    "tuning": { 1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 51, 10: 49, 11: 47, 12: 44 },
    "pedals": [
      { "id": "A", "label": "A", "changes": { "5": 2, "10": 2 } },
      { "id": "B", "label": "B", "changes": { "3": 1, "6": 1 } },
      { "id": "C", "label": "C", "changes": { "4": 2, "5": 2 } },
      { "id": "P5", "label": "P5", "changes": { "9": -1, "10": -1 } },
      { "id": "P6", "label": "P6", "changes": { "2": -1 } }
    ],
    "levers": [
      { "id": "LKL", "label": "LKL", "group": "Left Knee", "changes": { "4": 1, "8": 1 } },
      { "id": "LKR", "label": "LKR", "group": "Left Knee", "changes": { "4": -1, "8": -1 } }
    ],
    "compounds": [{ "id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B" }]
  }
};