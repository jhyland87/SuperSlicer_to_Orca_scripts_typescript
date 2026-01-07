/**
 * Utility functions for value validation, conversion, and type checking.
 *
 * This module provides helper functions for:
 * - Validating and converting numeric values (decimals, percentages)
 * - Converting between percentage and absolute values
 * - Evaluating print order and ironing settings
 * - OS detection and path utilities
 * - Type guards for INI type validation
 */
import { IniType, OutputIniType } from './types';
/**
 * Checks if a string value represents a valid decimal number.
 *
 * @param value - The string value to check
 * @returns `true` if the value is a valid decimal number, `false` otherwise
 *
 * @example
 * ```ts
 * isDecimal("123.45")  // true
 * isDecimal("123")     // true
 * isDecimal("abc")     // false
 * isDecimal(undefined) // false
 * ```
 */
export declare function isDecimal(value: string | undefined): boolean;
/**
 * Checks if a string value represents a valid percentage.
 *
 * @param value - The string value to check
 * @returns `true` if the value is a valid percentage (ends with %), `false` otherwise
 *
 * @example
 * ```ts
 * isPercent("50%")    // true
 * isPercent("123.45%") // true
 * isPercent("50")      // false
 * ```
 */
export declare function isPercent(value: string | undefined): boolean;
/**
 * Removes the percent symbol from a percentage string.
 *
 * @param value - The percentage string (e.g., "50%")
 * @returns The numeric part of the percentage without the % symbol, or empty string if value is undefined
 *
 * @example
 * ```ts
 * removePercent("50%")  // "50"
 * removePercent("100%")  // "100"
 * removePercent(undefined) // ""
 * ```
 */
export declare function removePercent(value: string | undefined): string;
/**
 * Converts a comma or semicolon-separated string into an array of trimmed values.
 *
 * @param inputString - The input string containing comma or semicolon-separated values
 * @returns An array of trimmed string values, or empty array if input is undefined
 *
 * @example
 * ```ts
 * multivalueToArray("a, b, c")     // ["a", "b", "c"]
 * multivalueToArray("x; y; z")     // ["x", "y", "z"]
 * multivalueToArray(undefined)     // []
 * ```
 */
export declare function multivalueToArray(inputString: string | undefined): string[];
/**
 * Unescapes common escape sequences in a string (e.g., \\n becomes newline).
 *
 * @param str - The string containing escape sequences
 * @returns The string with escape sequences converted to their actual characters
 *
 * @example
 * ```ts
 * unbackslash("Hello\\nWorld")  // "Hello\nWorld"
 * unbackslash("Path\\to\\file") // "Path\to\file"
 * ```
 */
export declare function unbackslash(str: string): string;
/**
 * Converts a percentage string to a float value, capping at 2.0.
 *
 * @param subjectValue - The percentage string (e.g., "150%") or regular value
 * @returns The float value as a string, capped at "2" if over 200%, or original value if not a percentage
 *
 * @example
 * ```ts
 * percentToFloat("150%")  // "1.5"
 * percentToFloat("250%")  // "2" (capped)
 * percentToFloat("50")    // "50" (not a percentage)
 * ```
 */
export declare function percentToFloat(subjectValue: string | undefined): string;
/**
 * Converts a percentage value to millimeters based on a comparator value.
 *
 * @param mmComparator - The base value in millimeters (as string or number)
 * @param percentParam - The percentage value to convert (e.g., "50%")
 * @returns The calculated millimeter value as a string, or undefined if conversion cannot be performed
 *
 * @example
 * ```ts
 * percentToMm(10, "50%")  // "5" (50% of 10mm = 5mm)
 * percentToMm(0.4, "200%") // "0.8"
 * percentToMm(10, "5")     // "5" (not a percentage, returned as-is)
 * ```
 */
export declare function percentToMm(mmComparator: string | number | undefined, percentParam: string | undefined): string | undefined;
/**
 * Converts a millimeter value to a percentage based on a comparator value.
 *
 * @param mmComparator - The base value in millimeters (as string or number)
 * @param mmParam - The millimeter value to convert to percentage
 * @returns The percentage value as a string (e.g., "50%"), or undefined if conversion cannot be performed
 *
 * @example
 * ```ts
 * mmToPercent(10, 5)   // "50%" (5mm is 50% of 10mm)
 * mmToPercent(0.4, 0.8) // "200%"
 * mmToPercent(10, "50%") // "50%" (already a percentage)
 * ```
 */
export declare function mmToPercent(mmComparator: string | number | undefined, mmParam: string | undefined): string | undefined;
/**
 * Evaluates the print order string based on external perimeters and infill first settings.
 *
 * @param externalPerimetersFirst - Whether external perimeters should be printed first
 * @param infillFirst - Whether infill should be printed first
 * @returns A string describing the print order (e.g., "inner wall/outer wall/infill")
 *
 * @example
 * ```ts
 * evaluatePrintOrder(false, false) // "inner wall/outer wall/infill"
 * evaluatePrintOrder(true, false)  // "outer wall/inner wall/infill"
 * evaluatePrintOrder(false, true)  // "infill/inner wall/outer wall"
 * ```
 */
export declare function evaluatePrintOrder(externalPerimetersFirst: boolean | undefined, infillFirst: boolean | undefined): string;
/**
 * Evaluates the ironing type based on ironing enabled flag and ironing type value.
 *
 * @param ironing - Whether ironing is enabled
 * @param ironingType - The ironing type string (e.g., "top surface", "all surfaces")
 * @returns The ironing type string, or "no ironing" if ironing is disabled
 *
 * @example
 * ```ts
 * evaluateIroningType(true, "top surface")  // "top surface"
 * evaluateIroningType(true, undefined)       // "no ironing"
 * evaluateIroningType(false, "top surface")  // "no ironing"
 * ```
 */
export declare function evaluateIroningType(ironing: boolean | undefined, ironingType: string | undefined): string;
/**
 * Gets the operating system type based on Node.js platform.
 *
 * @returns The OS type: 'MSWin32' for Windows, 'darwin' for macOS, or 'linux' for Linux
 *
 * @example
 * ```ts
 * getOS() // "darwin" on macOS, "MSWin32" on Windows, "linux" on Linux
 * ```
 */
export declare function getOS(): 'linux' | 'MSWin32' | 'darwin';
/**
 * Gets the user's home directory path.
 *
 * @returns The home directory path from environment variables (HOME or USERPROFILE), or empty string if not found
 *
 * @example
 * ```ts
 * getHomeDir() // "/Users/username" on macOS, "C:\Users\username" on Windows
 * ```
 */
export declare function getHomeDir(): string;
/**
 * Type guard to check if an IniType is a valid output type (print, filament, or printer).
 *
 * @param iniType - The ini type to check
 * @returns `true` if the type is 'print', 'filament', or 'printer'; `false` otherwise
 *
 * @remarks
 * This is used to narrow the type for accessing systemDirectories.output which only
 * has keys for these three types, excluding 'physical_printer' and 'unsupported'.
 *
 * @example
 * ```ts
 * if (isOutputIniType(status.iniType)) {
 *   // TypeScript now knows status.iniType is OutputIniType
 *   const dirs = systemDirectories.output[status.iniType];
 * }
 * ```
 */
export declare function isOutputIniType(iniType: IniType): iniType is OutputIniType;
/**
 * Type guard to check if an IniType is valid and not 'unsupported'.
 *
 * @param iniType - The ini type to check (may be undefined)
 * @returns `true` if the type is defined and not 'unsupported'; `false` otherwise
 *
 * @remarks
 * This excludes 'unsupported' from the type, allowing safe access to parameter maps
 * and other type-specific operations.
 *
 * @example
 * ```ts
 * if (isValidIniType(status.iniType)) {
 *   // TypeScript now knows status.iniType is not 'unsupported'
 *   const typeMap = parameterMap[status.iniType];
 * }
 * ```
 */
export declare function isValidIniType(iniType: IniType | undefined): iniType is Exclude<IniType, 'unsupported'>;
//# sourceMappingURL=utils.d.ts.map