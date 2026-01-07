/**
 * Parameter mapping from PrusaSlicer/SuperSlicer INI keys to OrcaSlicer JSON keys.
 *
 * This module defines the complete mapping of all supported parameters organized by profile type:
 * - Print profiles: ~170 parameters
 * - Filament profiles: ~60 parameters
 * - Printer profiles: ~50 parameters
 * - Physical printer: network configuration parameters
 *
 * Some parameters map to arrays (multiple OrcaSlicer keys get the same value).
 */
import { ParameterMap } from './types';
/**
 * Complete parameter mapping from source INI parameter names to OrcaSlicer JSON keys.
 *
 * Organized by profile type. Each entry maps a source parameter name to either:
 * - A single target key (string)
 * - Multiple target keys (string array) - for parameters that affect multiple settings
 *
 * @example
 * ```ts
 * parameterMap.print['layer_height'] // 'layer_height'
 * parameterMap.filament['bed_temperature'] // ['hot_plate_temp', 'cool_plate_temp', ...]
 * ```
 */
export declare const parameterMap: ParameterMap;
//# sourceMappingURL=parameterMap.d.ts.map