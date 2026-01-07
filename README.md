# SuperSlicer to OrcaSlicer Converter (TypeScript)

This is a TypeScript/Node.js version of the Perl script for converting PrusaSlicer and SuperSlicer INI profile files to OrcaSlicer JSON format.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

## Usage

### Basic Usage

Run the converter:
```bash
npm start
```

Or use the built executable:
```bash
node dist/index.js
```

### Command Line Options

- `--input <PATTERN>` - Specify input INI file(s). Supports wildcards and multiple files.
- `--outdir <DIRECTORY>` - Specify the ROOT OrcaSlicer settings directory.
- `--nozzle-size <DECIMAL>` - Specify nozzle diameter in mm (e.g., 0.4).
- `--physical-printer <PATTERN>` - Specify physical printer INI file.
- `--on-existing <CHOICE>` - Behavior when output exists: `skip`, `merge`, or `overwrite`.
- `--force-output` - Force output to specified directory instead of default OrcaSlicer location.
- `-h, --help` - Display help information.

### Examples

Convert a specific file:
```bash
npm start -- --input "path/to/profile.ini"
```

Convert multiple files with wildcards:
```bash
npm start -- --input "profiles/*.ini"
```

Convert with specific output directory:
```bash
npm start -- --input "profile.ini" --outdir "/path/to/output"
```

## Development

Run in development mode with TypeScript:
```bash
npm run dev
```

## Default Directories

The script uses the following default directories based on your OS:

- **Windows**: `C:\Users\%USERNAME%\AppData\Roaming\OrcaSlicer`
- **macOS**: `~/Library/Application Support/OrcaSlicer`
- **Linux**: `~/.config/OrcaSlicer`

## Notes

- The script maintains feature parity with the original Perl version
- Interactive mode is available when no input files are specified
- Supports config bundles (multiple profiles in one file)
- Handles physical printer configurations
- Provides conversion summary at the end

