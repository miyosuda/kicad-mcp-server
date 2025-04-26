# KiCAD MCP: AI-Assisted PCB Design

KiCAD MCP is a Model Context Protocol (MCP) implementation that enables Large Language Models (LLMs) like Claude to directly interact with KiCAD for printed circuit board design. It creates a standardized communication bridge between AI assistants and the KiCAD PCB design software, allowing for natural language control of advanced PCB design operations.

## Project Status


- Implemented full Python interface compatibility with KiCAD 9.0
- Created a modular and maintainable component architecture
- Implemented comprehensive tools for board manipulation, component placement, and routing
- Successfully tested operations from project creation to component placement and routing
- Created a streamlined MCP server implementation that reliably passes commands to KiCAD

The server works seamlessly with Cline/Claude, enabling AI-assisted PCB design through natural language.

## What It Does

KiCAD MCP transforms how engineers and designers work with KiCAD by enabling AI assistants to:

- Create and manage KiCAD PCB projects through natural language requests
- Manipulate board geometry, outlines, layers, and properties
- Place and organize components in various patterns (grid, circular, aligned)
- Route traces, differential pairs, and create copper pours
- Implement design rules and perform design rule checks
- Generate exports in various formats (Gerber, PDF, SVG, 3D models)
- Provide comprehensive context about the circuit board to the AI assistant

This enables a natural language-driven PCB design workflow where complex operations can be requested in plain English, while still maintaining full engineer oversight and control.

## Core Architecture

- **TypeScript MCP Server**: Implements the Anthropic Model Context Protocol specification to communicate with Claude and other compatible AI assistants
- **Python KiCAD Interface**: Handles actual KiCAD operations via pcbnew Python API with comprehensive error handling
- **Modular Design**: Organizes functionality by domains (project, board, component, routing) for maintainability and extensibility

## System Requirements

- **KiCAD 9.0 or higher** (must be fully installed)
- **Node.js v18 or higher** and npm
- **Python 3.8 or higher** with pip (the version that comes with KiCAD 9.0 is sufficient)
- **Cline** (VSCode Claude extension) or another MCP-compatible client
- **Windows 10/11** (current version is optimized for Windows; Linux/Mac support planned)

## Installation

### Step 1: Install KiCAD 9.0

1. Download KiCAD 9.0 from the [official KiCAD website](https://www.kicad.org/download/)
2. Run the installer and select the default installation options
3. Ensure that the Python module is installed (this is included in the default installation)

### Step 2: Clone and Set Up the KiCAD MCP Repository

```bash
git clone https://github.com/kicad-ai/kicad-mcp.git
cd kicad-mcp
npm install
npm run build
```

### Step 3: Configure Cline (VSCode Claude Extension)

1. Install VSCode from the [official website](https://code.visualstudio.com/) if not already installed
2. Install the Cline extension (Claude for VSCode) from the VSCode marketplace
3. Edit the Cline MCP settings file:
   - Windows: `%USERPROFILE%\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
   - macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
   - Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

4. Add this configuration to the file (update paths as needed for your system):

```json
"kicad": {
  "autoApprove": [],
  "disabled": false,
  "timeout": 60,
  "command": "C:\\Program Files\\nodejs\\node.exe",
  "args": [
    "C:/path/to/kicad-mcp/dist/kicad-server.js"
  ],
  "env": {
    "PYTHONPATH": "C:/Program Files/KiCad/9.0/lib/python3/dist-packages",
    "DEBUG": "mcp:*"
  },
  "transportType": "stdio"
}
```

5. Restart VSCode or reload the window for changes to take effect.

### Step 4: Verify Installation

1. Open VSCode with the Cline extension
2. Start a new conversation with Claude
3. Ask Claude to create a new KiCAD project:
   ```
   Create a new KiCAD project named 'TestProject' in the 'test' directory.
   ```
4. Claude should use the KiCAD MCP to create the project and report success

## Usage Examples

Here are some examples of what you can ask Claude to do with KiCAD MCP:

### Project Management

```
Create a new KiCAD project named 'WiFiModule' in my Documents folder.
```

```
Open the existing KiCAD project at C:/Projects/Amplifier/Amplifier.kicad_pro
```

### Board Design

```
Set the board size to 100mm x 80mm.
```

```
Add a rounded rectangle board outline with 3mm corner radius.
```

```
Add mounting holes at each corner of the board, 5mm from the edges.
```

### Component Placement

```
Place a 10uF capacitor at position x=50mm, y=30mm.
```

```
Create a grid of 8 LEDs, 4x2, starting at position x=20mm, y=10mm with 10mm spacing.
```

```
Align all resistors horizontally and distribute them evenly.
```

### Routing

```
Create a new net named 'VCC' and assign it to the power net class.
```

```
Route a trace from component U1 pin 1 to component C3 pin 2 on layer F.Cu.
```

```
Add a copper pour for GND on the bottom layer.
```

### Design Rules and Export

```
Set design rules with 0.2mm clearance and 0.25mm minimum track width.
```

```
Export Gerber files to the 'fabrication' directory.
```

## Features by Category

### Project Management
- Create new KiCAD projects with customizable settings
- Open existing KiCAD projects from file paths
- Save projects with optional new locations
- Retrieve project metadata and properties

### Board Design
- Set precise board dimensions with support for metric and imperial units
- Add custom board outlines (rectangle, rounded rectangle, circle, polygon)
- Create and manage board layers with various configurations
- Add mounting holes, text annotations, and other board features
- Visualize the current board state

### Components
- Place components with specified footprints at precise locations
- Create component arrays in grid or circular patterns
- Move, rotate, and modify existing components
- Align and distribute components evenly
- Duplicate components with customizable properties
- Get detailed component properties and listings

### Routing
- Create and manage nets with specific properties
- Route traces between component pads or arbitrary points
- Add vias, including blind and buried vias
- Create differential pair routes for high-speed signals
- Generate copper pours (ground planes, power planes)
- Define net classes with specific design rules

### Design Rules
- Set global design rules for clearance, track width, etc.
- Define specific rules for different net classes
- Run Design Rule Check (DRC) to validate the design
- View and manage DRC violations

### Export
- Generate industry-standard Gerber files for fabrication
- Export PDF documentation of the PCB
- Create SVG vector graphics of the board
- Generate 3D models in STEP or VRML format
- Produce bill of materials (BOM) in various formats

## Implementation Details

The KiCAD MCP implementation uses a modular, maintainable architecture:

### TypeScript MCP Server (Node.js)
- **kicad-server.ts**: The main server that implements the MCP protocol
- Uses STDIO transport for reliable communication with Cline
- Manages the Python process for KiCAD operations
- Handles command queuing, error recovery, and response formatting

### Python Interface
- **kicad_interface.py**: The main Python interface that:
  - Parses commands received as JSON via stdin
  - Routes commands to the appropriate specialized handlers
  - Returns results as JSON via stdout
  - Handles errors gracefully with detailed information

- **Modular Command Structure**:
  - `commands/project.py`: Project creation, opening, saving
  - `commands/board/`: Modular board manipulation functions
    - `size.py`: Board size operations
    - `layers.py`: Layer management
    - `outline.py`: Board outline creation
    - `view.py`: Visualization functions
  - `commands/component.py`: Component placement and manipulation
  - `commands/routing.py`: Trace routing and net management
  - `commands/design_rules.py`: DRC and rule configuration
  - `commands/export.py`: Output generation in various formats

This architecture ensures that each aspect of PCB design is handled by specialized modules while maintaining a clean, consistent interface layer.

## Troubleshooting

### Common Issues and Solutions

**Problem: KiCAD MCP isn't showing up in Claude's tools**
- Make sure VSCode is completely restarted after updating the Cline MCP settings
- Verify the paths in the config are correct for your system
- Check that the `npm run build` completed successfully

**Problem: Node.js errors when launching the server**
- Ensure you're using Node.js v18 or higher
- Try running `npm install` again to ensure all dependencies are properly installed
- Check the console output for specific error messages

**Problem: Python errors or KiCAD commands failing**
- Verify that KiCAD 9.0 is properly installed
- Check that the PYTHONPATH in the configuration points to the correct location
- Try running a simple KiCAD Python script directly to ensure the pcbnew module is accessible

**Problem: Claude can't find or load your KiCAD project**
- Use absolute paths when referring to project locations
- Ensure the user running VSCode has access permissions to the directories

### Getting Help

If you encounter issues not covered in this troubleshooting section:
1. Check the console output for error messages
2. Look for similar issues in the GitHub repository's Issues section
3. Open a new issue with detailed information about the problem

## Contributing

Contributions to this project are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing what went wrong and how to reproduce it
2. **Suggest Features**: Have an idea? Share it via an issue
3. **Submit Pull Requests**: Fixed a bug or added a feature? Submit a PR!
4. **Improve Documentation**: Help clarify or expand the documentation

Please follow the existing code style and include tests for new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
