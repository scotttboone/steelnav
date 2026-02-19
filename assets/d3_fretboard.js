window.dash_clientside = window.dash_clientside || {};
window.dash_clientside.clientside = window.dash_clientside.clientside || {};
window.dash_clientside.clientside.render_fretboard = function(data) {
            if (!data) return window.dash_clientside.no_update;

            const containerId = '#fretboard-container';
            const notes = data.notes;
            const maxFret = data.max_fret;
            const fretLabels = data.fret_labels || [];
            const showMarkers = data.show_markers;
            const minAdjacency = data.min_adjacency || 1;
            const numStrings = data.num_strings || 10;
            const showFreq = data.show_freq || false;
            const nightMode = data.night_mode || false;

            // --- Colors ---
            const theme = nightMode 
                ? { bg: '#1e1e1e', cell: '#222', cellHigh: '#333', stroke: '#444', text: '#eee', markerBg: '#eee', markerText: '#000', noteOut: '#444', noteScale: '#66bb6a', noteRoot: '#29b6f6', noteTextOut: '#aaa', noteTextIn: '#000', noteTextRoot: '#000', groupStroke: '#fff' }
                : { bg: '#fff', cell: '#fff', cellHigh: '#f0f0f0', stroke: '#ddd', text: '#000', markerBg: '#000', markerText: '#fff', noteOut: '#eeeeee', noteScale: '#a5d6a7', noteRoot: '#42a5f5', noteTextOut: '#ccc', noteTextIn: '#000', noteTextRoot: '#fff', groupStroke: '#000' };
            
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
                g.append('g')
                    .attr('class', 'highlights-layer')
                    .attr('clip-path', 'url(#fretboard-clip)');
            }

            // Update SVG dimensions
            svg.attr('width', width).attr('height', height);
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
            notes.forEach(n => {
                n.in_group = false; // Reset flag
                if (!notesByFret[n.fret]) notesByFret[n.fret] = [];
                notesByFret[n.fret].push(n);
            });

            const groups = [];

            // 2. Find vertical runs of chord tones
            Object.keys(notesByFret).forEach(fret => {
                const fretNotes = notesByFret[fret];
                // Sort by string index (1 is top, 10 is bottom)
                fretNotes.sort((a, b) => a.string - b.string);
                
                let currentRun = [];
                
                const processRun = (run) => {
                    if (run.length >= minAdjacency) {
                        groups.push({
                            fret: parseInt(fret),
                            startString: run[0].string,
                            endString: run[run.length - 1].string,
                            count: run.length,
                            id: `G-F${fret}-S${run[0].string}`
                        });
                        run.forEach(n => n.in_group = true);
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

            // --- Notes Rendering ---
            const t = svg.transition().duration(500).ease(d3.easeCubicInOut);
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

            allNotes.select('rect')
                .transition(t)
                .attr('fill', d => colors[d.cat])
                // Only draw individual stroke if NOT in a group
                .attr('stroke', d => (d.is_chord && !d.in_group) ? theme.groupStroke : (d.cat > 0 ? '#333' : 'none')) 
                .attr('stroke-width', d => (d.is_chord && !d.in_group) ? 3 : 1);

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
                .attr('fill', d => textColors[d.cat])
                .style('font-weight', d => d.is_chord ? 'bold' : 'normal');

            // --- Highlights Layer (Group Borders) ---
            const highlightsLayer = g.select('.highlights-layer');
            const groupRects = highlightsLayer.selectAll('.group-rect')
                .data(groups, d => d.id);

            groupRects.exit().remove();

            groupRects.enter().append('rect')
                .attr('class', 'group-rect')
                .attr('fill', 'none')
                .attr('stroke', theme.groupStroke)
                .attr('stroke-width', 3)
                .attr('rx', 4)
                .attr('opacity', 0) // Start invisible for fade-in
                .attr('x', d => x(d.fret) + 2) // Set initial position
                .attr('y', d => y(d.startString) + 2)
                .attr('width', cellSize - 4)
                .attr('height', d => (d.endString - d.startString + 1) * cellSize - 4)
                .merge(groupRects)
                .attr('opacity', 1) // Fade in
                .attr('stroke', theme.groupStroke)
                .attr('x', d => x(d.fret) + 2)
                .attr('y', d => y(d.startString) + 2)
                .attr('width', cellSize - 4)
                .attr('height', d => (d.endString - d.startString + 1) * cellSize - 4);

            return "rendered";
        };