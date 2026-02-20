window.FretboardApp = window.FretboardApp || {};
window.FretboardApp.render = function(data) {
            if (!data) return window.dash_clientside.no_update;

            const containerId = '#fretboard-container';
            const notes = data.notes;
            const maxFret = data.max_fret;
            const fretLabels = data.fret_labels || [];
            const showMarkers = data.show_markers;
            const minAdjacency = data.min_adjacency || 1;
            const numStrings = data.num_strings || 10;
            const showFreq = data.show_freq || false;
            const transitionDuration = data.transition_duration !== undefined ? data.transition_duration : 500;

            // --- Colors ---
            const theme = { bg: '#fff', cell: '#fff', cellHigh: '#f0f0f0', stroke: '#ddd', text: '#000', markerBg: '#000', markerText: '#fff', noteOut: '#b2b2b2', noteScale: '#a5d6a7', noteRoot: '#42a5f5', noteTextOut: '#555', noteTextIn: '#000', noteTextRoot: '#fff', groupStroke: '#000' };
            
            // --- Configuration ---
            const cellSize = 40; // Fixed square size in pixels
            const labelGap = 15; // Whitespace between fretboard and labels
            const margin = { top: 30, right: 30, bottom: 30, left: 50 };
            const width = (maxFret + 1) * cellSize + margin.left + margin.right;
            const height = numStrings * cellSize + labelGap + cellSize + margin.top + margin.bottom;

            // Select container
            const container = d3.select(containerId);
            
            // Create SVG if it doesn't exist
            let svg = container.select('svg');
            if (svg.empty()) {
                svg = container.append('svg');
                
                // Define Clip Path
                const defs = svg.append('defs');
                defs.append('clipPath')
                    .attr('id', 'fretboard-clip')
                    .append('rect');

                // Add groups for layers
                const g = svg.append('g').attr('class', 'main-group');
                g.append('g').attr('class', 'grid-layer');
                g.append('g').attr('class', 'labels-layer');
                g.append('g')
                    .attr('class', 'notes-layer')
                    .attr('clip-path', 'url(#fretboard-clip)');
            }

            // Update SVG dimensions
            svg.attr('viewBox', `0 0 ${width} ${height}`)
               .style('max-width', '100%')
               .style('height', 'auto');
            const g = svg.select('.main-group')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Update Clip Path Dimensions
            // Clip to the grid area (width) and strings area (height)
            svg.select('#fretboard-clip rect')
                .attr('width', (maxFret + 1) * cellSize)
                .attr('height', numStrings * cellSize);

            // --- Scales ---
            // X: Frets (0 to maxFret)
            const x = d3.scaleLinear()
                .domain([0, maxFret + 1])
                .range([0, (maxFret + 1) * cellSize]);

            // Y: Strings (1 to 10)
            const y = d3.scaleLinear()
                .domain([1, numStrings + 1]) // 1 is top, N is bottom
                .range([0, numStrings * cellSize]);

            // --- Grid / Fretboard Background ---
            const gridLayer = g.select('.grid-layer');
            
            // Generate grid data (one square per fret/string intersection)
            const gridData = [];
            // Standard markers: 3, 5, 7, 9, 12, 15, 17, 19, 21, 24...
            const highlightFrets = data.highlight_frets || [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
            
            for (let f = 0; f <= maxFret; f++) {
                for (let s = 1; s <= numStrings; s++) {
                    gridData.push({ f, s, highlight: showMarkers && highlightFrets.includes(f) });
                }
            }

            const cells = gridLayer.selectAll('.fret-cell')
                .data(gridData, d => `${d.f}-s${d.s}`);

            const cellsEnter = cells.enter().append('rect')
                .attr('class', 'fret-cell')
                .attr('stroke', theme.stroke)
                .attr('stroke-width', 1);

            cellsEnter.merge(cells)
                .attr('x', d => x(d.f))
                .attr('y', d => y(d.s))
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', d => d.highlight ? theme.cellHigh : theme.cell)
                .attr('stroke', theme.stroke);
            cells.exit().remove();
            
            // --- Fret Labels (Bottom Row) ---
            const labelsLayer = g.select('.labels-layer');
            const labelGroups = labelsLayer.selectAll('.label-group')
                .data(fretLabels, d => d.fret);

            // Enter
            const labelEnter = labelGroups.enter().append('g')
                .attr('class', 'label-group');

            labelEnter.append('rect')
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', d => highlightFrets.includes(d.fret) ? theme.markerBg : theme.cell) 
                .attr('stroke', '#ccc');
            labelEnter.append('text')
                .attr('x', cellSize / 2)
                .attr('y', cellSize / 2)
                .attr('dy', '0.35em')
                .attr('fill', d => highlightFrets.includes(d.fret) ? theme.markerText : theme.text) 
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px');

            // Update
            const allLabels = labelEnter.merge(labelGroups);
            
            allLabels.attr('transform', d => `translate(${x(d.fret)}, ${numStrings * cellSize + labelGap})`);
            
            allLabels.select('rect').attr('fill', d => highlightFrets.includes(d.fret) ? theme.markerBg : theme.cell).attr('stroke', theme.stroke);
            allLabels.select('text').text(d => d.label).attr('fill', d => highlightFrets.includes(d.fret) ? theme.markerText : theme.text);
            
            // Exit
            labelGroups.exit().remove();
            // --- Grouping Logic for Chord Highlights ---
            // 1. Organize notes by fret
            const notesByFret = {};
            // Reset group flags
            notes.forEach(n => {
                n.group_pos = null; 
                if (!notesByFret[n.fret]) notesByFret[n.fret] = [];
                notesByFret[n.fret].push(n);
            });

            // 2. Find vertical runs of chord tones
            Object.keys(notesByFret).forEach(fret => {
                const fretNotes = notesByFret[fret];
                // Sort by string index (1 is top, 10 is bottom)
                fretNotes.sort((a, b) => a.string - b.string);
                
                let currentRun = [];
                
                const processRun = (run) => {
                    if (run.length >= minAdjacency) {
                        run.forEach((n, i) => {
                            if (run.length === 1) {
                                n.group_pos = 'single';
                            } else if (i === 0) {
                                n.group_pos = 'start'; // Top
                            } else if (i === run.length - 1) {
                                n.group_pos = 'end';   // Bottom
                            } else {
                                n.group_pos = 'mid';
                            }
                        });
                    }
                };

                for (let i = 0; i < fretNotes.length; i++) {
                    const note = fretNotes[i];
                    if (note.is_chord) {
                        if (currentRun.length > 0 && note.string === currentRun[currentRun.length - 1].string + 1) {
                            currentRun.push(note);
                        } else {
                            processRun(currentRun);
                            currentRun = [note];
                        }
                    } else {
                        processRun(currentRun);
                        currentRun = [];
                    }
                }
                processRun(currentRun);
            });

            // Helper to generate path for highlight segments
            const getHighlightPath = (pos) => {
                const r = 4; // Corner radius
                // Use full cell dimensions for filled background (creates ~2px border around note)
                const l = 0, t = 0, r_edge = cellSize, b = cellSize;
                const cellT = 0, cellB = cellSize;
                
                if (!pos) return '';
                
                // Closed shapes for filling
                if (pos === 'single') return `M ${l},${t+r} Q ${l},${t} ${l+r},${t} H ${r_edge-r} Q ${r_edge},${t} ${r_edge},${t+r} V ${b-r} Q ${r_edge},${b} ${r_edge-r},${b} H ${l+r} Q ${l},${b} ${l},${b-r} Z`;
                
                // Start (Top): Rounded top, flat bottom
                if (pos === 'start') return `M ${l},${cellB} V ${t+r} Q ${l},${t} ${l+r},${t} H ${r_edge-r} Q ${r_edge},${t} ${r_edge},${t+r} V ${cellB} Z`;
                
                // Mid: Flat top and bottom
                if (pos === 'mid') return `M ${l},${cellB} V ${cellT} H ${r_edge} V ${cellB} Z`;
                
                // End (Bottom): Flat top, rounded bottom
                if (pos === 'end') return `M ${l},${cellT} V ${b-r} Q ${l},${b} ${l+r},${b} H ${r_edge-r} Q ${r_edge},${b} ${r_edge},${b-r} V ${cellT} Z`;
            };

            // --- Notes Rendering ---
            const t = svg.transition().duration(transitionDuration).ease(d3.easeCubicInOut);
            const notesLayer = g.select('.notes-layer');

            // Data Join with ID for smooth sliding
            const noteGroups = notesLayer.selectAll('.note-group')
                .data(notes, d => d.id);

            // EXIT
            noteGroups.exit()
                .transition(t)
                .attr('opacity', 0)
                .remove();

            // ENTER
            const enter = noteGroups.enter().append('g')
                .attr('class', 'note-group')
                .attr('opacity', 0)
                .attr('transform', d => `translate(${x(d.fret)}, ${y(d.string)})`);

            // Add Highlight Path (Behind the rect)
            enter.append('path')
                .attr('class', 'chord-highlight')
                .attr('fill', theme.groupStroke)
                .attr('stroke', 'none');

            enter.append('rect')
                .attr('width', cellSize - 4)
                .attr('height', cellSize - 4)
                .attr('x', 2).attr('y', 2)
                .attr('rx', 4); // Rounded corners

            enter.append('text')
                .attr('x', cellSize / 2)
                .attr('y', cellSize / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .style('pointer-events', 'none');

            // UPDATE (Merge Enter + Existing)
            const allNotes = enter.merge(noteGroups);

            allNotes.transition(t)
                .attr('opacity', 1)
                .attr('transform', d => `translate(${x(d.fret)}, ${y(d.string)})`);

            // Update Colors and Text
            const colors = [theme.noteOut, theme.noteScale, theme.noteRoot]; // Out, Scale, Root
            const textColors = [theme.noteTextOut, theme.noteTextIn, theme.noteTextRoot];
            
            const chordSelected = notes.some(n => n.is_chord);
            const lighterColors = colors.map(c => d3.interpolateRgb(c, "#fff")(0.25));
            // Ensure 'Out' notes (index 0) don't get lighter, only scale/root tones
            lighterColors[0] = colors[0];

            allNotes.select('rect')
                .transition(t)
                .attr('fill', d => (chordSelected && !d.is_chord) ? lighterColors[d.cat] : colors[d.cat])
                .attr('stroke', d => d.cat > 0 ? '#333' : 'none') 
                .attr('stroke-width', 1);

            // Update Highlight Path
            allNotes.select('.chord-highlight')
                .transition(t)
                .attr('d', d => getHighlightPath(d.group_pos))
                .attr('opacity', d => d.group_pos ? 1 : 0);

            // Update Text (Note Name + Optional Frequency)
            allNotes.select('text').each(function(d) {
                const el = d3.select(this);
                el.text(''); // Clear existing
                el.append('tspan').text(d.note).attr('x', cellSize/2).attr('dy', showFreq ? '-0.3em' : '0.35em');
                if (showFreq) {
                    el.append('tspan').text(d.freq).attr('x', cellSize/2).attr('dy', '1.2em').attr('font-size', '9px');
                }
            });
            
            allNotes.select('text')
                .attr('fill', d => (d.cat === 0 && d.is_chord) ? '#000' : textColors[d.cat])
                .style('font-weight', d => d.is_chord ? 'bold' : 'normal');

            return "rendered";
        };