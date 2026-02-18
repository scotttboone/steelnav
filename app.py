import dash
from dash import dcc, html, Input, Output, State, ClientsideFunction, ALL, MATCH
import json

# --- Music Theory Constants ---
NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
NOTES_FLAT =  ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
INTERVAL_NAMES = ['1', 'b2', '2', 'm3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']

SCALE_DEFINITIONS = {
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Major Pentatonic': [0, 2, 4, 7, 9],
    'Minor Pentatonic': [0, 3, 5, 7, 10],
    'Mixolydian': [0, 2, 4, 5, 7, 9, 10]
}

# Chord Definitions
CHORD_FORMULAS = {
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
}
CIRCLE_OF_FIFTHS = ['Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#']
CHORD_ROWS = ['Maj', 'Min', 'Maj7', '7', 'm7', '6', 'm6', 'Aug', 'Dim', 'm7b5']

# Lookup for note name to integer (0-11)
NOTE_TO_INT = {n: i for i, n in enumerate(NOTES_SHARP)}
NOTE_TO_INT.update({n: i for i, n in enumerate(NOTES_FLAT)})

def midi_to_note_name(midi_number, use_flats=False):
    """Converts MIDI number to note name (e.g., 60 -> C4)."""
    note_index = midi_number % 12
    notes_list = NOTES_FLAT if use_flats else NOTES_SHARP
    return notes_list[note_index]

def get_chord_tooltip(root, chord_type, use_flats=False):
    """Generates a tooltip string showing the notes in the chord."""
    root_idx = NOTE_TO_INT.get(root, 0)
    intervals = CHORD_FORMULAS.get(chord_type, [])
    
    note_names = [midi_to_note_name(root_idx + i, use_flats) for i in intervals]
    root_display = midi_to_note_name(root_idx, use_flats)
    return f"{root_display} {chord_type}: {', '.join(note_names)}"


# --- Copedent Definitions (Data Driven) ---
COPEDENT_LIBRARY = {
    "E9 Custom": {
        "num_strings": 10,
        "tuning": {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        "pedals": [
            {"id": "A", "label": "A", "changes": {"5": 2, "10": 2}},
            {"id": "B", "label": "B", "changes": {"3": 1, "6": 1}},
            {"id": "C", "label": "C", "changes": {"4": 2, "5": 2}},
            {"id": "D", "label": "D", "changes": {"5": -1, "6": -2, "10": -1}}
        ],
        "levers": [
            {"id": "LL", "label": "LL", "group": "Left Knee", "changes": {"4": 1, "8": 1}},
            {"id": "LV", "label": "LV", "group": "Left Knee", "changes": {"6": -1}},
            {"id": "LR", "label": "LR", "group": "Left Knee", "changes": {"4": -1, "8": -1}},
            {"id": "RL", "label": "RL", "group": "Right Knee", "changes": {"1": 1, "7": 1}},
            {"id": "RR1", "label": "RR1", "group": "Right Knee", "changes": {"2": -1, "9": -1}},
            {"id": "RR2", "label": "RR2", "group": "Right Knee", "changes": {"2": -2, "9": -1}}
        ],
        "compounds": [
            {"id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B"},
            {"id": "BC", "label": "", "components": ["B", "C"], "title": "Toggle B+C"}
        ]
    },
    "E9 Emmons": {
        "num_strings": 10,
        "tuning": {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        "pedals": [
            {"id": "A", "label": "A", "changes": {"5": 2, "10": 2}},
            {"id": "B", "label": "B", "changes": {"3": 1, "6": 1}},
            {"id": "C", "label": "C", "changes": {"4": 2, "5": 2}}
        ],
        "levers": [
            {"id": "LKL", "label": "LKL", "group": "Left Knee", "changes": {"4": 1, "8": 1}},
            {"id": "LKR", "label": "LKR", "group": "Left Knee", "changes": {"4": -1, "8": -1}},
            {"id": "RKL", "label": "RKL", "group": "Right Knee", "changes": {"1": 1, "7": 1}},
            {"id": "RKR", "label": "RKR", "group": "Right Knee", "changes": {"2": -1, "9": -1}}
        ],
        "compounds": [{"id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B"}]
    },
    "E9 Day": {
        "num_strings": 10,
        "tuning": {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 50, 10: 47},
        "pedals": [
            {"id": "A", "label": "A", "changes": {"3": 1, "6": 1}}, # Day Setup often swaps A/B or uses different order. Here: P1=B changes
            {"id": "B", "label": "B", "changes": {"5": 2, "10": 2}}, # P2=A changes
            {"id": "C", "label": "C", "changes": {"4": 2, "5": 2}}
        ],
        "levers": [
            {"id": "LKL", "label": "LKL", "group": "Left Knee", "changes": {"4": 1, "8": 1}},
            {"id": "LKR", "label": "LKR", "group": "Left Knee", "changes": {"4": -1, "8": -1}}
        ],
        "compounds": []
    },
    "C6 Standard": {
        "num_strings": 10,
        # High G C6: G4, E4, C4, A3, G3, E3, C3, A2, F2, C2
        "tuning": {1: 67, 2: 64, 3: 60, 4: 57, 5: 55, 6: 52, 7: 48, 8: 45, 9: 41, 10: 36},
        "pedals": [
            {"id": "P4", "label": "P4", "changes": {"4": 2, "8": 2}}, # A->B
            {"id": "P5", "label": "P5", "changes": {"1": 1, "5": 1, "9": 2, "10": 2}}, # G->G#, F->G, C->D
            {"id": "P6", "label": "P6", "changes": {"2": -1, "6": -1}}, # E->Eb
            {"id": "P7", "label": "P7", "changes": {"3": 2, "7": 2}}, # C->D
            {"id": "P8", "label": "P8", "changes": {"4": -2, "8": -2}} # A->G
        ],
        "levers": [
            {"id": "LKL", "label": "LKL", "group": "Left Knee", "changes": {"1": -1, "5": -1}}, # G->F#
            {"id": "LKR", "label": "LKR", "group": "Left Knee", "changes": {"2": 1, "6": 1}}   # E->F
        ],
        "compounds": []
    },
    "12-string Universal": {
        "num_strings": 12,
        # E9/B6 Hybrid: F#4, D#4, G#4, E4, B3, G#3, F#3, E3, D#3, C#3, B2, G#2
        "tuning": {1: 66, 2: 63, 3: 68, 4: 64, 5: 59, 6: 56, 7: 54, 8: 52, 9: 51, 10: 49, 11: 47, 12: 44},
        "pedals": [
            {"id": "A", "label": "A", "changes": {"5": 2, "10": 2}}, # B->C#
            {"id": "B", "label": "B", "changes": {"3": 1, "6": 1}}, # G#->A
            {"id": "C", "label": "C", "changes": {"4": 2, "5": 2}}, # E->F#, B->C#
            {"id": "P5", "label": "P5", "changes": {"9": -1, "10": -1}}, # B6 logic
            {"id": "P6", "label": "P6", "changes": {"2": -1}}
        ],
        "levers": [
            {"id": "LKL", "label": "LKL", "group": "Left Knee", "changes": {"4": 1, "8": 1}},
            {"id": "LKR", "label": "LKR", "group": "Left Knee", "changes": {"4": -1, "8": -1}}
        ],
        "compounds": [{"id": "AB", "label": "", "components": ["A", "B"], "title": "Toggle A+B"}]
    }
}

def calculate_tuning(copedent_data, active_modifiers):
    """Calculates current pitch of strings based on active pedals/levers and copedent data."""
    if not copedent_data:
        return {}
    
    # Convert keys to int for calculation
    base_tuning = {int(k): v for k, v in copedent_data['tuning'].items()}
    current_tuning = base_tuning.copy()
    
    # Combine pedals and levers for lookup
    all_controls = copedent_data.get('pedals', []) + copedent_data.get('levers', [])
    control_map = {c['id']: c['changes'] for c in all_controls}

    for mod in active_modifiers:
        if mod in control_map:
            for string_idx, shift in control_map[mod].items():
                s_idx = int(string_idx)
                if s_idx in current_tuning:
                    current_tuning[s_idx] += shift
    return current_tuning

# --- Dash App ---
app = dash.Dash(__name__, external_scripts=['https://d3js.org/d3.v7.min.js'], suppress_callback_exceptions=True)

app.layout = html.Div([
    # --- Left Sidebar (Options & Controls) ---
    html.Div(id='sidebar', children=[
        html.H3("Controls", style={'marginTop': '0'}),
        
        # Tuning Selector
        html.Label("Tuning / Setup:", style={'fontWeight': 'bold'}),
        dcc.Dropdown(
            id='tuning-selector',
            options=[{'label': k, 'value': k} for k in COPEDENT_LIBRARY.keys()],
            value='E9 Custom',
            clearable=False,
            style={'marginBottom': '15px'}
        ),

        # Key & Scale
        html.Label("Key:", style={'fontWeight': 'bold'}),
        dcc.Dropdown(
            id='key-selector',
            options=[{'label': note, 'value': note} for note in NOTES_SHARP],
            value='C',
            clearable=False,
            style={'marginBottom': '15px'}
        ),
        
        html.Label("Scale:", style={'fontWeight': 'bold'}),
        dcc.Dropdown(
            id='scale-selector',
            options=[{'label': s, 'value': s} for s in SCALE_DEFINITIONS.keys()],
            value='Major',
            clearable=False,
            style={'marginBottom': '20px'}
        ),
        
        html.Hr(),
        
        # Options
        html.Label("Accidentals:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.RadioItems(
                id='accidental-selector',
                options=[{'label': 'Sharps (#)', 'value': 'sharp'}, {'label': 'Flats (b)', 'value': 'flat'}],
                value='sharp',
                labelStyle={'display': 'block'}
            )
        ], style={'marginBottom': '15px'}),
        
        html.Div([
            dcc.Checklist(
                id='night-mode-check',
                options=[{'label': ' Night Mode', 'value': 'yes'}],
                value=[],
                style={'display': 'block'}
            )
        ], style={'marginBottom': '15px'}),
        
        html.Div([
            dcc.Checklist(
                id='show-freq-check',
                options=[{'label': ' Show Frequency (Hz)', 'value': 'yes'}],
                value=[],
                style={'display': 'block'}
            )
        ], style={'marginBottom': '15px'}),

        # html.Label("Max Fret:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.Input(id='max-fret-input', type='number', value=24, min=12, max=36, style={'width': '100%'}) 
        ], style={'marginBottom': '15px', 'display': 'none'}), # Hidden as requested
        
        html.Label("Fret Labels:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.RadioItems(
                id='fret-label-selector',
                options=[{'label': 'Number', 'value': 'number'}, {'label': 'Note (String 8)', 'value': 'note'}],
                value='number',
                labelStyle={'display': 'block'}
            )
        ], style={'marginBottom': '15px'}),

        # html.Label("Min Adjacency:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.Input(id='min-adjacency-input', type='number', value=1, min=1, max=10, style={'width': '100%'})
        ], style={'marginBottom': '15px', 'display': 'none'}),

        html.Label("Chord Complexity:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.Dropdown(
                id='chord-complexity-selector',
                options=[{'label': 'Basic', 'value': 'basic'}, {'label': 'Moderate', 'value': 'moderate'}, {'label': 'Advanced', 'value': 'advanced'}],
                value='basic',
                clearable=False
            )
        ], style={'marginBottom': '15px'}),
        
        html.Div([
            dcc.Checklist(
                id='highlight-root-check',
                options=[{'label': ' Highlight Root Note', 'value': 'yes'}],
                value=['yes'],
                style={'display': 'block'}
            )
        ], style={'marginBottom': '15px'}),

        html.Label("Scale Override:", style={'fontWeight': 'bold'}),
        html.Div([
            dcc.Dropdown(
                id='scale-override-check',
                options=[], # Populated by callback
                value=[], # Initialized by callback
                multi=True,
                placeholder="Select intervals..."
            )
        ])
    ], style={'width': '250px', 'padding': '20px', 'backgroundColor': '#f8f9fa', 'height': '100vh', 'overflowY': 'auto', 'position': 'fixed', 'left': 0, 'top': 0, 'boxSizing': 'border-box', 'transition': 'background-color 0.3s, color 0.3s'}),

    # --- Main Content Area ---
    html.Div(id='main-content', children=[
        html.H1("Pedal Steel Fretboard Explorer (E9)", style={'textAlign': 'center', 'marginTop': '0'}),
        
        # Fretboard Container (D3 Target)
        html.Div(id='fretboard-container', style={'width': '100%', 'overflowX': 'auto', 'textAlign': 'center'}),
        
        # Store for passing data to D3
        dcc.Store(id='fretboard-data'),
        
        # Store for selected chord
        dcc.Store(id='selected-chord-store', data=None),

        # Store for current copedent definition
        dcc.Store(id='copedent-data'),

        # Pedals and Levers Controls
        html.Div([
            # Dynamic Container for layout
            html.Div(id='controls-container', style={'display': 'inline-block'}),

            # Hidden store to keep track of active modifiers
            dcc.Store(id='active-modifiers-store', data=[])
        ], style={'textAlign': 'center', 'marginTop': '20px'}),

        # Chord Selector (Circle of Fifths)
        html.Div([
            html.Div(id='chord-selector-wrapper')
        ], style={'textAlign': 'center', 'marginTop': '30px', 'marginBottom': '50px'})
    ], style={'marginLeft': '250px', 'padding': '20px', 'minHeight': '100vh', 'transition': 'background-color 0.3s, color 0.3s'})
], id='main-container', style={'fontFamily': 'Helvetica, Arial, sans-serif'})

# --- Callbacks ---

# Callback for Theme (Night Mode)
@app.callback(
    [Output('sidebar', 'style'),
     Output('main-content', 'style'),
     Output('main-container', 'style')],
    [Input('night-mode-check', 'value')]
)
def update_theme(night_mode_val):
    is_night = 'yes' in (night_mode_val or [])
    
    bg_color = '#1e1e1e' if is_night else '#ffffff'
    text_color = '#e0e0e0' if is_night else '#000000'
    sidebar_bg = '#2c2c2c' if is_night else '#f8f9fa'
    
    sidebar_style = {
        'width': '250px', 'padding': '20px', 
        'backgroundColor': sidebar_bg, 'color': text_color,
        'height': '100vh', 'overflowY': 'auto', 'position': 'fixed', 
        'left': 0, 'top': 0, 'boxSizing': 'border-box',
        'transition': 'background-color 0.3s, color 0.3s'
    }
    
    content_style = {
        'marginLeft': '250px', 'padding': '20px',
        'backgroundColor': bg_color, 'color': text_color,
        'minHeight': '100vh',
        'transition': 'background-color 0.3s, color 0.3s'
    }

    container_style = {'fontFamily': 'Helvetica, Arial, sans-serif', 'backgroundColor': bg_color}
    
    return sidebar_style, content_style, container_style

# Callback to load Copedent Data
@app.callback(
    Output('copedent-data', 'data'),
    [Input('tuning-selector', 'value')]
)
def load_copedent(tuning_name):
    return COPEDENT_LIBRARY.get(tuning_name, COPEDENT_LIBRARY['E9 Custom'])

# Callback to Render Controls (Pedals/Levers)
@app.callback(
    Output('controls-container', 'children'),
    [Input('copedent-data', 'data')]
)
def render_controls(copedent):
    if not copedent:
        return []

    # 1. Build Levers (Grouped)
    levers = copedent.get('levers', [])
    # Group by 'group' key
    groups = {}
    for l in levers:
        g = l.get('group', 'Other')
        if g not in groups: groups[g] = []
        groups[g].append(l)
    
    lever_divs = []
    # Sort groups to put Left Knee first if exists
    group_names = sorted(groups.keys(), key=lambda x: 0 if 'Left' in x else 1)
    
    for i, g_name in enumerate(group_names):
        buttons = []
        for l in groups[g_name]:
            buttons.append(html.Button(
                l['label'], 
                id={'type': 'control-btn', 'index': l['id']}, 
                n_clicks=0,
                style={'margin': '5px', 'padding': '10px 20px', 'fontSize': '16px'}
            ))
        lever_divs.append(html.Div(buttons, style={'display': 'flex'}))
        # Add spacer between groups
        if i < len(group_names) - 1:
            lever_divs.append(html.Div(style={'width': '60px'}))

    levers_row = html.Div(lever_divs, style={'display': 'flex', 'justifyContent': 'center', 'marginBottom': '10px'})

    # 2. Build Pedals and Compounds
    pedals = copedent.get('pedals', [])
    compounds = copedent.get('compounds', [])
    
    # We want to interleave compounds if possible, or just list them.
    # Simple approach: List pedals, insert compound button if it matches adjacent pedals?
    # User's previous layout: A, AB, B, BC, C.
    # Generic approach: Render all pedals. If a compound exists that links P(i) and P(i+1), render it between.
    
    pedal_elements = []
    for i, p in enumerate(pedals):
        # Add Pedal Button
        pedal_elements.append(html.Button(
            p['label'], 
            id={'type': 'control-btn', 'index': p['id']}, 
            n_clicks=0, 
            style={'margin': '5px', 'padding': '10px 20px', 'fontSize': '16px'}
        ))
        
        # Check for compound between this and next
        if i < len(pedals) - 1:
            next_p = pedals[i+1]
            # Find compound that has exactly these two components
            compound_found = next((c for c in compounds if set(c.get('components', [])) == {p['id'], next_p['id']}), None)
            
            # Use found compound or create default adjacency button
            c_id = compound_found['id'] if compound_found else f"{p['id']}+{next_p['id']}"
            c_label = compound_found['label'] if compound_found else ""
            c_title = compound_found.get('title', f"Toggle {p['id']}+{next_p['id']}") if compound_found else f"Toggle {p['id']}+{next_p['id']}"

            pedal_elements.append(html.Button(
                c_label, 
                id={'type': 'control-btn', 'index': c_id}, 
                n_clicks=0, 
                style={'margin': '5px 2px', 'padding': '0', 'fontSize': '10px', 'width': '15px', 'height': '30px', 'backgroundColor': '#e0e0e0', 'border': '1px solid #ccc', 'cursor': 'pointer'}, 
                title=c_title
            ))

    pedals_row = html.Div(pedal_elements, style={'display': 'flex', 'justifyContent': 'flex-start', 'alignItems': 'center'})

    return html.Div([levers_row, pedals_row])

# Callback to sync Key Options and Scale Override labels with Accidental Selector and Key
@app.callback(
    [Output('key-selector', 'options'),
     Output('scale-override-check', 'options'),
     Output('scale-override-check', 'value')],
    [Input('accidental-selector', 'value'),
     Input('key-selector', 'value'),
     Input('scale-selector', 'value')]
)
def update_options_and_defaults(accidental_pref, selected_key, scale_name):
    use_flats = (accidental_pref == 'flat')
    note_list = NOTES_FLAT if use_flats else NOTES_SHARP
    
    # 1. Update Key Selector Options
    key_options = [{'label': note, 'value': note} for note in note_list]
    
    # 2. Update Scale Override Options (Interval + Note Name)
    override_options = []
    root_idx = -1
    if selected_key:
        # Find index of selected key in the current list (handle switching sharp/flat)
        # If selected_key is 'C#' but we are in flat mode, we need to find 1
        # Simplest way: find index in the list that contains it, or map via MIDI
        try:
            root_idx = NOTES_SHARP.index(selected_key)
        except ValueError:
            try:
                root_idx = NOTES_FLAT.index(selected_key)
            except ValueError:
                root_idx = 0 # Fallback
    
    for i, interval_name in enumerate(INTERVAL_NAMES):
        if root_idx != -1:
            note_name = note_list[(root_idx + i) % 12]
            label = f"{interval_name} ({note_name})"
        else:
            label = interval_name
        override_options.append({'label': label, 'value': interval_name})

    # 3. Set Default Value based on Scale
    intervals = SCALE_DEFINITIONS.get(scale_name, SCALE_DEFINITIONS['Major'])
    default_value = [INTERVAL_NAMES[i] for i in intervals]
    
    return key_options, override_options, default_value

# Callback to handle button clicks and update active modifiers (Pattern Matching)
@app.callback(
    [Output('active-modifiers-store', 'data'),
     Output({'type': 'control-btn', 'index': ALL}, 'style')],
    [Input({'type': 'control-btn', 'index': ALL}, 'n_clicks')],
    [State('active-modifiers-store', 'data'),
     State('copedent-data', 'data')]
)
def update_modifiers(n_clicks_list, current_active, copedent):
    current_active = current_active or []
    ctx = dash.callback_context
    
    # Determine which button was clicked
    if ctx.triggered:
        triggered_prop = ctx.triggered[0]['prop_id']
        # Parse ID from string like '{"index":"A","type":"control-btn"}.n_clicks'
        if 'index' in triggered_prop:
            # Extract dictionary from string
            id_str = triggered_prop.split('.')[0]
            btn_id = json.loads(id_str)
            clicked_id = btn_id['index']
            
            # Check if it's a compound button
            compounds = copedent.get('compounds', [])
            compound_def = next((c for c in compounds if c['id'] == clicked_id), None)
            comps = []

            if compound_def:
                # Toggle Compound
                comps = compound_def['components']
            elif '+' in clicked_id:
                # Auto-generated compound ID
                comps = clicked_id.split('+')
            
            if comps:
                all_active = all(c in current_active for c in comps)
                if all_active:
                    for c in comps: 
                        if c in current_active: current_active.remove(c)
                else:
                    for c in comps:
                        if c not in current_active: current_active.append(c)
            else:
                # Standard Toggle
                # Handle mutually exclusive logic (like RR1/RR2) if needed
                # For now, generic toggle
                if clicked_id in current_active:
                    current_active.remove(clicked_id)
                else:
                    current_active.append(clicked_id)
                    # Logic for RR1/RR2 mutual exclusion could be added here by checking copedent metadata if we added 'mutex' groups
                    if clicked_id == 'RR1' and 'RR2' in current_active: current_active.remove('RR2')
                    if clicked_id == 'RR2' and 'RR1' in current_active: current_active.remove('RR1')

    # Generate styles based on new state
    styles = []
    # We need to map the outputs back to the inputs. 
    # ctx.inputs_list[0] contains the list of all buttons in order
    
    all_buttons = ctx.inputs_list[0]
    
    for btn in all_buttons:
        b_id = btn['id']['index']
        
        # Determine if this button should be highlighted
        is_active = False
        
        # Check if it's a compound
        compounds = copedent.get('compounds', []) if copedent else []
        compound_def = next((c for c in compounds if c['id'] == b_id), None)
        is_compound = compound_def is not None or '+' in b_id
        
        if is_compound:
            # Compound is active if all components are active
            if compound_def:
                is_active = all(c in current_active for c in compound_def['components'])
            else:
                is_active = all(c in current_active for c in b_id.split('+'))
            base_style = {'margin': '5px 2px', 'padding': '0', 'fontSize': '10px', 'width': '15px', 'height': '30px', 'backgroundColor': '#e0e0e0', 'border': '1px solid #ccc', 'cursor': 'pointer'}
        else:
            is_active = b_id in current_active
            base_style = {'margin': '5px', 'padding': '10px 20px', 'fontSize': '16px'}

        if is_active:
            base_style['backgroundColor'] = '#4CAF50'
            base_style['color'] = 'white'
        
        styles.append(base_style)

    return current_active, styles

# Callback to Render Chord Selector (Handles Labels, Order, Visibility, Styles)
@app.callback(
    Output('chord-selector-wrapper', 'children'),
    [Input('accidental-selector', 'value'),
     Input('key-selector', 'value'),
     Input('chord-complexity-selector', 'value'),
     Input('scale-selector', 'value'),
     Input('selected-chord-store', 'data'),
     Input('night-mode-check', 'value')]
)
def render_chord_selector(accidental_pref, selected_key, complexity, scale_name, current_selection, night_mode_val):
    is_night = 'yes' in (night_mode_val or [])
    use_flats = (accidental_pref == 'flat')
    
    # 1. Calculate Scale Indices for Highlighting
    scale_indices = set()
    root_idx = -1
    if selected_key:
        root_idx = NOTE_TO_INT.get(selected_key, 0)
        scale_intervals = SCALE_DEFINITIONS.get(scale_name, SCALE_DEFINITIONS['Major'])
        scale_indices = {(root_idx + i) % 12 for i in scale_intervals}

    # 2. Determine Visible Rows
    visible_rows = ['Maj', 'Min']
    if complexity == 'moderate':
        visible_rows.extend(['Maj7', '7', 'm7', '6', 'm6'])
    elif complexity == 'advanced':
        visible_rows.extend(['Maj7', '7', 'm7', '6', 'm6', 'Aug', 'Dim', 'm7b5'])

    # 3. Determine Column Order (Center on Key)
    key_idx = 5 # Default C
    for i, note in enumerate(CIRCLE_OF_FIFTHS):
        # Check exact match or enharmonic
        if note == selected_key: key_idx = i; break
        if selected_key == 'C#' and note == 'Db': key_idx = i
        if selected_key == 'F#' and note == 'Gb': key_idx = i
        if selected_key == 'G#' and note == 'Ab': key_idx = i
        if selected_key == 'D#' and note == 'Eb': key_idx = i
        if selected_key == 'A#' and note == 'Bb': key_idx = i
    
    start_idx = (key_idx - 6) % 12

    # 4. Build Columns
    columns = []
    for i, note_id in enumerate(CIRCLE_OF_FIFTHS):
        # Calculate Order
        order = (i - start_idx) % 12
        
        # Get Display Label (respecting sharps/flats)
        note_label = midi_to_note_name(NOTE_TO_INT[note_id], use_flats)
        
        buttons = []
        for row_name in CHORD_ROWS:
            is_visible = row_name in visible_rows
                
            # Style Logic
            is_active = current_selection and (current_selection['root'] == note_id and current_selection['type'] == row_name)
            
            c_root_idx = NOTE_TO_INT.get(note_id, 0)
            intervals = CHORD_FORMULAS.get(row_name, [])
            chord_indices = {(c_root_idx + k) % 12 for k in intervals}
            is_in_key = chord_indices.issubset(scale_indices)
            
            root_chord_type = 'Maj'
            if scale_name in ['Minor', 'Minor Pentatonic']:
                root_chord_type = 'Min'
            is_root_chord = (c_root_idx == root_idx and row_name == root_chord_type)
            
            if is_root_chord: bg_color = '#42a5f5'
            elif is_in_key: bg_color = '#66bb6a' if is_night else '#a5d6a7'
            else: bg_color = '#424242' if is_night else '#f0f0f0'

            text_color = '#ffffff' if (is_night and not is_active) else 'black'
            btn_label = f"{note_label}\n{row_name}" if row_name != 'Maj' else note_label

            btn_style = {
                'width': '40px', 'height': '40px', 'borderRadius': '50%', 
                'margin': '2px 0', 'padding': '0', 'fontSize': '10px',
                'border': '3px solid #ff8f00' if is_active else '1px solid #ccc',
                'cursor': 'pointer',
                'whiteSpace': 'pre-line', 'lineHeight': '1.1',
                'backgroundColor': bg_color,
                'color': text_color,
                'fontWeight': is_active and 'bold' or 'normal',
                'boxShadow': '0 0 5px #ff8f00' if is_active else 'none',
            }
            
            if not is_visible:
                btn_style['display'] = 'none'

            buttons.append(html.Button(
                btn_label,
                id=f'btn-chord-{row_name}-{note_id}',
                n_clicks=0,
                style=btn_style,
                title=get_chord_tooltip(note_id, row_name, use_flats)
            ))

        columns.append(html.Div([
            html.Div(note_label, style={'width': '40px', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '12px', 'marginBottom': '5px'}),
            html.Div(buttons, style={'display': 'flex', 'flexDirection': 'column'})
        ], style={'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'margin': '0 2px', 'order': order}))

    return html.Div(columns, style={'display': 'flex', 'justifyContent': 'center', 'flexWrap': 'nowrap', 'overflowX': 'auto'})

# Callback to handle Chord Selection (Logic Only)
@app.callback(
    Output('selected-chord-store', 'data'),
    [Input(f'btn-chord-{r}-{n}', 'n_clicks') for r in CHORD_ROWS for n in CIRCLE_OF_FIFTHS],
    [State('selected-chord-store', 'data')]
)
def update_chord_selection(*args):
    current_selection = args[-1]
    
    ctx = dash.callback_context
    
    triggered_id = ctx.triggered[0]['prop_id'].split('.')[0] if ctx.triggered else None
    new_selection = current_selection

    if triggered_id and triggered_id.startswith('btn-chord-'):
        # ID format: btn-chord-{row}-{note}
        parts = triggered_id.split('-')
        row_name = parts[2]
        note_name = parts[3]
        
        clicked_selection = {'root': note_name, 'type': row_name}
        
        # Toggle off if clicking same button
        if current_selection and current_selection == clicked_selection:
            new_selection = None
        else:
            new_selection = clicked_selection
            
    return new_selection

# Callback to update the fretboard
@app.callback(
    Output('fretboard-data', 'data'),
    [Input('key-selector', 'value'),
     Input('active-modifiers-store', 'data'),
     Input('copedent-data', 'data'),
     Input('scale-override-check', 'value'),
     Input('max-fret-input', 'value'),
     Input('highlight-root-check', 'value'),
     Input('accidental-selector', 'value'),
     Input('fret-label-selector', 'value'),
     Input('selected-chord-store', 'data'),
     Input('min-adjacency-input', 'value'),
     Input('show-freq-check', 'value'),
     Input('night-mode-check', 'value')]
)
def update_fretboard(selected_key, active_modifiers, copedent_data, scale_intervals, max_fret, highlight_root_opt, accidental_pref, label_pref, selected_chord, min_adjacency, show_freq_opt, night_mode_val):
    # 1. Calculate Tuning
    tuning = calculate_tuning(copedent_data, active_modifiers)
    num_strings = copedent_data.get('num_strings', 10) if copedent_data else 10
    
    use_flats = (accidental_pref == 'flat')
    note_list = NOTES_FLAT if use_flats else NOTES_SHARP
    
    # 2. Get Scale Info from Manual Override and Key Selector
    # Convert list of interval names back to indices relative to root
    if selected_key:
        # Resolve root index regardless of current sharp/flat selection
        if selected_key in NOTES_SHARP:
            root_index = NOTES_SHARP.index(selected_key)
        elif selected_key in NOTES_FLAT:
            root_index = NOTES_FLAT.index(selected_key)
        else:
            root_index = 0
            
        interval_indices = {INTERVAL_NAMES.index(i) for i in scale_intervals} if scale_intervals else set()
        scale_indices = {(root_index + i) % 12 for i in interval_indices}
    else:
        root_index = -1
        scale_indices = set()

    # 3. Get Chord Tones if active
    chord_indices = set()
    if selected_chord:
        c_root_name = selected_chord['root']
        c_type = selected_chord['type']
        c_root_idx = NOTE_TO_INT.get(c_root_name, 0)
        intervals = CHORD_FORMULAS.get(c_type, [])
        chord_indices = {(c_root_idx + i) % 12 for i in intervals}

    highlight_root = 'yes' in (highlight_root_opt or [])
    show_markers = True # Always show markers now
    show_freq = 'yes' in (show_freq_opt or [])
    night_mode = 'yes' in (night_mode_val or [])
    max_fret = int(max_fret) if max_fret else 24
    min_adjacency = int(min_adjacency) if min_adjacency else 1
    
    # 3. Build Data for D3
    notes_data = []
    
    # Iterate through absolute pitches to allow notes to "slide"
    # Range covers reasonable MIDI notes for the instrument (approx B2 to C6)
    min_midi = 24 # Lowered to support C6 (C2=36) and Universal 12 (G#2=44, B2=47... wait, C2 is 36. C1 is 24.)
    max_midi = 100
    
    for string_idx in range(1, num_strings + 1): # Strings 1 to N
        open_pitch = tuning[string_idx]
        
        for pitch in range(min_midi, max_midi):
            fret = pitch - open_pitch
            
            # Render slightly outside visible range for smooth entry/exit
            if 0 <= fret <= (max_fret + 1):
                note_name = midi_to_note_name(pitch, use_flats)
                note_idx = pitch % 12
                freq = 440.0 * (2 ** ((pitch - 69) / 12.0))
                
                # Determine color category
                category = 0 # Out
                if note_idx == root_index and highlight_root:
                    category = 2 # Root
                elif note_idx in scale_indices:
                    category = 1 # In Scale
                
                notes_data.append({
                    'string': string_idx,
                    'fret': fret,
                    'note': note_name,
                    'freq': f"{freq:.1f}",
                    'cat': category,
                    'is_chord': note_idx in chord_indices, # Separate flag for styling
                    'id': f"S{string_idx}-P{pitch}" # Unique ID for D3 object constancy
                })

    # 4. Generate Fret Labels
    fret_labels = []
    string_8_open = copedent_data['tuning'].get('8', copedent_data['tuning'].get(8, 52)) if copedent_data else 52
    
    for f in range(max_fret + 1):
        if label_pref == 'note':
            # Calculate note on String 8
            lbl = midi_to_note_name(string_8_open + f, use_flats)
        else:
            lbl = "Open" if f == 0 else str(f)
        fret_labels.append({'fret': f, 'label': lbl})

    return {
        'notes': notes_data, 
        'max_fret': max_fret, 
        'fret_labels': fret_labels, 
        'show_markers': show_markers, 
        'min_adjacency': min_adjacency,
        'num_strings': num_strings,
        'show_freq': show_freq,
        'night_mode': night_mode
    }

# Clientside Callback to render D3
app.clientside_callback(
    ClientsideFunction(namespace='clientside', function_name='render_fretboard'),
    Output('fretboard-container', 'data-rendered'), # Dummy output
    Input('fretboard-data', 'data')
)

if __name__ == '__main__':
    app.run(debug=True)