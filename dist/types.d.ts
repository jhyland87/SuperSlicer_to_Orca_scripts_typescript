/**
 * Type definitions and constants for the SuperSlicer to OrcaSlicer converter.
 *
 * This module defines all TypeScript types, interfaces, and type aliases used throughout
 * the converter application.
 */
/** The OrcaSlicer version string to include in converted JSON files. */
export declare const ORCA_SLICER_VERSION = "1.6.0.0";
/**
 * Profile type identifiers for INI files.
 *
 * - `print`: Print profile settings
 * - `filament`: Filament material settings
 * - `printer`: Printer/machine settings
 * - `physical_printer`: Physical printer network configuration
 * - `unsupported`: File type that cannot be converted
 */
export type IniType = 'print' | 'filament' | 'printer' | 'physical_printer' | 'unsupported';
/**
 * Valid output profile types (excludes physical_printer and unsupported).
 * Used for type-safe access to output directory structures.
 */
export type OutputIniType = 'print' | 'filament' | 'printer';
/**
 * Source slicer application identifier.
 *
 * - `PrusaSlicer`: Original PrusaSlicer
 * - `SuperSlicer`: SuperSlicer fork
 * - `Unknown`: Slicer could not be detected
 */
export type SlicerFlavor = 'PrusaSlicer' | 'SuperSlicer' | 'Unknown';
/**
 * Options for handling existing output files.
 *
 * - `LEAVE IT ALONE`: Skip the file (do not convert)
 * - `MERGE NEW PARAMETERS`: Merge new parameters into existing file
 * - `OVERWRITE`: Replace existing file completely
 */
export type OnExistingOption = 'LEAVE IT ALONE' | 'MERGE NEW PARAMETERS' | 'OVERWRITE';
/**
 * System directory structure mapping for different operating systems and profile types.
 *
 * Defines the directory paths used by PrusaSlicer/SuperSlicer and OrcaSlicer on different platforms.
 */
export interface SystemDirectories {
    /** OS-specific directory components for user data directories. */
    os: {
        /** Linux: `.config` directory path components */
        linux: string[];
        /** Windows: `AppData\Roaming` directory path components */
        MSWin32: string[];
        /** macOS: `Library\Application Support` directory path components */
        darwin: string[];
    };
    /** Input directory names in PrusaSlicer/SuperSlicer. */
    input: {
        Filament: string;
        Print: string;
        Printer: string;
    };
    /** Output directory structure in OrcaSlicer (user/default/[type]). */
    output: {
        filament: string[];
        print: string[];
        printer: string[];
    };
}
/**
 * Global application state and configuration.
 *
 * Tracks conversion progress, user choices, directory paths, and various flags
 * throughout the conversion process.
 */
export interface Status {
    /** Whether --force-output flag was set */
    forceOut: boolean;
    /** Whether deprecated --overwrite flag was used */
    legacyOverwrite: boolean;
    /** Maximum nozzle temperature encountered (for filament profiles) */
    maxTemp: number;
    /** Whether running in interactive mode (no --input specified) */
    interactiveMode: boolean;
    /** Whether --outdir was explicitly provided by user */
    outdirWasProvided: boolean;
    /** Detected source slicer flavor */
    slicerFlavor?: SlicerFlavor;
    /** Detected or specified INI file type */
    iniType?: IniType;
    /** Profile name from config bundle or filename */
    profileName?: string;
    /** Ironing type value (tracked separately) */
    ironingType?: string;
    /** Number of files remaining to process */
    iterationsLeft?: number;
    dirs: {
        output?: string;
        data: string;
        slicer?: string;
        temp?: string;
    };
    toVar: {
        externalPerimetersFirst?: boolean;
        infillFirst?: boolean;
        ironing?: boolean;
    };
    reset: {
        onExisting: boolean;
        physicalPrinter: boolean;
        nozzleSize: boolean;
        inherits: boolean;
        compatiblePrintersCondition: boolean;
        compatiblePrintsCondition: boolean;
    };
    value: {
        onExisting?: OnExistingOption;
        physicalPrinter?: string;
        nozzleSize?: number;
        inherits?: string;
        compatiblePrintersCondition?: string;
        compatiblePrintsCondition?: string;
    };
}
/**
 * Record of a file conversion attempt for summary reporting.
 */
export interface ConvertedFile {
    /** Basename of the input file */
    inputFile: string;
    /** Directory containing the input file */
    inputDir: string;
    /** Source slicer that generated the input file */
    slicerFlavor: SlicerFlavor;
    /** Basename of the output file (empty if conversion failed) */
    outputFile: string;
    /** Directory containing the output file (empty if conversion failed) */
    outputDir: string;
    /** Conversion status: 'YES', 'NO', or 'MERGED' */
    success: string;
    /** Error message if conversion failed, empty string otherwise */
    error: string;
    /** Physical printer file basename (printer profiles only) */
    physicalPrinterFile?: string;
    /** Physical printer file directory (printer profiles only) */
    physicalPrinterDir?: string;
}
/**
 * Source INI configuration as a key-value map.
 *
 * Keys are parameter names, values are their string representations.
 * Values may be undefined for parameters that weren't set.
 */
export interface SourceIni {
    [key: string]: string | undefined;
}
/**
 * Output JSON hash structure for OrcaSlicer profiles.
 *
 * Values can be strings, numbers, or string arrays depending on the parameter type.
 */
export interface NewHash {
    [key: string]: string | number | string[] | undefined;
}
/**
 * Parameter mapping structure from source INI parameter names to OrcaSlicer JSON keys.
 *
 * Organized by INI type. Values can be single strings or arrays (for parameters that map to multiple keys).
 */
export type ParameterMap = {
    [key in IniType]?: {
        [key: string]: string | string[];
    };
};
/** Type indicator for multivalue parameters (single value or array). */
export type MultivalueParamType = 'single' | 'array';
/**
 * Mapping of parameter names to their multivalue type.
 *
 * 'single' means the parameter should be converted to a single value from a comma/semicolon-separated list.
 * 'array' means the parameter should remain as an array.
 */
export interface MultivalueParams {
    [key: string]: MultivalueParamType;
}
//# sourceMappingURL=types.d.ts.map