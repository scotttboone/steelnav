import { NOTES_SHARP, NOTES_FLAT, NOTE_TO_INT } from './constants';

export function midiToNoteName(midiNumber, useFlats = false) {
  const noteIndex = midiNumber % 12;
  const notesList = useFlats ? NOTES_FLAT : NOTES_SHARP;
  return notesList[noteIndex];
}

export function calculateTuning(copedentData, activeModifiers) {
  if (!copedentData) return {};

  // Create a shallow copy of the base tuning
  // Ensure keys are treated as integers if needed, though JS objects use string keys
  const currentTuning = { ...copedentData.tuning };

  // Combine pedals and levers
  const allControls = [...(copedentData.pedals || []), ...(copedentData.levers || [])];
  
  // Create a map for quick lookup: { "A": { "5": 2, ... } }
  const controlMap = {};
  allControls.forEach(c => {
    controlMap[c.id] = c.changes;
  });

  // Apply active modifiers
  activeModifiers.forEach(modId => {
    if (controlMap[modId]) {
      const changes = controlMap[modId];
      for (const [stringIdx, shift] of Object.entries(changes)) {
        if (currentTuning[stringIdx] !== undefined) {
          currentTuning[stringIdx] += shift;
        }
      }
    }
  });

  return currentTuning;
}

export function getFrequency(midiNumber) {
  return 440.0 * Math.pow(2, (midiNumber - 69) / 12.0);
}