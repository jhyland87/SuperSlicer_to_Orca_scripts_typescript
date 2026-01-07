/**
 * Core conversion logic for transforming INI parameters to OrcaSlicer JSON format.
 *
 * This module handles:
 * - Parameter conversion with special case handling
 * - Print parameter calculations (speeds, print order, etc.)
 * - INI type detection
 * - Complex parameter transformations (percentages, types, etc.)
 */

import {
  Status,
  SourceIni,
  NewHash,
  IniType,
  SlicerFlavor,
  ParameterMap
} from './types';
import {
  isDecimal,
  isPercent,
  removePercent,
  multivalueToArray,
  unbackslash,
  percentToFloat,
  percentToMm,
  mmToPercent,
  evaluatePrintOrder,
  evaluateIroningType
} from './utils';
import { isValidIniType } from './type-guards';
import {
  multivalueParams,
  filamentTypes,
  defaultMVS,
  speedSequence,
  speedParams,
  seamPositions,
  infillTypes,
  supportStyles,
  supportPatterns,
  interfacePatterns,
  gcodeFlavors,
  hostTypes,
  zhopEnforcement,
  thumbnailFormat
} from './constants';
import { parameterMap } from './parameterMap';
import { displayMenu } from './menu';

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
export async function convertParams(
  parameter: string,
  file: string | undefined,
  sourceIni: SourceIni,
  status: Status,
  newHash: NewHash
): Promise<string | string[] | undefined> {
  let newValue = sourceIni[parameter];

  if (!newValue) return undefined;
  if (newValue === 'nil') return undefined;

  // Handle multivalue parameters
  if (multivalueParams[parameter]) {
    const array = multivalueToArray(newValue);
    if (multivalueParams[parameter] === 'single') {
      newValue = array[0] || '';
    } else {
      return array;
    }
  }

  const defaultSpeed = status.slicerFlavor === 'SuperSlicer' ? sourceIni['default_speed'] : undefined;

  if (!status.iniType || status.iniType === 'unsupported' || status.iniType === 'physical_printer') {
    return undefined;
  }

  // Check if parameter maps to multiple keys
  const typeMap = parameterMap[status.iniType];
  if (!typeMap) {
    return undefined;
  }

  const mapValue = typeMap[parameter];
  if (Array.isArray(mapValue)) {
    // Set same value for each key
    for (const key of mapValue) {
      newHash[key] = newValue;
    }
    return undefined; // Signal that we handled it
  }

  // Track state of combination settings
  if (parameter === 'external_perimeters_first') {
    status.toVar.externalPerimetersFirst = newValue ? true : false;
    return undefined;
  }
  if (parameter === 'infill_first') {
    status.toVar.infillFirst = newValue ? true : false;
    return undefined;
  }
  if (parameter === 'ironing') {
    status.toVar.ironing = newValue ? true : false;
    return undefined;
  }

  const unbackslashGcode = (): string => {
    if (!newValue) return '';
    let val = newValue.replace(/^"(.*)"$/, '$1');
    return unbackslash(val);
  };

  const handleCompatibleCondition = async (): Promise<string> => {
    if (parameter === 'compatible_printers_condition') {
      if (status.value.compatiblePrintersCondition === 'DISCARD') {
        return '';
      }
      if (newValue === '' || status.value.compatiblePrintersCondition === 'KEEP') {
        return newValue;
      }
      const parts = parameter.split('_');
      const affectedProfile = parts[1]?.slice(0, -1) || 'profile';
      const choice = await displayMenu(
        `The \x1b[1m${file || 'profile'}\x1b[0m ${status.iniType} profile has the following \x1b[1m${parameter}\x1b[0m value:\n\n\t\x1b[40m\x1b[0;93m${newValue}\x1b[0m\n\nIf you keep this value, this ${status.iniType} profile will not be visible in OrcaSlicer unless you have selected a ${affectedProfile} that satisfies all the conditions specified above. If you discard this value, this ${status.iniType} profile will be visible regardless of which ${affectedProfile} you have selected.\n\nDo you want to KEEP this value or DISCARD it?\n\n`,
        true,
        ['KEEP', 'DISCARD']
      );
      if (typeof choice === 'string') {
        status.value.compatiblePrintersCondition = choice;
        return choice === 'KEEP' ? newValue : '';
      }
      return '';
    } else if (parameter === 'compatible_prints_condition') {
      if (status.value.compatiblePrintsCondition === 'DISCARD') {
        return '';
      }
      if (newValue === '' || status.value.compatiblePrintsCondition === 'KEEP') {
        return newValue;
      }
      const parts = parameter.split('_');
      const affectedProfile = parts[1]?.slice(0, -1) || 'profile';
      const choice = await displayMenu(
        `The \x1b[1m${file || 'profile'}\x1b[0m ${status.iniType} profile has the following \x1b[1m${parameter}\x1b[0m value:\n\n\t\x1b[40m\x1b[0;93m${newValue}\x1b[0m\n\nIf you keep this value, this ${status.iniType} profile will not be visible in OrcaSlicer unless you have selected a ${affectedProfile} that satisfies all the conditions specified above. If you discard this value, this ${status.iniType} profile will be visible regardless of which ${affectedProfile} you have selected.\n\nDo you want to KEEP this value or DISCARD it?\n\n`,
        true,
        ['KEEP', 'DISCARD']
      );
      if (typeof choice === 'string') {
        status.value.compatiblePrintsCondition = choice;
        return choice === 'KEEP' ? newValue : '';
      }
      return '';
    }
    return newValue;
  };

  // Note: This function needs to be synchronous for most cases
  // We'll handle async cases separately

  // Special cases
  const specialCases: { [key: string]: () => string | Promise<string> } = {
    start_filament_gcode: unbackslashGcode,
    end_filament_gcode: unbackslashGcode,
    post_process: unbackslashGcode,
    before_layer_gcode: unbackslashGcode,
    toolchange_gcode: unbackslashGcode,
    layer_gcode: unbackslashGcode,
    feature_gcode: unbackslashGcode,
    end_gcode: unbackslashGcode,
    pause_print_gcode: unbackslashGcode,
    start_gcode: unbackslashGcode,
    template_custom_gcode: unbackslashGcode,
    notes: unbackslashGcode,
    filament_notes: unbackslashGcode,
    printer_notes: unbackslashGcode,

    filament_type: () => filamentTypes[newValue] || newValue,

    filament_max_volumetric_speed: () => {
      const val = parseFloat(newValue);
      return val > 0 ? String(val) : (defaultMVS[sourceIni['filament_type'] || ''] || '15');
    },

    draft_shield: () => {
      if (newValue === 'disabled') return '0';
      if (newValue === 'enabled') return '1';
      return newValue;
    },

    external_perimeter_fan_speed: () => {
      const val = parseFloat(newValue);
      return val < 0 ? '0%' : `${val}%`;
    },

    ironing_type: () => {
      status.ironingType = newValue;
      return newValue;
    },

    default_filament_profile: () => {
      const arr = multivalueToArray(newValue);
      return unbackslash(arr[0] || '');
    },

    retract_lift_top: () => {
      const arr = multivalueToArray(newValue);
      return zhopEnforcement[arr[0] || ''] || arr[0] || '';
    },

    compatible_printers_condition: () => handleCompatibleCondition(),
    compatible_prints_condition: () => handleCompatibleCondition(),

    max_layer_height: () => percentToMm(String(status.value.nozzleSize || ''), newValue) || '',
    min_layer_height: () => percentToMm(String(status.value.nozzleSize || ''), newValue) || '',
    fuzzy_skin_point_dist: () => percentToMm(String(status.value.nozzleSize || ''), newValue) || '',
    fuzzy_skin_thickness: () => percentToMm(String(status.value.nozzleSize || ''), newValue) || '',
    small_perimeter_min_length: () => percentToMm(String(status.value.nozzleSize || ''), newValue) || '',

    bridge_flow_ratio: () => percentToFloat(newValue),
    fill_top_flow_ratio: () => percentToFloat(newValue),
    first_layer_flow_ratio: () => percentToFloat(newValue),

    wall_transition_length: () => mmToPercent(String(status.value.nozzleSize || ''), newValue) || '',

    machine_limits_usage: () => newValue === 'emit_to_gcode' ? '1' : '0',

    remaining_times: () => newValue === '0' ? '1' : '0',

    support_material_bottom_contact_distance: () => {
      return newValue === '0' ? (sourceIni['support_material_contact_distance'] || '') : newValue;
    },

    support_material_style: () => {
      const style = supportStyles[newValue];
      if (style) {
        const [supportType, supportStyle] = style;
        const genstyle = sourceIni['support_material_auto'] ? 'auto' : 'manual';
        newHash['support_type'] = `${supportType}(${genstyle})`;
        newHash['support_style'] = supportStyle;
      }
      return '';
    },

    fill_pattern: () => infillTypes[newValue] || newValue,
    top_fill_pattern: () => infillTypes[newValue] || newValue,
    bottom_fill_pattern: () => infillTypes[newValue] || newValue,
    solid_fill_pattern: () => infillTypes[newValue] || newValue,

    gcode_flavor: () => gcodeFlavors[newValue] || '',

    host_type: () => hostTypes[newValue] || newValue,

    thumbnails_format: () => thumbnailFormat[newValue] || newValue,

    support_material_pattern: () => supportPatterns[newValue] ? newValue : 'default',

    support_material_interface_pattern: () => interfacePatterns[newValue] ? newValue : 'auto',

    seam_position: () => seamPositions[newValue] || newValue,

    support_material_layer_height: () => parseFloat(newValue) > 0 ? '1' : '0',

    output_filename_format: () => newValue.replace(/\[/g, '{').replace(/\]/g, '}'),

    support_material_xy_spacing: () => {
      let calculated = percentToMm(sourceIni['external_perimeter_extrusion_width'], newValue);
      if (!calculated) {
        calculated = percentToMm(String(status.value.nozzleSize || ''), newValue);
      }
      return calculated || '';
    },

    extrusion_width: () => newValue === '' ? '0' : newValue,

    infill_every_layers: () => parseFloat(newValue) > 0 ? '1' : '0',

    complete_objects: () => newValue ? 'by object' : 'by layer',

    external_perimeter_speed: () => percentToMm(sourceIni['perimeter_speed'], newValue) || newValue,

    first_layer_speed: () => percentToMm(sourceIni['perimeter_speed'], newValue) || newValue,

    top_solid_infill_speed: () => {
      const base = newHash['internal_solid_infill_speed'];
      return percentToMm(typeof base === 'string' ? base : '', newValue) || newValue;
    },

    support_material_interface_speed: () => percentToMm(sourceIni['support_material_speed'], newValue) || newValue,

    first_layer_infill_speed: () => {
      const base = status.slicerFlavor === 'PrusaSlicer'
        ? sourceIni['first_layer_speed']
        : newValue;
      return percentToMm(sourceIni['infill_speed'], base) || newValue;
    },

    solid_infill_speed: () => {
      const base = status.slicerFlavor === 'PrusaSlicer'
        ? sourceIni['infill_speed']
        : defaultSpeed;
      return percentToMm(base, newValue) || newValue;
    },

    perimeter_speed: () => {
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(defaultSpeed, newValue) || newValue)
        : newValue;
    },

    support_material_speed: () => {
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(defaultSpeed, newValue) || newValue)
        : newValue;
    },

    bridge_speed: () => {
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(defaultSpeed, newValue) || newValue)
        : newValue;
    },

    infill_speed: () => {
      const base = newHash['internal_solid_infill_speed'];
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(typeof base === 'string' ? base : '', newValue) || newValue)
        : newValue;
    },

    small_perimeter_speed: () => {
      const base = newHash['sparse_infill_speed'];
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(typeof base === 'string' ? base : '', newValue) || newValue)
        : newValue;
    },

    gap_fill_speed: () => {
      const base = newHash['sparse_infill_speed'];
      return status.slicerFlavor === 'SuperSlicer'
        ? (percentToMm(typeof base === 'string' ? base : '', newValue) || newValue)
        : newValue;
    }
  };

  if (specialCases[parameter]) {
    const result = await specialCases[parameter]();
    return result;
  }

  return newValue;
}

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
export async function calculatePrintParams(
  sourceIni: SourceIni,
  status: Status,
  newHash: NewHash
): Promise<NewHash> {
  // Translate and convert speed settings
  for (const parameter of speedSequence) {
    if (!sourceIni[parameter]) continue;

    const newValue = await convertParams(parameter, undefined, sourceIni, status, newHash);
    if (!newValue || typeof newValue !== 'string') continue;

    // Limit mm/s values to one decimal place
    if (isDecimal(newValue)) {
      let formatted = parseFloat(newValue).toFixed(1);
      formatted = formatted.replace(/\.?0+$/, '');
      newHash[speedParams[parameter]] = formatted;
    } else {
      newHash[speedParams[parameter]] = newValue;
    }
  }

  // Translate Dynamic Overhangs thresholds
  const enableDynamicOverhangSpeeds = !!sourceIni['enable_dynamic_overhang_speeds'];
  newHash['enable_overhang_speed'] = enableDynamicOverhangSpeeds ? '1' : '0';

  if (enableDynamicOverhangSpeeds) {
    let speeds: string[] = [];
    if (status.slicerFlavor === 'SuperSlicer') {
      speeds = (sourceIni['dynamic_overhang_speeds'] || '').split(',');
    } else {
      speeds = [
        sourceIni['overhang_speed_0'] || '',
        sourceIni['overhang_speed_1'] || '',
        sourceIni['overhang_speed_2'] || '',
        sourceIni['overhang_speed_3'] || ''
      ];
    }
    const overhangSpeedKeys = [
      'overhang_1_4_speed',
      'overhang_2_4_speed',
      'overhang_3_4_speed',
      'overhang_4_4_speed'
    ];
    overhangSpeedKeys.forEach((key, idx) => {
      newHash[key] = speeds[3 - idx] || '';
    });
  }

  // Set wall infill order
  newHash['wall_infill_order'] = evaluatePrintOrder(
    status.toVar.externalPerimetersFirst,
    status.toVar.infillFirst
  );

  // Set ironing type
  newHash['ironing_type'] = evaluateIroningType(
    status.toVar.ironing,
    status.ironingType
  );

  return newHash;
}

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
export function detectIniType(sourceIni: SourceIni): IniType | undefined {
  if (sourceIni['ini_type']) {
    return sourceIni['ini_type'] as IniType;
  }

  const typeCounts: { [key: string]: number } = {};
  for (const type of Object.keys(parameterMap)) {
    typeCounts[type] = 0;
    const typeMap = parameterMap[type as IniType];
    if (typeMap) {
      for (const param of Object.keys(sourceIni)) {
        if (param in typeMap) {
          typeCounts[type]++;
        }
      }
    }
  }

  // Check if all counts are less than 10
  const hasValidType = Object.values(typeCounts).some(count => count >= 10);
  if (!hasValidType) return undefined;

  // Return type with highest count
  return Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as IniType;
}

