import React, { useState, useMemo } from 'react';
import './App.css';
import Fretboard from './components/Fretboard';
import { 
  COPEDENT_LIBRARY, 
  NOTES_SHARP, 
  NOTES_FLAT, 
  SCALE_DEFINITIONS, 
  NOTE_TO_INT, 
  INTERVAL_NAMES 
} from './constants';
import { calculateTuning } from './utils';

function App() {
  // --- State ---
  const [tuningName, setTuningName] = useState('E9 Custom');
  const [key, setKey] = useState('C');
  const [scaleName, setScaleName] = useState('Major');
  const [accidental, setAccidental] = useState('sharp'); // 'sharp' or 'flat'
  const [activeModifiers, setActiveModifiers] = useState([]);
  const [nightMode, setNightMode] = useState(false);
  const [showFreq, setShowFreq] = useState(false);
  const [highlightRoot, setHighlightRoot] = useState(true);
  const [fretLabelMode, setFretLabelMode] = useState('number');

  // --- Derived Data ---
  const useFlats = accidental === 'flat';
  const copedent = COPEDENT_LIBRARY[tuningName];
  const currentTuning = useMemo(() => calculateTuning(copedent, activeModifiers), [copedent, activeModifiers]);

  // Calculate Scale Indices
  const { rootIndex, scaleIndices } = useMemo(() => {
    const rIdx = NOTE_TO_INT[key] !== undefined ? NOTE_TO_INT[key] : 0;
    const intervals = SCALE_DEFINITIONS[scaleName] || SCALE_DEFINITIONS['Major'];
    const indices = new Set(intervals.map(i => (rIdx + i) % 12));
    return { rootIndex: rIdx, scaleIndices: indices };
  }, [key, scaleName]);

  // --- Handlers ---
  const toggleModifier = (id) => {
    // Check for compounds
    const compound = copedent.compounds?.find(c => c.id === id);
    let idsToToggle = compound ? compound.components : [id];

    // Check if all are currently active
    const allActive = idsToToggle.every(mid => activeModifiers.includes(mid));

    if (allActive) {
      // Remove all
      setActiveModifiers(prev => prev.filter(m => !idsToToggle.includes(m)));
    } else {
      // Add missing
      setActiveModifiers(prev => {
        const next = [...prev];
        idsToToggle.forEach(mid => {
          if (!next.includes(mid)) next.push(mid);
        });
        return next;
      });
    }
  };

  // Helper to render pedal/lever buttons
  const renderControls = () => {
    if (!copedent) return null;
    
    // Group Levers
    const leversByGroup = {};
    (copedent.levers || []).forEach(l => {
      const g = l.group || 'Other';
      if (!leversByGroup[g]) leversByGroup[g] = [];
      leversByGroup[g].push(l);
    });

    return (
      <div className="controls-section">
        {/* Levers */}
        <div className="levers-row">
          {Object.entries(leversByGroup).map(([group, levers]) => (
            <fieldset key={group} className="lever-group">
              <legend>{group}</legend>
              {levers.map(l => (
                <button
                  key={l.id}
                  className={`control-btn ${activeModifiers.includes(l.id) ? 'active' : ''}`}
                  onClick={() => toggleModifier(l.id)}
                  title={`Changes: ${JSON.stringify(l.changes).replace(/[{"}]/g, '').replace(/,/g, ', ')}`}
                >
                  {l.label}
                </button>
              ))}
            </fieldset>
          ))}
        </div>

        {/* Pedals */}
        <div className="pedals-row">
          {(copedent.pedals || []).map((p, i, arr) => {
            // Check for compound between this and next
            let compoundBtn = null;
            if (i < arr.length - 1) {
              const nextP = arr[i+1];
              const compound = copedent.compounds?.find(c => 
                c.components.length === 2 && c.components.includes(p.id) && c.components.includes(nextP.id)
              );
              
              if (compound) {
                const isActive = compound.components.every(c => activeModifiers.includes(c));
                compoundBtn = (
                  <button
                    key={compound.id}
                    className={`compound-btn ${isActive ? 'active' : ''}`}
                    onClick={() => toggleModifier(compound.id)}
                    title={compound.title}
                  >
                    {compound.label}
                  </button>
                );
              }
            }

            return (
              <React.Fragment key={p.id}>
                <button
                  className={`control-btn ${activeModifiers.includes(p.id) ? 'active' : ''}`}
                  onClick={() => toggleModifier(p.id)}
                >
                  {p.label}
                </button>
                {compoundBtn}
              </React.Fragment>
            );
          })}
        </div>

        {/* Reset Button */}
        {activeModifiers.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <button className="reset-btn" onClick={() => setActiveModifiers([])}>
              Reset Pedals
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`app-container ${nightMode ? 'night' : 'day'}`}>
      <div className="sidebar">
        <h2>Controls</h2>
        
        <label>Tuning</label>
        <select value={tuningName} onChange={e => setTuningName(e.target.value)}>
          {Object.keys(COPEDENT_LIBRARY).map(k => <option key={k} value={k}>{k}</option>)}
        </select>

        <label>Key</label>
        <select value={key} onChange={e => setKey(e.target.value)}>
          {(useFlats ? NOTES_FLAT : NOTES_SHARP).map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <label>Scale</label>
        <select value={scaleName} onChange={e => setScaleName(e.target.value)}>
          {Object.keys(SCALE_DEFINITIONS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <hr />
        
        <label>
          <input type="checkbox" checked={nightMode} onChange={e => setNightMode(e.target.checked)} />
          Night Mode
        </label>
        <label>
          <input type="checkbox" checked={showFreq} onChange={e => setShowFreq(e.target.checked)} />
          Show Hz
        </label>
        <label>
          <input type="checkbox" checked={highlightRoot} onChange={e => setHighlightRoot(e.target.checked)} />
          Highlight Root
        </label>
      </div>

      <div className="main-content">
        <h1>Pedal Steel Explorer</h1>
        <Fretboard 
          tuning={currentTuning}
          numStrings={copedent.num_strings}
          activeModifiers={activeModifiers}
          scaleIndices={scaleIndices}
          rootIndex={rootIndex}
          highlightRoot={highlightRoot}
          useFlats={useFlats}
          nightMode={nightMode}
          showFreq={showFreq}
          fretLabelMode={fretLabelMode}
          string8Open={copedent.tuning[8]}
        />
        {renderControls()}
      </div>
    </div>
  );
}

export default App;