/**
 * File I/O operations for reading INI files, writing JSON files, and handling config bundles.
 *
 * This module provides functions for:
 * - Reading and parsing INI files
 * - Reading and writing JSON files
 * - File system operations (exists, isDirectory, isFile, isWritable)
 * - Path manipulation utilities
 * - Config bundle detection and processing
 */
import { SourceIni, SlicerFlavor } from './types';
/**
 * Reads and parses an INI file, extracting key-value pairs and detecting the slicer flavor.
 *
 * @param filePath - The path to the INI file to read
 * @returns An object containing the parsed configuration and detected slicer flavor
 * @returns Returns.config - Key-value pairs from the INI file
 * @returns Returns.slicerFlavor - Detected slicer ('PrusaSlicer' or 'SuperSlicer') if found in header comments
 *
 * @throws {Error} If the file cannot be read
 *
 * @example
 * ```ts
 * const { config, slicerFlavor } = readIniFile("profile.ini");
 * console.log(config['layer_height']); // "0.2"
 * console.log(slicerFlavor); // "PrusaSlicer"
 * ```
 */
export declare function readIniFile(filePath: string): {
    config: SourceIni;
    slicerFlavor?: SlicerFlavor;
};
/**
 * Reads and parses a JSON file.
 *
 * @param filePath - The path to the JSON file to read
 * @returns The parsed JSON object
 * @throws {SyntaxError} If the JSON is invalid
 * @throws {Error} If the file cannot be read
 *
 * @example
 * ```ts
 * const data = readJsonFile("config.json");
 * console.log(data.version); // "1.6.0.0"
 * ```
 */
export declare function readJsonFile(filePath: string): Record<string, unknown>;
/**
 * Writes a JSON object to a file with pretty formatting.
 *
 * @param filePath - The path where the JSON file should be written
 * @param data - The data object to serialize to JSON
 * @throws {Error} If the directory cannot be created or the file cannot be written
 *
 * @remarks
 * Automatically creates parent directories if they don't exist.
 * The output is formatted with 2-space indentation and includes a trailing newline.
 *
 * @example
 * ```ts
 * writeJsonFile("output.json", { name: "profile", version: "1.6.0.0" });
 * ```
 */
export declare function writeJsonFile(filePath: string, data: Record<string, unknown>): void;
/**
 * Checks if a file or directory exists at the given path.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists, `false` otherwise
 */
export declare function fileExists(filePath: string): boolean;
/**
 * Checks if the given path is a directory.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists and is a directory, `false` otherwise
 */
export declare function isDirectory(filePath: string): boolean;
/**
 * Checks if the given path is a file.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists and is a file, `false` otherwise
 */
export declare function isFile(filePath: string): boolean;
/**
 * Checks if the given path is writable by the current user.
 *
 * @param filePath - The path to check
 * @returns `true` if the path is writable, `false` otherwise
 */
export declare function isWritable(filePath: string): boolean;
/**
 * Gets the basename (filename) from a file path, optionally removing an extension.
 *
 * @param filePath - The full file path
 * @param ext - Optional file extension to remove (e.g., ".ini")
 * @returns The basename without the extension if specified
 *
 * @example
 * ```ts
 * getBasename("/path/to/file.ini", ".ini") // "file"
 * getBasename("/path/to/file.ini")         // "file.ini"
 * ```
 */
export declare function getBasename(filePath: string, ext?: string): string;
/**
 * Gets the directory name from a file path.
 *
 * @param filePath - The full file path
 * @returns The directory portion of the path
 *
 * @example
 * ```ts
 * getDirname("/path/to/file.ini") // "/path/to"
 * ```
 */
export declare function getDirname(filePath: string): string;
/**
 * Joins path segments into a single path string.
 *
 * @param parts - Path segments to join
 * @returns The joined path string
 *
 * @example
 * ```ts
 * joinPath("a", "b", "c") // "a/b/c" on Unix, "a\\b\\c" on Windows
 * ```
 */
export declare function joinPath(...parts: string[]): string;
/**
 * Checks if a file is a config bundle (contains multiple profiles in one file).
 *
 * @param filePath - The path to the file to check
 * @returns `true` if the file appears to be a config bundle, `false` otherwise
 *
 * @remarks
 * Config bundles contain sections in the format [type:name] followed by profile content.
 *
 * @example
 * ```ts
 * if (isConfigBundle("bundle.ini")) {
 *   const { files } = processConfigBundle("bundle.ini", tempDir);
 * }
 * ```
 */
export declare function isConfigBundle(filePath: string): boolean;
/**
 * Processes a config bundle file, splitting it into individual INI files.
 *
 * @param filePath - The path to the config bundle file
 * @param tempDir - The temporary directory where individual files should be created
 * @returns An object containing the list of created file paths, header line, and temp directory
 * @returns Returns.files - Array of paths to created INI files (excludes physical_printer profiles)
 * @returns Returns.headerLine - The header comment line from the original bundle, if found
 * @returns Returns.tempDir - The temporary directory path
 *
 * @remarks
 * Config bundles contain multiple profiles in the format [type:name] followed by content.
 * Physical printer profiles are extracted but not included in the returned files array.
 * Filenames are sanitized based on OS-specific illegal characters.
 *
 * @example
 * ```ts
 * const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orca-'));
 * const { files } = processConfigBundle("bundle.ini", tempDir);
 * // files contains paths to individual profile INI files
 * ```
 */
export declare function processConfigBundle(filePath: string, tempDir: string): {
    files: string[];
    headerLine?: string;
    tempDir: string;
};
/**
 * Gets all child entries (files and directories) from a directory, optionally filtered by a pattern.
 *
 * @param dirPath - The directory path to read
 * @param pattern - Optional regex pattern to match against basenames
 * @returns Array of full paths to matching entries, or empty array if directory doesn't exist
 *
 * @example
 * ```ts
 * getChildren("/path/to/profiles", /\.ini$/) // Returns all .ini files
 * getChildren("/path/to/profiles")            // Returns all entries
 * ```
 */
export declare function getChildren(dirPath: string, pattern?: RegExp): string[];
//# sourceMappingURL=fileIO.d.ts.map