/**
 * Type guard functions for runtime type checking and narrowing.
 *
 * This module provides type guard functions that help TypeScript narrow types
 * at runtime, enabling safe access to type-specific properties and methods.
 */

import type { IniType, OutputIniType } from './types';

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
export function isOutputIniType(iniType: IniType): iniType is OutputIniType {
  return iniType === 'print' || iniType === 'filament' || iniType === 'printer';
}

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
export function isValidIniType(iniType: IniType | undefined): iniType is Exclude<IniType, 'unsupported'> {
  return iniType !== undefined && iniType !== 'unsupported';
}

