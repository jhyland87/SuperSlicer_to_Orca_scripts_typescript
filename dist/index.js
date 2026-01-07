#!/usr/bin/env node
"use strict";
/**
 * Main entry point for SuperSlicer/PrusaSlicer to OrcaSlicer profile converter.
 *
 * This module provides a command-line tool to convert INI profile files from PrusaSlicer
 * and SuperSlicer to JSON format for use with OrcaSlicer. Supports interactive and batch modes.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitWithConversionSummary = exitWithConversionSummary;
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const glob_1 = require("glob");
const cli_table3_1 = __importDefault(require("cli-table3"));
const constants_1 = require("./constants");
const types_1 = require("./types");
const utils_1 = require("./utils");
const fileIO_1 = require("./fileIO");
const menu_1 = require("./menu");
const conversion_1 = require("./conversion");
const parameterMap_1 = require("./parameterMap");
// Global state
let status;
let newHash = {};
const convertedFiles = {};
/**
 * Initializes the global status object with default values.
 *
 * @returns A new Status object with all fields initialized to their default values
 *
 * @remarks
 * Sets up OS-specific data directory paths and initializes all tracking variables.
 * The data directory is determined based on the operating system.
 */
function initializeStatus() {
    const osType = (0, utils_1.getOS)();
    const homeDir = (0, utils_1.getHomeDir)();
    const osDirs = constants_1.systemDirectories.os[osType];
    const dataDir = path.join(homeDir, ...osDirs);
    return {
        forceOut: false,
        legacyOverwrite: false,
        maxTemp: 0,
        interactiveMode: false,
        outdirWasProvided: false,
        slicerFlavor: undefined,
        iniType: undefined,
        profileName: undefined,
        ironingType: undefined,
        iterationsLeft: undefined,
        dirs: {
            output: undefined,
            data: dataDir,
            slicer: undefined,
            temp: undefined
        },
        toVar: {
            externalPerimetersFirst: undefined,
            infillFirst: undefined,
            ironing: undefined
        },
        reset: {
            onExisting: false,
            physicalPrinter: false,
            nozzleSize: false,
            inherits: false,
            compatiblePrintersCondition: false,
            compatiblePrintsCondition: false
        },
        value: {
            onExisting: undefined,
            physicalPrinter: undefined,
            nozzleSize: undefined,
            inherits: undefined,
            compatiblePrintersCondition: undefined,
            compatiblePrintsCondition: undefined
        }
    };
}
/**
 * Prints usage information and exits the program.
 *
 * @remarks
 * Displays comprehensive help text explaining all command-line options and exits with code 1.
 */
function printUsageAndExit() {
    const usage = `Usage: ${process.argv[1]} [options]

Options:
  --input <PATTERN>             Specifies the input PrusaSlicer or SuperSlicer
                                INI file(s). Use this option to bypass
                                the interactive profile selector. You can use 
                                wildcards to specify multiple files. You may also
                                pass multiple space-separated arguments to this
                                option to specify multiple filenames. Any file
                                path(s) containing a space must be enclosed in
                                quotes. (Optional)

  --outdir <DIRECTORY>          Specifies the ROOT OrcaSlicer settings directory.
                                (Optional) If this is not specified, the script will
                                default to the typical location, which is:      
                   in Windows:  C:\\Users\\%USERNAME%\\AppData\\Roaming\\OrcaSlicer
                     in MacOS:  ~/Library/Application Support/OrcaSlicer
                     in Linux:  ~/.config/OrcaSlicer

  --nozzle-size <DECIMAL>       For print profiles, specifies the diameter (in 
                                mm) of the nozzle the print profile is
                                intended to be used with (e.g. --nozzle-size
                                0.4). If this is not specified, the script will
                                prompt you to enter a nozzle size when converting
                                print profiles. (Optional)

  --physical-printer <PATTERN>  Specifies the INI file for the corresponding
                                "physical printer" when converting printer
                                config files. If this option is not used, the
                                script will give you a choice among detected
                                "physical printer" profiles. (Optional)

  --on-existing <CHOICE>        Forces the behavior when an output file already
                                exists. Valid choices are: "skip" to leave all 
                                existing files alone, "overwrite" to overwrite all 
                                existing output files, and "merge" to merge new
                                key/value pairs into all existing output files
                                while leaving existing key/value pairs unmodified.
                                (Optional)

  --force-output                Forces the script to output the converted JSON
                                files to the output directory specified with 
                                '--outdir'. Use this option if you do not want 
                                the new files to be placed in your OrcaSlicer 
                                settings folder. (Optional)

  -h, --help                    Displays this usage information.
`;
    console.log(usage);
    process.exit(1);
}
/**
 * Verifies that the output directory exists and is writable.
 *
 * @param directory - The directory path to check
 * @throws Exits the process with code 1 if the directory doesn't exist or is not writable
 *
 * @remarks
 * Provides helpful error messages that differ based on whether --force-output was used.
 */
function checkOutputDirectory(directory) {
    let dieMsg = `\nOutput directory ${directory} cannot be found.\n`;
    if (!status.forceOut) {
        dieMsg += `Are you sure that ${status.dirs.output} is the correct ROOT directory of your OrcaSlicer installation?\n(Run this script with the -h flag for more info.\n`;
    }
    if (!(0, fileIO_1.isDirectory)(directory)) {
        console.error(dieMsg);
        process.exit(1);
    }
    if (!(0, fileIO_1.isWritable)(directory)) {
        console.error(`Output directory ${directory} is not writable.\n`);
        process.exit(1);
    }
}
/**
 * Resets tracking variables and state to prepare for processing the next input file.
 *
 * @remarks
 * Clears the newHash, resets temperature tracking, and clears profile-specific state.
 * Also resets any values that were marked for reset (from "apply to all" prompts).
 * In interactive mode, preserves the iniType across files.
 */
function resetLoop() {
    newHash = {};
    status.maxTemp = 0;
    if (!status.interactiveMode) {
        status.iniType = undefined;
    }
    status.profileName = undefined;
    status.toVar.externalPerimetersFirst = undefined;
    status.toVar.infillFirst = undefined;
    status.toVar.ironing = undefined;
    status.ironingType = undefined;
    for (const param of Object.keys(status.reset)) {
        const key = param;
        if (status.reset[key]) {
            const valueKey = param;
            status.value[valueKey] = undefined;
            status.reset[key] = false;
        }
    }
}
/**
 * Logs the conversion status of a file for the final summary report.
 *
 * @param inputFile - The path to the input INI file
 * @param outputFile - The path to the output JSON file, or undefined if conversion failed
 * @param slicerFlavor - The detected slicer flavor (PrusaSlicer, SuperSlicer, or Unknown)
 * @param success - Success status: 'YES', 'NO', or 'MERGED'
 * @param error - Optional error message if conversion failed
 *
 * @remarks
 * Creates a ConvertedFile record and adds it to the convertedFiles collection,
 * organized by file type. Also handles physical printer file information for printer profiles.
 * Automatically calls resetLoop() after logging.
 */
function logFileStatus(inputFile, outputFile, slicerFlavor, success, error) {
    const completedFile = {
        inputFile: (0, fileIO_1.getBasename)(inputFile),
        inputDir: (0, fileIO_1.getDirname)(inputFile),
        slicerFlavor,
        outputFile: outputFile ? (0, fileIO_1.getBasename)(outputFile) : '',
        outputDir: outputFile ? (0, fileIO_1.getDirname)(outputFile) : '',
        success,
        error: error || ''
    };
    if (status.iniType === 'printer') {
        const physPrinter = status.value.physicalPrinter;
        if (physPrinter && (0, fileIO_1.fileExists)(physPrinter)) {
            completedFile.physicalPrinterFile = (0, fileIO_1.getBasename)(physPrinter);
            completedFile.physicalPrinterDir = (0, fileIO_1.getDirname)(physPrinter);
        }
        else {
            completedFile.physicalPrinterFile = 'None';
            completedFile.physicalPrinterDir = '';
        }
    }
    const fileType = status.iniType ? status.iniType.charAt(0).toUpperCase() + status.iniType.slice(1) : 'Unknown';
    if (!convertedFiles[fileType]) {
        convertedFiles[fileType] = [];
    }
    convertedFiles[fileType].push(completedFile);
    resetLoop();
}
/**
 * Prompts the user to apply a choice to all remaining files or just the current one.
 *
 * @param param - The parameter name that was just set
 * @param file - The current file being processed
 *
 * @remarks
 * Only prompts if there are remaining files to process. If user chooses "JUST [file]",
 * marks the parameter for reset so it will be asked again for the next file.
 */
async function askYesToAll(param, file) {
    if (!status.iterationsLeft)
        return;
    const choice = await (0, menu_1.displayMenu)(`You have chosen \x1b[1m${status.value[param]}\x1b[0m. Would you like to apply this choice to ALL remaining profiles you are importing in this session? Or just to \x1b[1m${file}\x1b[0m?\n`, true, ['ALL REMAINING PROFILES', `JUST ${file}`]);
    const resetKey = param;
    status.reset[resetKey] = choice !== 'ALL REMAINING PROFILES';
}
/**
 * Handles physical printer configuration for printer profiles.
 *
 * @param inputFile - The path to the input printer INI file
 * @returns A record containing physical printer parameters to merge into the printer profile
 *
 * @remarks
 * If no physical printer was specified via command line, prompts the user to select one
 * from detected physical printer profiles. Extracts network-related settings from the
 * physical printer INI file and converts them for inclusion in the OrcaSlicer machine profile.
 *
 * @example
 * ```ts
 * const physData = await handlePhysicalPrinter("printer.ini");
 * // physData contains network settings like print_host, printhost_port, etc.
 * ```
 */
async function handlePhysicalPrinter(inputFile) {
    const printerHash = {};
    const file = (0, fileIO_1.getBasename)(inputFile, '.ini');
    if (!status.value.physicalPrinter) {
        const physicalPrinterDir = status.dirs.slicer
            ? (0, fileIO_1.joinPath)(status.dirs.slicer, 'physical_printer')
            : undefined;
        if (physicalPrinterDir && (0, fileIO_1.isDirectory)(physicalPrinterDir)) {
            const items = (0, fileIO_1.getChildren)(physicalPrinterDir, /\.ini$/);
            const itemNames = items.map(item => (0, fileIO_1.getBasename)(item, '.ini'));
            itemNames.push('<NONE>');
            const choice = await (0, menu_1.displayMenu)(`In SuperSlicer and some versions of PrusaSlicer, most network-configuration settings are stored in a separate "physical printer" .ini file. Choose one of the detected physical printers below if you want to include its network settings in ${file}\n\n`, true, itemNames);
            if (choice !== '<NONE>') {
                status.value.physicalPrinter = (0, fileIO_1.joinPath)(physicalPrinterDir, `${choice}.ini`);
            }
            else {
                status.value.physicalPrinter = '<NONE>';
            }
            await askYesToAll('physicalPrinter', file);
        }
        else {
            status.value.physicalPrinter = inputFile;
        }
    }
    if (status.value.physicalPrinter === '<NONE>') {
        return printerHash;
    }
    const { config: printerIni } = (0, fileIO_1.readIniFile)(status.value.physicalPrinter);
    const physPrinterMap = parameterMap_1.parameterMap.physical_printer;
    if (physPrinterMap) {
        for (const parameter of Object.keys(printerIni)) {
            if (!(parameter in physPrinterMap))
                continue;
            const newValue = await (0, conversion_1.convertParams)(parameter, file, printerIni, status, {});
            if (newValue && newValue !== '') {
                printerHash[parameter] = String(newValue);
            }
        }
    }
    return printerHash;
}
/**
 * Links a converted printer profile to a system printer in OrcaSlicer.
 *
 * @param file - The filename being processed (for display purposes)
 * @returns A record containing the 'inherits' key with the selected system printer name
 *
 * @remarks
 * Scans OrcaSlicer's system directory for configured printers and prompts the user to
 * select one. The 'inherits' parameter links the machine profile to a system printer,
 * which is required for network functionality. If '<NONE>' is selected, returns empty string.
 *
 * @example
 * ```ts
 * const inherits = await linkSystemPrinter("my_printer");
 * // inherits = { inherits: "Prusa i3 MK3S+" }
 * ```
 */
async function linkSystemPrinter(file) {
    if (status.value.inherits) {
        return { inherits: status.value.inherits };
    }
    const sysDir = (0, fileIO_1.joinPath)(status.dirs.output, 'system');
    const uniqueNames = {};
    if ((0, fileIO_1.isDirectory)(sysDir)) {
        const files = (0, fileIO_1.getChildren)(sysDir, /\.json$/);
        for (const jsonFile of files) {
            try {
                const decodedData = (0, fileIO_1.readJsonFile)(jsonFile);
                if (decodedData.machine_list && Array.isArray(decodedData.machine_list)) {
                    for (const machine of decodedData.machine_list) {
                        if (machine.name && !machine.name.match(/common/i)) {
                            uniqueNames[machine.name] = true;
                        }
                    }
                }
            }
            catch (e) {
                // Skip invalid JSON files
            }
        }
    }
    const sortedNames = Object.keys(uniqueNames).sort();
    sortedNames.push('<NONE>');
    const choice = await (0, menu_1.displayMenu)(`In OrcaSlicer, a "machine" profile must be associated with a printer selected and configured from the available system presets. Below is a list of the configured printers that have been detected in your OrcaSlicer installation.\n\nIf you do not see the printer you wish to associate with this profile, choose \x1b[1;31m<QUIT>\x1b[0m to exit this script, then configure your desired printer in OrcaSlicer and run this script again. Alternatively, you may select \x1b[1m<NONE>\x1b[0m to proceed without associating this "machine" profile with a configured printer, but network configuration and g-code upload will not be available.\n\nPlease choose an OrcaSlicer printer to associate with \x1b[1m${file}\x1b[0m:\n`, true, sortedNames);
    await askYesToAll('inherits', file);
    const inherits = choice === '<NONE>' ? '' : choice;
    status.value.inherits = inherits;
    return { inherits };
}
/**
 * Displays a comprehensive conversion summary with statistics and file details.
 *
 * @remarks
 * Shows:
 * - Detailed conversion tables for each profile type
 * - Statistics (total processed, converted, merged, failed)
 * - Source slicer breakdown
 * - Directory information (where files are located)
 * - Profile type breakdown
 *
 * Exits the process after displaying the summary.
 */
async function exitWithConversionSummary() {
    if (Object.keys(convertedFiles).length === 0) {
        console.log('\n\x1b[33mNo files were converted.\x1b[0m');
        process.exit(0);
    }
    // Calculate statistics
    let totalConverted = 0;
    let totalSkipped = 0;
    let totalMerged = 0;
    let totalFailed = 0;
    const outputDirs = new Set();
    const inputDirs = new Set();
    const slicerCounts = {};
    for (const fileType of Object.keys(convertedFiles)) {
        const files = convertedFiles[fileType];
        for (const file of files) {
            if (file.outputDir) {
                outputDirs.add(file.outputDir);
            }
            if (file.inputDir) {
                inputDirs.add(file.inputDir);
            }
            slicerCounts[file.slicerFlavor] = (slicerCounts[file.slicerFlavor] || 0) + 1;
            if (file.success === 'YES') {
                totalConverted++;
            }
            else if (file.success === 'MERGED') {
                totalMerged++;
            }
            else if (file.success === 'NO') {
                totalFailed++;
                if (file.error === 'Target file exists') {
                    totalSkipped++;
                }
            }
        }
    }
    // Display conversion tables
    for (const fileType of Object.keys(convertedFiles)) {
        const files = convertedFiles[fileType];
        if (files.length === 0)
            continue;
        const tableHead = ['Source File\nGenerated By', `${fileType} Profile Name`, 'Converted?', 'Error'];
        const tableColWidths = [12, 40, 10, 0];
        if (fileType === 'Printer') {
            tableHead.push('Imported Physical\nPrinter Data');
            tableColWidths.push(0);
        }
        const table = new cli_table3_1.default({
            head: tableHead,
            colWidths: tableColWidths
        });
        for (const file of files) {
            const itemName = (0, fileIO_1.getBasename)(file.inputFile, '.ini');
            const row = [
                file.slicerFlavor,
                itemName,
                file.success,
                file.error
            ];
            if (fileType === 'Printer') {
                row.push(file.physicalPrinterFile || 'None');
            }
            table.push(row);
        }
        console.log(`\n\x1b[1m${fileType} Files Converted\x1b[0m`);
        console.log(table.toString());
    }
    // Display statistics summary
    console.log('\n\x1b[1;32m═══════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[1;32m                    CONVERSION STATISTICS\x1b[0m');
    console.log('\x1b[1;32m═══════════════════════════════════════════════════════════\x1b[0m\n');
    const statsTable = new cli_table3_1.default({
        head: ['Metric', 'Count'],
        colWidths: [35, 15]
    });
    const totalProcessed = totalConverted + totalMerged + totalFailed;
    statsTable.push(['Total Files Processed', String(totalProcessed)]);
    statsTable.push(['\x1b[32m✓ Successfully Converted\x1b[0m', `\x1b[32m${totalConverted}\x1b[0m`]);
    statsTable.push(['\x1b[33m↻ Merged with Existing\x1b[0m', `\x1b[33m${totalMerged}\x1b[0m`]);
    statsTable.push(['\x1b[31m✗ Failed\x1b[0m', `\x1b[31m${totalFailed}\x1b[0m`]);
    if (totalSkipped > 0) {
        statsTable.push(['  └─ Skipped (file exists)', String(totalSkipped)]);
    }
    console.log(statsTable.toString());
    // Display source breakdown
    if (Object.keys(slicerCounts).length > 0) {
        console.log('\n\x1b[1mSource Slicer Breakdown:\x1b[0m');
        const slicerTable = new cli_table3_1.default({
            head: ['Slicer', 'Files'],
            colWidths: [20, 10]
        });
        for (const [slicer, count] of Object.entries(slicerCounts)) {
            slicerTable.push([slicer, String(count)]);
        }
        console.log(slicerTable.toString());
    }
    // Display directory information
    console.log('\n\x1b[1mDirectory Information:\x1b[0m');
    if (inputDirs.size > 0) {
        console.log(`\x1b[36mSource Directory:\x1b[0m`);
        for (const dir of inputDirs) {
            console.log(`  ${dir}`);
        }
    }
    if (outputDirs.size > 0) {
        console.log(`\n\x1b[36mOutput Directory(ies):\x1b[0m`);
        for (const dir of outputDirs) {
            console.log(`  \x1b[32m${dir}\x1b[0m`);
        }
        console.log('\n\x1b[1m✓ Converted profiles can be found in the output directory(ies) above.\x1b[0m');
    }
    // Display file type breakdown
    const typeBreakdown = {};
    for (const fileType of Object.keys(convertedFiles)) {
        typeBreakdown[fileType] = convertedFiles[fileType].length;
    }
    if (Object.keys(typeBreakdown).length > 1) {
        console.log('\n\x1b[1mProfile Type Breakdown:\x1b[0m');
        const typeTable = new cli_table3_1.default({
            head: ['Profile Type', 'Count'],
            colWidths: [20, 10]
        });
        for (const [type, count] of Object.entries(typeBreakdown)) {
            typeTable.push([type, String(count)]);
        }
        console.log(typeTable.toString());
    }
    console.log('\n\x1b[1;32m═══════════════════════════════════════════════════════════\x1b[0m\n');
}
/**
 * Main entry point for the converter application.
 *
 * @remarks
 * Handles command-line argument parsing, file discovery, and the main conversion loop.
 * Supports both interactive mode (no arguments) and batch mode (with --input).
 * Processes each file, converts parameters, and writes JSON output files.
 *
 * @throws {Error} If critical errors occur (invalid arguments, missing directories, etc.)
 */
async function main() {
    status = initializeStatus();
    const program = new commander_1.Command();
    program
        .name('superslicer-to-orca')
        .description('Convert PrusaSlicer and SuperSlicer INI profiles to OrcaSlicer JSON format')
        .option('-i, --input <files...>', 'Input INI file(s)')
        .option('-o, --outdir <directory>', 'Output directory')
        .option('--overwrite', 'Deprecated: use --on-existing overwrite')
        .option('--on-existing <choice>', 'Behavior when output exists: skip, merge, or overwrite')
        .option('--nozzle-size <size>', 'Nozzle size in mm')
        .option('--physical-printer <file>', 'Physical printer INI file')
        .option('--force-output', 'Force output to specified directory')
        .option('-h, --help', 'Display help')
        .parse(process.argv);
    const options = program.opts();
    if (options.help) {
        printUsageAndExit();
    }
    // Parse options
    const inputFiles = options.input || [];
    if (options.outdir) {
        status.dirs.output = options.outdir;
        status.outdirWasProvided = true;
    }
    if (options.overwrite) {
        status.legacyOverwrite = true;
    }
    if (options.onExisting) {
        const choice = options.onExisting.toLowerCase();
        if (constants_1.onExistingOpts[choice]) {
            status.value.onExisting = constants_1.onExistingOpts[choice];
        }
        else {
            console.error(`Invalid value for --on-existing: ${options.onExisting}. Valid values are 'skip', 'merge', and 'overwrite'.`);
            process.exit(1);
        }
    }
    if (status.legacyOverwrite) {
        status.value.onExisting = constants_1.onExistingOpts.overwrite;
    }
    if (options.nozzleSize) {
        status.value.nozzleSize = parseFloat(options.nozzleSize);
    }
    if (options.physicalPrinter) {
        status.value.physicalPrinter = options.physicalPrinter;
    }
    if (options.forceOutput) {
        status.forceOut = true;
    }
    // Set default output directory to current working directory
    if (!status.dirs.output) {
        const cwd = process.cwd();
        const outputFolderName = 'orca_converted_profiles';
        status.dirs.output = (0, fileIO_1.joinPath)(cwd, outputFolderName);
        // Create the output directory if it doesn't exist
        if (!fs.existsSync(status.dirs.output)) {
            fs.mkdirSync(status.dirs.output, { recursive: true });
            console.log(`\x1b[36mCreated output directory: ${status.dirs.output}\x1b[0m\n`);
        }
    }
    else {
        // --outdir was specified
        // Create it if it doesn't exist
        if (!fs.existsSync(status.dirs.output)) {
            fs.mkdirSync(status.dirs.output, { recursive: true });
        }
    }
    // Determine what to convert if not specified
    let expandedInputFiles = [];
    if (inputFiles.length === 0) {
        status.interactiveMode = true;
        const dataDir = status.dirs.data;
        const children = fs.readdirSync(dataDir, { withFileTypes: true });
        const sourceSlicers = children
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(name => /PrusaSlicer|SuperSlicer/.test(name));
        if (sourceSlicers.length === 0) {
            console.error(`No PrusaSlicer or SuperSlicer directories detected in ${dataDir}.\n\nPlease verify the location of the files you wish to convert and specify them with the --input option if necessary.`);
            process.exit(1);
        }
        const slicerChoice = await (0, menu_1.displayMenu)('Which slicer do you want to import from?\n', true, sourceSlicers);
        status.dirs.slicer = (0, fileIO_1.joinPath)(dataDir, slicerChoice);
        const configTypes = ['filament', 'print', 'printer'].filter(type => {
            const dir = (0, fileIO_1.joinPath)(status.dirs.slicer, type);
            return (0, fileIO_1.isDirectory)(dir);
        }).map(type => type.charAt(0).toUpperCase() + type.slice(1));
        const configChoice = await (0, menu_1.displayMenu)('What kind of profile would you like to import?\n', true, configTypes);
        status.iniType = configChoice.toLowerCase();
        const itemDir = (0, fileIO_1.joinPath)(status.dirs.slicer, configChoice.toLowerCase());
        const items = (0, fileIO_1.getChildren)(itemDir, /\.ini$/);
        const itemNames = items.map(item => (0, fileIO_1.getBasename)(item, '.ini'));
        const choices = await (0, menu_1.displayMenu)('Which profile(s) would you like to import?\n\n(Toggle multiple selections with <SPACE>. Press <ENTER> when finished.)\n', false, itemNames);
        expandedInputFiles = choices.map(choice => (0, fileIO_1.joinPath)(itemDir, `${choice}.ini`));
    }
    else {
        // Expand wildcards and handle config bundles
        for (const pattern of inputFiles) {
            if ((0, fileIO_1.isDirectory)(pattern)) {
                const children = (0, fileIO_1.getChildren)(pattern, /\.ini$/);
                expandedInputFiles.push(...children);
            }
            else {
                const matches = await (0, glob_1.glob)(pattern);
                for (const match of matches) {
                    if (!(0, fileIO_1.isFile)(match)) {
                        console.log(`Cannot find ${match}`);
                        continue;
                    }
                    if (!match.endsWith('.ini')) {
                        console.log(`${match} is not a .ini file!`);
                        continue;
                    }
                    // Check if it's a config bundle
                    if ((0, fileIO_1.isConfigBundle)(match)) {
                        // Create temp directory
                        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orca-convert-'));
                        status.dirs.temp = tempDir;
                        status.dirs.slicer = tempDir;
                        const { files } = (0, fileIO_1.processConfigBundle)(match, tempDir);
                        expandedInputFiles.push(...files);
                    }
                    else {
                        expandedInputFiles.push(match);
                    }
                }
            }
        }
    }
    const totalInputFiles = expandedInputFiles.length;
    // Process each file
    for (let index = 0; index < expandedInputFiles.length; index++) {
        const iteration = index + 1;
        status.iterationsLeft = totalInputFiles - iteration;
        const inputFile = expandedInputFiles[index];
        const file = (0, fileIO_1.getBasename)(inputFile, '.ini');
        // Read INI file
        const { config: sourceIni, slicerFlavor } = (0, fileIO_1.readIniFile)(inputFile);
        if (slicerFlavor) {
            status.slicerFlavor = slicerFlavor;
            if (!status.dirs.slicer) {
                status.dirs.slicer = (0, fileIO_1.joinPath)(status.dirs.data, slicerFlavor);
            }
        }
        if (!status.slicerFlavor) {
            logFileStatus(inputFile, undefined, 'Unknown', 'NO', 'Unsupported slicer');
            continue;
        }
        status.iniType = status.iniType || (0, conversion_1.detectIniType)(sourceIni);
        if (!status.iniType) {
            status.iniType = 'unsupported';
            logFileStatus(inputFile, undefined, status.slicerFlavor, 'NO', 'Unsupported file');
            continue;
        }
        // Determine output directory
        let outputSubdir;
        if (!status.dirs.output) {
            throw new Error('Output directory not set');
        }
        // If --outdir was specified without --force-output, use OrcaSlicer directory structure
        // Otherwise (default or with --force-output), use simple structure in current directory
        if (status.outdirWasProvided && !status.forceOut) {
            // --outdir was specified without --force-output
            // Use OrcaSlicer's standard directory structure
            if (!status.iniType || !(0, utils_1.isOutputIniType)(status.iniType)) {
                throw new Error(`Invalid ini type for output directory: ${status.iniType}`);
            }
            const outputIniType = status.iniType;
            outputSubdir = (0, fileIO_1.joinPath)(status.dirs.output, ...constants_1.systemDirectories.output[outputIniType]);
        }
        else {
            // Default behavior or --force-output: use simple structure
            // Organize by type in subdirectories for clarity
            if (!status.iniType || !(0, utils_1.isOutputIniType)(status.iniType)) {
                throw new Error(`Invalid ini type for output directory: ${status.iniType}`);
            }
            const outputIniType = status.iniType;
            // Create type-specific subdirectory for organization
            outputSubdir = (0, fileIO_1.joinPath)(status.dirs.output, outputIniType);
        }
        // Create the output subdirectory if it doesn't exist
        if (!fs.existsSync(outputSubdir)) {
            fs.mkdirSync(outputSubdir, { recursive: true });
        }
        checkOutputDirectory(outputSubdir);
        const outputFile = (0, fileIO_1.joinPath)(outputSubdir, `${file}.json`);
        // Handle nozzle size
        if (sourceIni['nozzle_diameter']) {
            const nozzleDiameters = (0, utils_1.multivalueToArray)(sourceIni['nozzle_diameter']);
            if (nozzleDiameters.length > 0) {
                status.value.nozzleSize = parseFloat(nozzleDiameters[0]);
            }
        }
        if (!status.value.nozzleSize && status.iniType === 'print') {
            const nozzleInput = await (0, menu_1.askInput)('Nozzle size: ', `Enter the nozzle size (in mm) of the nozzle intended to be used with the \x1b[1m${file}\x1b[0m profile (e.g. 0.4). Press <ENTER> when done.\n`, '');
            const cleaned = nozzleInput.replace(/[^\d.]/g, '');
            if (cleaned) {
                status.value.nozzleSize = parseFloat(cleaned);
            }
            await askYesToAll('nozzleSize', file);
            if (!status.value.nozzleSize) {
                const layerHeight = sourceIni['layer_height'];
                if (!layerHeight) {
                    logFileStatus(inputFile, outputFile, status.slicerFlavor, 'NO', 'Invalid layer height');
                    continue;
                }
                status.value.nozzleSize = 2 * parseFloat(layerHeight);
            }
        }
        // Process parameters
        newHash = {};
        if (!(0, utils_1.isValidIniType)(status.iniType)) {
            logFileStatus(inputFile, undefined, status.slicerFlavor, 'NO', 'Invalid ini type');
            continue;
        }
        const typeMap = parameterMap_1.parameterMap[status.iniType];
        if (!typeMap) {
            logFileStatus(inputFile, undefined, status.slicerFlavor, 'NO', 'No parameter map for ini type');
            continue;
        }
        for (const parameter of Object.keys(sourceIni)) {
            if (parameter === 'profile_name') {
                status.profileName = sourceIni[parameter];
                continue;
            }
            if (!(parameter in typeMap)) {
                continue;
            }
            const newValue = await (0, conversion_1.convertParams)(parameter, file, sourceIni, status, newHash);
            if (!newValue)
                continue;
            const mappedKey = typeMap[parameter];
            if (Array.isArray(mappedKey)) {
                // Already handled in convertParams
                continue;
            }
            if (typeof mappedKey === 'string') {
                newHash[mappedKey] = newValue;
            }
            // Track max temperature
            if ((parameter === 'first_layer_temperature' || parameter === 'temperature') && typeof newValue === 'string') {
                const temp = parseFloat(newValue);
                if (temp > status.maxTemp) {
                    status.maxTemp = temp;
                }
            }
        }
        const profileName = status.profileName || file;
        // Add metadata
        newHash[`${status.iniType}_settings_id`] = profileName;
        newHash['name'] = profileName;
        newHash['from'] = 'User';
        newHash['is_custom_defined'] = '1';
        newHash['version'] = types_1.ORCA_SLICER_VERSION;
        // Add profile-specific metadata
        if (status.iniType === 'filament') {
            newHash['nozzle_temperature_range_low'] = '0';
            newHash['nozzle_temperature_range_high'] = String(status.maxTemp);
            if (sourceIni['slowdown_below_layer_time']) {
                newHash['slow_down_for_layer_cooling'] = parseFloat(sourceIni['slowdown_below_layer_time']) > 0 ? '1' : '0';
            }
        }
        else if (status.iniType === 'print') {
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
        }
        else if (status.iniType === 'printer') {
            const inherits = await linkSystemPrinter(file);
            const physPrinterData = await handlePhysicalPrinter(inputFile);
            Object.assign(newHash, physPrinterData, inherits);
        }
        // Handle existing file
        if ((0, fileIO_1.fileExists)(outputFile)) {
            if (!status.value.onExisting) {
                const menuItems = [
                    constants_1.onExistingOpts.skip,
                    constants_1.onExistingOpts.overwrite,
                    constants_1.onExistingOpts.merge
                ];
                const choice = await (0, menu_1.displayMenu)(`Output file '${outputFile}' already exists!\n\nIf you \x1b[1m${constants_1.onExistingOpts.skip}\x1b[0m, the existing file will not be modified and this profile will not be converted.\n\nIf you \x1b[1m${constants_1.onExistingOpts.overwrite}\x1b[0m it, the file will be replaced with the contents of this converted profile.\n\nIf you \x1b[1m${constants_1.onExistingOpts.merge}\x1b[0m, the file will be amended to add any new key/value pairs from the source .ini that are not already present. Pre-existing key/value pairs will not be altered.\n\nWhat would you like to do?\n`, true, menuItems);
                status.value.onExisting = choice;
                await askYesToAll('onExisting', file);
            }
            if (status.value.onExisting === constants_1.onExistingOpts.skip) {
                logFileStatus(inputFile, outputFile, status.slicerFlavor, 'NO', 'Target file exists');
                continue;
            }
            else if (status.value.onExisting === constants_1.onExistingOpts.merge) {
                const existingJson = (0, fileIO_1.readJsonFile)(outputFile);
                Object.assign(newHash, existingJson);
            }
        }
        // Write output
        (0, fileIO_1.writeJsonFile)(outputFile, newHash);
        const success = (status.value.onExisting === constants_1.onExistingOpts.merge) ? 'MERGED' : 'YES';
        logFileStatus(inputFile, outputFile, status.slicerFlavor, success);
    }
    await exitWithConversionSummary();
    // Cleanup temp directory if it exists
    if (status.dirs.temp && fs.existsSync(status.dirs.temp)) {
        fs.rmSync(status.dirs.temp, { recursive: true, force: true });
    }
}
// Run main
main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map