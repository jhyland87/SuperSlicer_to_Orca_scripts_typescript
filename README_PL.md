# SuperSlicer to OrcaSlicer Converter

Convert PrusaSlicer and SuperSlicer INI profile files to OrcaSlicer JSON format. Available in both **Perl** and **TypeScript/Node.js** versions.

## Table of Contents

- [Features](#features)
- [TypeScript Version (Recommended)](#typescript-version-recommended)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Command Line Options](#command-line-options)
  - [Examples](#examples)
- [Perl Version](#perl-version)
  - [Requirements](#requirements)
  - [Installation](#installation-1)
  - [Usage](#usage-1)
- [Output Directory Behavior](#output-directory-behavior)
- [Conversion Process](#conversion-process)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- ✅ Convert Print, Filament, and Printer profiles from PrusaSlicer/SuperSlicer to OrcaSlicer
- ✅ Support for config bundles (multiple profiles in one file)
- ✅ Physical printer configuration support
- ✅ Interactive mode for easy profile selection
- ✅ Batch conversion with wildcard support
- ✅ Merge mode to update existing profiles
- ✅ Comprehensive conversion statistics and summary
- ✅ Automatic directory creation
- ✅ Cross-platform support (Windows, macOS, Linux)

## TypeScript Version (Recommended)

The TypeScript version is the modern, actively maintained version with improved error handling, type safety, and better cross-platform compatibility.

### Installation

1. **Prerequisites**: Node.js 18.x or higher (Node.js 22.x or 24.x recommended)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Generate API documentation** (optional):
   ```bash
   npm run docs
   ```
   This creates HTML documentation in the `docs/` directory from TSDoc comments.

5. **Run tests**:
   ```bash
   npm test
   ```
   Run all unit tests using Vitest. Use `npm run test:watch` for watch mode or `npm run test:coverage` for coverage reports.

### Usage

**Run the converter**:
```bash
npm start
```

Or use the compiled version directly:
```bash
node dist/index.js
```

For development with TypeScript:
```bash
npm run dev
```

### Command Line Options

| Option | Description |
|--------|-------------|
| `-i, --input <files...>` | Specify input INI file(s). Supports wildcards and multiple files. |
| `-o, --outdir <directory>` | Specify custom output directory. See [Output Directory Behavior](#output-directory-behavior) for details. |
| `--nozzle-size <size>` | Specify nozzle diameter in mm (e.g., `0.4`). Required for print profiles if not detected. |
| `--physical-printer <file>` | Specify physical printer INI file for printer configs. |
| `--on-existing <choice>` | Behavior when output exists: `skip`, `merge`, or `overwrite`. |
| `--force-output` | Force output to specified directory with simple structure. |
| `--overwrite` | Deprecated: use `--on-existing overwrite` instead. |
| `-h, --help` | Display help information. |

### Examples

**Convert a specific file**:
```bash
npm start -- --input "path/to/profile.ini"
```

**Convert multiple files with wildcards**:
```bash
npm start -- --input "profiles/*.ini"
npm start -- --input "profiles/*.ini" "other/*.ini"
```

**Convert with custom output directory**:
```bash
npm start -- --input "profile.ini" --outdir "/path/to/output"
```

**Convert with nozzle size specified**:
```bash
npm start -- --input "print_profile.ini" --nozzle-size 0.4
```

**Skip existing files**:
```bash
npm start -- --input "*.ini" --on-existing skip
```

**Merge with existing profiles**:
```bash
npm start -- --input "*.ini" --on-existing merge
```

**Interactive mode** (no arguments):
```bash
npm start
```
This will guide you through selecting slicer, profile type, and specific profiles to convert.

### Output Directory Behavior

By default, the TypeScript version saves converted profiles to a folder in your **current working directory**:

- **Default location**: `./orca_converted_profiles/`
- **Structure**: Files are organized by type:
  - `orca_converted_profiles/print/` - Print profiles
  - `orca_converted_profiles/filament/` - Filament profiles
  - `orca_converted_profiles/printer/` - Printer profiles

**When using `--outdir`**:
- **Without `--force-output`**: Uses OrcaSlicer's standard directory structure (for compatibility with existing OrcaSlicer installations)
- **With `--force-output`**: Uses simple type-based subdirectories in the specified directory

### Conversion Statistics

After conversion, you'll see a comprehensive summary including:

- **Conversion Statistics**: Total files processed, successfully converted, merged, and failed
- **Source Slicer Breakdown**: Count of files from each slicer
- **Directory Information**: Clear indication of where converted files are located
- **Profile Type Breakdown**: Count of each profile type converted
- **Detailed Tables**: Per-profile conversion status with any errors

Example output:
```
═══════════════════════════════════════════════════════════
                    CONVERSION STATISTICS
═══════════════════════════════════════════════════════════

Metric                              Count
───────────────────────────────────────────────────────────
Total Files Processed                5
✓ Successfully Converted             4
↻ Merged with Existing               1
✗ Failed                            0

Output Directory(ies):
  /path/to/orca_converted_profiles

✓ Converted profiles can be found in the output directory(ies) above.
```

## Perl Version

The original Perl version is still available for systems without Node.js.

### Requirements

- Perl 5.10 or higher
- Required Perl modules (install via `cpan` or your system's package manager):
  - `Getopt::Long`
  - `File::Basename`
  - `File::Glob`
  - `File::HomeDir`
  - `Path::Class`
  - `Path::Tiny`
  - `String::Escape`
  - `Term::Choose`
  - `Term::Form::ReadLine`
  - `Text::SimpleTable`
  - `JSON::XS`

### Installation

1. Make the script executable:
   ```bash
   chmod +x superslicer_to_orca.pl
   ```

2. Install required Perl modules:
   ```bash
   cpan install Getopt::Long File::Basename File::Glob File::HomeDir Path::Class Path::Tiny String::Escape Term::Choose Term::Form::ReadLine Text::SimpleTable JSON::XS
   ```

### Usage

```bash
./superslicer_to_orca.pl [options]
```

**Options** (same as TypeScript version):
- `--input <PATTERN>` - Input INI file(s)
- `--outdir <DIRECTORY>` - Output directory
- `--nozzle-size <DECIMAL>` - Nozzle size in mm
- `--physical-printer <PATTERN>` - Physical printer INI file
- `--on-existing <CHOICE>` - Behavior: `skip`, `merge`, or `overwrite`
- `--force-output` - Force output to specified directory
- `-h, --help` - Display help

**Default Output Location** (Perl version):
The Perl version defaults to your OrcaSlicer settings directory:
- **Windows**: `C:\Users\%USERNAME%\AppData\Roaming\OrcaSlicer`
- **macOS**: `~/Library/Application Support/OrcaSlicer`
- **Linux**: `~/.config/OrcaSlicer`

## Conversion Process

### Supported Profile Types

1. **Print Profiles** (`print`)
   - Converts print settings, speeds, supports, infill patterns, etc.
   - Requires nozzle size (can be specified or detected from printer profile)

2. **Filament Profiles** (`filament`)
   - Converts filament properties, temperatures, retraction settings, etc.
   - Maps filament types (e.g., PET → PETG, FLEX → TPU)

3. **Printer Profiles** (`printer`)
   - Converts printer settings, g-code flavors, machine limits, etc.
   - Can link to system printers in OrcaSlicer
   - Supports physical printer configuration

### Parameter Mapping

The converter handles complex parameter mappings including:
- Speed conversions (percentage to absolute values)
- Infill pattern translations
- Support style conversions
- G-code flavor mappings
- Filament type mappings
- And many more...

### Special Features

- **Config Bundles**: Automatically detects and splits multi-profile config bundles
- **Physical Printers**: Handles network configuration from physical printer profiles
- **System Printer Linking**: Links printer profiles to configured OrcaSlicer printers
- **Merge Mode**: Safely updates existing profiles without overwriting custom settings
- **Interactive Prompts**: Guides you through compatible condition strings and other decisions

## Troubleshooting

### TypeScript Version

**Build errors**:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Module not found errors**:
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

**Permission errors**:
- Ensure output directory is writable
- On Linux/macOS, you may need to adjust directory permissions

### Perl Version

**Module not found**:
- Install missing modules via `cpan` or your package manager
- On Debian/Ubuntu: `sudo apt-get install libgetopt-long-descriptive-perl libpath-class-perl libpath-tiny-perl libterm-choose-perl libtext-simpletable-perl libjson-xs-perl`

**Permission errors**:
- Make script executable: `chmod +x superslicer_to_orca.pl`
- Check output directory permissions

### Common Issues

**"Unsupported slicer" error**:
- Ensure the INI file was generated by PrusaSlicer or SuperSlicer
- Check that the file contains a `# generated by` comment

**"Invalid ini type" error**:
- The file may not be a valid profile file
- Try specifying the profile type explicitly or use a different file

**Nozzle size required**:
- For print profiles, specify `--nozzle-size 0.4` (or your nozzle size)
- The converter will prompt if not specified

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please ensure:
- TypeScript code follows strict type checking (no `any` or unnecessary type assertions)
- Code is properly formatted and linted
- New features include appropriate tests
- Documentation is updated

## Version History

- **1.0.0** - Initial TypeScript version with full feature parity
- Original Perl version maintained for compatibility
