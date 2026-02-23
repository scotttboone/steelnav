import React, { useMemo } from 'react';
import styles from './Fretboard.module.css';
import { midiToNoteName, getFrequency } from '../utils';

const Fretboard = ({
  tuning,
  numStrings,
  maxFret = 24,
  activeModifiers,
  scaleIndices,
  rootIndex,
  chordIndices,
  highlightRoot,
  useFlats,
  nightMode,
  showFreq,
  fretLabelMode, // 'number' or 'note'
  string8Open // for calculating fret labels in 'note' mode
}) => {
  
  // Configuration for SVG dimensions
  const config = {
    fretWidth: 50,
    stringHeight: 30,
    nutWidth: 10,
    topMargin: 30,
    leftMargin: 40,
    circleRadius: 12
  };

  const width = (maxFret + 1) * config.fretWidth + config.leftMargin;
  const height = numStrings * config.stringHeight + config.topMargin;

  // Generate Data for Rendering
  const notesData = useMemo(() => {
    const data = [];
    const minMidi = 24;
    const maxMidi = 100;

    // Iterate strings (1-based index in data, 0-based for rendering)
    for (let s = 1; s <= numStrings; s++) {
      const openPitch = tuning[s];
      if (openPitch === undefined) continue;

      for (let pitch = minMidi; pitch < maxMidi; pitch++) {
        const fret = pitch - openPitch;
        
        if (fret >= 0 && fret <= maxFret) {
          const noteIdx = pitch % 12;
          let category = 'out';
          
          if (noteIdx === rootIndex && highlightRoot) category = 'root';
          else if (scaleIndices.has(noteIdx)) category = 'scale';
          
          // Chord overrides scale color if present
          const isChordTone = chordIndices && chordIndices.has(noteIdx);

          data.push({
            string: s,
            fret,
            pitch,
            noteName: midiToNoteName(pitch, useFlats),
            freq: getFrequency(pitch).toFixed(1),
            category,
            isChordTone
          });
        }
      }
    }
    return data;
  }, [tuning, numStrings, maxFret, rootIndex, scaleIndices, chordIndices, highlightRoot, useFlats]);

  return (
    <div className={`${styles.container} ${nightMode ? styles.night : styles.day}`}>
      <div className={styles.scrollWrapper}>
        <svg width={width} height={height}>
          {/* Draw Frets (Vertical Lines) */}
          {Array.from({ length: maxFret + 1 }).map((_, i) => (
            <g key={`fret-${i}`}>
              <line
                x1={config.leftMargin + i * config.fretWidth}
                y1={config.topMargin}
                x2={config.leftMargin + i * config.fretWidth}
                y2={height - 10}
                className={i === 0 ? styles.nut : styles.fretLine}
              />
              {/* Fret Labels */}
              <text
                x={config.leftMargin + i * config.fretWidth}
                y={20}
                className={styles.fretLabel}
                textAnchor="middle"
              >
                {fretLabelMode === 'note' 
                  ? midiToNoteName(string8Open + i, useFlats) 
                  : (i === 0 ? "Open" : i)}
              </text>
            </g>
          ))}

          {/* Draw Strings (Horizontal Lines) */}
          {Array.from({ length: numStrings }).map((_, i) => (
            <line
              key={`str-${i}`}
              x1={config.leftMargin}
              y1={config.topMargin + i * config.stringHeight}
              x2={width - config.fretWidth/2}
              y2={config.topMargin + i * config.stringHeight}
              className={styles.stringLine}
            />
          ))}

          {/* Draw Notes */}
          {notesData.map((n) => {
            // Only render if it's in scale or a chord tone (or root)
            if (n.category === 'out' && !n.isChordTone) return null;

            const cx = config.leftMargin + n.fret * config.fretWidth;
            const cy = config.topMargin + (n.string - 1) * config.stringHeight;
            
            let circleClass = styles.noteCircle;
            let textClass = styles.noteText;

            if (n.category === 'root') {
              circleClass = styles.rootNote;
            } else if (n.isChordTone) {
              if (n.category === 'out') {
                circleClass = styles.chordNoteOut;
                textClass = `${styles.noteText} ${styles.textOut}`;
              } else {
                circleClass = styles.chordNote;
              }
            } else if (n.category === 'scale') {
              circleClass = styles.scaleNote;
            }

            return (
              <g key={`n-${n.string}-${n.fret}`} className={styles.noteGroup}>
                <circle cx={cx} cy={cy} r={config.circleRadius} className={circleClass} />
                <text x={cx} y={cy} dy=".3em" textAnchor="middle" className={textClass}>
                  {n.noteName}
                </text>
                {showFreq && <text x={cx} y={cy + 20} textAnchor="middle" className={styles.freqText}>{n.freq}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Fretboard;