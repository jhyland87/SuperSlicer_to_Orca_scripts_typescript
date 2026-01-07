/**
 * Core conversion logic for transforming INI parameters to OrcaSlicer JSON format.
 *
 * This module handles:
 * - Parameter conversion with special case handling
 * - Print parameter calculations (speeds, print order, etc.)
 * - INI type detection
 * - Complex parameter transformations (percentages, types, etc.)
 */
import { Status, SourceIni, NewHash, IniType } from './types';
/**
 * Converts a single parameter from the source INI format to OrcaSlicer JSON format.
 *
 * @param parameter - The parameter name from the source INI file
 * @param file - The filename being processed (for user prompts), or undefined
 * @param sourceIni - The complete source INI configuration object
 * @param status - The global status object containing conversion state
 * @param newHash - The output hash object where converted values are stored
 * @returns The converted value (string, string array, or undefined), or undefined if parameter should be skipped
 *
 * @remarks
 * This function handles:
 * - Parameter mapping to OrcaSlicer equivalents
 * - Special case conversions (percentages, speeds, types, etc.)
 * - Multivalue parameter handling
 * - Tracking of combination settings (external_perimeters_first, infill_first, ironing)
 * - Interactive prompts for compatible condition strings
 *
 * @example
 * ```ts
 * const value = await convertParams("layer_height", "my_profile", sourceIni, status, newHash);
 * // value might be "0.2" or undefined if parameter should be skipped
 * ```
 */
export declare function convertParams(parameter: string, file: string | undefined, sourceIni: SourceIni, status: Status, newHash: NewHash): Promise<string | string[] | undefined>;
/**
 * Calculates and converts print-specific parameters, including speed settings and print order.
 *
 * @param sourceIni - The complete source INI configuration object
 * @param status - The global status object containing conversion state
 * @param newHash - The output hash object where converted values are stored (modified in place)
 * @returns The updated newHash object with all print parameters converted
 *
 * @remarks
 * This function handles:
 * - Speed parameter conversions (percentage to absolute values)
 * - Dynamic overhang speed thresholds
 * - Wall infill order calculation
 * - Ironing type evaluation
 *
 * @example
 * ```ts
 * const result = await calculatePrintParams(sourceIni, status, newHash);
 * // newHash now contains all converted print parameters
 * ```
 */
export declare function calculatePrintParams(sourceIni: SourceIni, status: Status, newHash: NewHash): Promise<NewHash>;
/**
 * Detects the type of INI file by analyzing which parameters are present.
 *
 * @param sourceIni - The source INI configuration object to analyze
 * @returns The detected ini type ('print', 'filament', 'printer', etc.), or undefined if type cannot be determined
 *
 * @remarks
 * The function counts how many parameters from each type's parameter map are present in the source.
 * Returns the type with the highest count, but only if at least 10 matching parameters are found.
 * If 'ini_type' is explicitly set in the source, that value is returned directly.
 *
 * @example
 * ```ts
 * const type = detectIniType(sourceIni);
 * if (type === 'print') {
 *   // Handle print profile
 * }
 * ```
 */
export declare function detectIniType(sourceIni: SourceIni): IniType | undefined;
//# sourceMappingURL=conversion.d.ts.map