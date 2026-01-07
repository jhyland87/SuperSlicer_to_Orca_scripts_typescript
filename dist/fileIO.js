"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readIniFile = readIniFile;
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
exports.fileExists = fileExists;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.isWritable = isWritable;
exports.getBasename = getBasename;
exports.getDirname = getDirname;
exports.joinPath = joinPath;
exports.isConfigBundle = isConfigBundle;
exports.processConfigBundle = processConfigBundle;
exports.getChildren = getChildren;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
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
function readIniFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const config = {};
    let slicerFlavor;
    for (const line of lines) {
        // Detect which slicer we're importing from
        const slicerMatch = line.match(/^#\s*generated\s+by\s+(\S+)/i);
        if (slicerMatch) {
            const slicer = slicerMatch[1];
            if (slicer.includes('PrusaSlicer')) {
                slicerFlavor = 'PrusaSlicer';
            }
            else if (slicer.includes('SuperSlicer')) {
                slicerFlavor = 'SuperSlicer';
            }
        }
        // Skip empty and comment lines
        if (/^\s*(?:#|$)/.test(line))
            continue;
        const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            config[key] = value;
        }
    }
    return { config, slicerFlavor };
}
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
function readJsonFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
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
function writeJsonFile(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
/**
 * Checks if a file or directory exists at the given path.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists, `false` otherwise
 */
function fileExists(filePath) {
    return fs.existsSync(filePath);
}
/**
 * Checks if the given path is a directory.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists and is a directory, `false` otherwise
 */
function isDirectory(filePath) {
    try {
        return fs.statSync(filePath).isDirectory();
    }
    catch {
        return false;
    }
}
/**
 * Checks if the given path is a file.
 *
 * @param filePath - The path to check
 * @returns `true` if the path exists and is a file, `false` otherwise
 */
function isFile(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch {
        return false;
    }
}
/**
 * Checks if the given path is writable by the current user.
 *
 * @param filePath - The path to check
 * @returns `true` if the path is writable, `false` otherwise
 */
function isWritable(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.W_OK);
        return true;
    }
    catch {
        return false;
    }
}
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
function getBasename(filePath, ext) {
    const basename = path.basename(filePath);
    if (ext && basename.endsWith(ext)) {
        return basename.slice(0, -ext.length);
    }
    return basename;
}
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
function getDirname(filePath) {
    return path.dirname(filePath);
}
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
function joinPath(...parts) {
    return path.join(...parts);
}
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
function isConfigBundle(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return /\[\w+:[\w\s\+\-]+\]/.test(content);
}
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
function processConfigBundle(filePath, tempDir) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const headerMatch = content.match(/^(# generated[^\n]*)/m);
    const headerLine = headerMatch ? headerMatch[1] : undefined;
    const files = [];
    const regex = /\[([\w\s\+\-]+):([^\]]+)\]\n(.*?)\n(?=\[|$)/gs;
    let match;
    const os = (0, utils_1.getOS)();
    let illegalRegex;
    if (os === 'MSWin32') {
        illegalRegex = /[<>:"\/\\|?*\x00-\x1F]/;
    }
    else if (os === 'darwin') {
        illegalRegex = /[:]/;
    }
    else {
        illegalRegex = /\//;
    }
    while ((match = regex.exec(content)) !== null) {
        const [, profileType, profileName, profileContent] = match;
        const isPhysicalPrinter = profileType === 'physical_printer';
        // Clean filename
        let tempFilename = profileName.replace(illegalRegex, '');
        let finalPath = isPhysicalPrinter
            ? joinPath(tempDir, 'physical_printer', `${tempFilename}.ini`)
            : joinPath(tempDir, `${tempFilename}.ini`);
        // Handle duplicate filenames
        if (fileExists(finalPath) && !isPhysicalPrinter) {
            tempFilename = `${profileType}_${tempFilename}`;
            finalPath = joinPath(tempDir, `${tempFilename}.ini`);
        }
        // Create directory if needed
        const dir = path.dirname(finalPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const fileContent = `${headerLine || ''}\n\nini_type = ${profileType}\nprofile_name = ${profileName}\n${profileContent}`;
        fs.writeFileSync(finalPath, fileContent, 'utf-8');
        if (!isPhysicalPrinter) {
            files.push(finalPath);
        }
    }
    return { files, headerLine, tempDir };
}
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
function getChildren(dirPath, pattern) {
    if (!fs.existsSync(dirPath) || !isDirectory(dirPath)) {
        return [];
    }
    const entries = fs.readdirSync(dirPath);
    return entries
        .map(entry => joinPath(dirPath, entry))
        .filter(entry => {
        if (pattern) {
            return pattern.test(path.basename(entry));
        }
        return true;
    });
}
//# sourceMappingURL=fileIO.js.map