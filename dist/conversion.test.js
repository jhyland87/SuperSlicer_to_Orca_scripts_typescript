"use strict";
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
const vitest_1 = require("vitest");
const conversion_1 = require("./conversion");
const menu = __importStar(require("./menu"));
// Mock the menu module
vitest_1.vi.mock('./menu', () => ({
    displayMenu: vitest_1.vi.fn()
}));
(0, vitest_1.describe)('conversion', () => {
    let status;
    let sourceIni;
    let newHash;
    (0, vitest_1.beforeEach)(() => {
        status = {
            forceOut: false,
            legacyOverwrite: false,
            maxTemp: 0,
            interactiveMode: false,
            outdirWasProvided: false,
            slicerFlavor: 'PrusaSlicer',
            iniType: 'print',
            profileName: 'test',
            ironingType: undefined,
            iterationsLeft: undefined,
            dirs: {
                output: undefined,
                data: '/tmp',
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
                nozzleSize: 0.4,
                inherits: undefined,
                compatiblePrintersCondition: undefined,
                compatiblePrintsCondition: undefined
            }
        };
        sourceIni = {};
        newHash = {};
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('convertParams', () => {
        (0, vitest_1.it)('should return undefined for missing parameter', async () => {
            const result = await (0, conversion_1.convertParams)('nonexistent', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
        });
        (0, vitest_1.it)('should return undefined for nil value', async () => {
            sourceIni['test_param'] = 'nil';
            const result = await (0, conversion_1.convertParams)('test_param', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
        });
        (0, vitest_1.it)('should handle array mapping for multiple keys', async () => {
            sourceIni['bed_temperature'] = '60';
            status.iniType = 'filament';
            const result = await (0, conversion_1.convertParams)('bed_temperature', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
            // Should have set multiple keys
            (0, vitest_1.expect)(newHash['hot_plate_temp']).toBe('60');
        });
        (0, vitest_1.it)('should track external_perimeters_first', async () => {
            sourceIni['external_perimeters_first'] = '1';
            const result = await (0, conversion_1.convertParams)('external_perimeters_first', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.externalPerimetersFirst).toBe(true);
        });
        (0, vitest_1.it)('should track infill_first', async () => {
            sourceIni['infill_first'] = '1';
            const result = await (0, conversion_1.convertParams)('infill_first', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.infillFirst).toBe(true);
        });
        (0, vitest_1.it)('should track ironing', async () => {
            sourceIni['ironing'] = '1';
            const result = await (0, conversion_1.convertParams)('ironing', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.ironing).toBe(true);
        });
        (0, vitest_1.it)('should convert filament_type', async () => {
            sourceIni['filament_type'] = 'PET';
            status.iniType = 'filament';
            const result = await (0, conversion_1.convertParams)('filament_type', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('PETG');
        });
        (0, vitest_1.it)('should handle filament_max_volumetric_speed with zero value', async () => {
            sourceIni['filament_max_volumetric_speed'] = '0';
            sourceIni['filament_type'] = 'PLA';
            status.iniType = 'filament';
            const result = await (0, conversion_1.convertParams)('filament_max_volumetric_speed', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('15');
        });
        (0, vitest_1.it)('should convert draft_shield', async () => {
            sourceIni['draft_shield'] = 'enabled';
            const result = await (0, conversion_1.convertParams)('draft_shield', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('1');
        });
        (0, vitest_1.it)('should convert external_perimeter_fan_speed', async () => {
            sourceIni['external_perimeter_fan_speed'] = '-1';
            status.iniType = 'filament';
            const result = await (0, conversion_1.convertParams)('external_perimeter_fan_speed', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('0%');
        });
        (0, vitest_1.it)('should convert ironing_type', async () => {
            sourceIni['ironing_type'] = 'top surface';
            const result = await (0, conversion_1.convertParams)('ironing_type', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('top surface');
            (0, vitest_1.expect)(status.ironingType).toBe('top surface');
        });
        (0, vitest_1.it)('should convert percent values to float', async () => {
            sourceIni['bridge_flow_ratio'] = '150%';
            const result = await (0, conversion_1.convertParams)('bridge_flow_ratio', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('1.5');
        });
        (0, vitest_1.it)('should convert machine_limits_usage', async () => {
            sourceIni['machine_limits_usage'] = 'emit_to_gcode';
            const result = await (0, conversion_1.convertParams)('machine_limits_usage', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('1');
        });
        (0, vitest_1.it)('should convert remaining_times', async () => {
            sourceIni['remaining_times'] = '0';
            const result = await (0, conversion_1.convertParams)('remaining_times', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('1');
        });
        (0, vitest_1.it)('should convert fill_pattern', async () => {
            sourceIni['fill_pattern'] = 'rectilinear';
            const result = await (0, conversion_1.convertParams)('fill_pattern', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('zig-zag');
        });
        (0, vitest_1.it)('should convert gcode_flavor', async () => {
            sourceIni['gcode_flavor'] = 'marlin';
            status.iniType = 'printer';
            const result = await (0, conversion_1.convertParams)('gcode_flavor', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('marlin');
        });
        (0, vitest_1.it)('should convert output_filename_format brackets', async () => {
            sourceIni['output_filename_format'] = '[input_filename_base].gcode';
            const result = await (0, conversion_1.convertParams)('output_filename_format', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('{input_filename_base}.gcode');
        });
        (0, vitest_1.it)('should handle unbackslash for gcode parameters', async () => {
            sourceIni['start_gcode'] = 'G28\\nG1 X0 Y0';
            status.iniType = 'printer';
            const result = await (0, conversion_1.convertParams)('start_gcode', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('G28\nG1 X0 Y0');
        });
        (0, vitest_1.it)('should handle compatible_printers_condition with KEEP', async () => {
            sourceIni['compatible_printers_condition'] = 'printer_notes=~/.*PRINTER_VENDOR_PRUSA3D.*/';
            vitest_1.vi.mocked(menu.displayMenu).mockResolvedValue('KEEP');
            const result = await (0, conversion_1.convertParams)('compatible_printers_condition', 'test.ini', sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('printer_notes=~/.*PRINTER_VENDOR_PRUSA3D.*/');
            (0, vitest_1.expect)(status.value.compatiblePrintersCondition).toBe('KEEP');
        });
        (0, vitest_1.it)('should handle compatible_printers_condition with DISCARD', async () => {
            sourceIni['compatible_printers_condition'] = 'printer_notes=~/.*PRINTER_VENDOR_PRUSA3D.*/';
            vitest_1.vi.mocked(menu.displayMenu).mockResolvedValue('DISCARD');
            const result = await (0, conversion_1.convertParams)('compatible_printers_condition', 'test.ini', sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('');
            (0, vitest_1.expect)(status.value.compatiblePrintersCondition).toBe('DISCARD');
        });
        (0, vitest_1.it)('should skip compatible_printers_condition if already DISCARDed', async () => {
            sourceIni['compatible_printers_condition'] = 'test';
            status.value.compatiblePrintersCondition = 'DISCARD';
            const result = await (0, conversion_1.convertParams)('compatible_printers_condition', 'test.ini', sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBe('');
            (0, vitest_1.expect)(menu.displayMenu).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should return undefined for unsupported ini type', async () => {
            status.iniType = 'unsupported';
            sourceIni['layer_height'] = '0.2';
            const result = await (0, conversion_1.convertParams)('layer_height', undefined, sourceIni, status, newHash);
            (0, vitest_1.expect)(result).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('calculatePrintParams', () => {
        (0, vitest_1.beforeEach)(() => {
            status.iniType = 'print';
            status.slicerFlavor = 'PrusaSlicer';
        });
        (0, vitest_1.it)('should convert speed parameters', async () => {
            sourceIni['perimeter_speed'] = '60';
            sourceIni['external_perimeter_speed'] = '50%';
            sourceIni['infill_speed'] = '80';
            sourceIni['first_layer_speed'] = '30%';
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['inner_wall_speed']).toBe('60');
            (0, vitest_1.expect)(newHash['sparse_infill_speed']).toBe('80');
        });
        (0, vitest_1.it)('should format decimal speeds to one decimal place', async () => {
            sourceIni['perimeter_speed'] = '60.123';
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['inner_wall_speed']).toBe('60.1');
        });
        (0, vitest_1.it)('should handle enable_dynamic_overhang_speeds', async () => {
            sourceIni['enable_dynamic_overhang_speeds'] = '1';
            sourceIni['overhang_speed_0'] = '100';
            sourceIni['overhang_speed_1'] = '80';
            sourceIni['overhang_speed_2'] = '60';
            sourceIni['overhang_speed_3'] = '40';
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['enable_overhang_speed']).toBe('1');
            (0, vitest_1.expect)(newHash['overhang_1_4_speed']).toBe('40');
            (0, vitest_1.expect)(newHash['overhang_2_4_speed']).toBe('60');
            (0, vitest_1.expect)(newHash['overhang_3_4_speed']).toBe('80');
            (0, vitest_1.expect)(newHash['overhang_4_4_speed']).toBe('100');
        });
        (0, vitest_1.it)('should set wall_infill_order based on toVar settings', async () => {
            status.toVar.externalPerimetersFirst = true;
            status.toVar.infillFirst = false;
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['wall_infill_order']).toBe('outer wall/inner wall/infill');
        });
        (0, vitest_1.it)('should set ironing_type', async () => {
            status.toVar.ironing = true;
            status.ironingType = 'top surface';
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['ironing_type']).toBe('top surface');
        });
        (0, vitest_1.it)('should set ironing_type to no ironing when disabled', async () => {
            status.toVar.ironing = false;
            await (0, conversion_1.calculatePrintParams)(sourceIni, status, newHash);
            (0, vitest_1.expect)(newHash['ironing_type']).toBe('no ironing');
        });
    });
    (0, vitest_1.describe)('detectIniType', () => {
        (0, vitest_1.it)('should return ini_type if explicitly set', () => {
            sourceIni['ini_type'] = 'print';
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBe('print');
        });
        (0, vitest_1.it)('should detect print type from parameters', () => {
            sourceIni['layer_height'] = '0.2';
            sourceIni['extrusion_width'] = '0.4';
            sourceIni['perimeter_speed'] = '60';
            sourceIni['infill_speed'] = '80';
            sourceIni['top_solid_layers'] = '5';
            sourceIni['bottom_solid_layers'] = '5';
            sourceIni['fill_density'] = '20%';
            sourceIni['support_material'] = '1';
            sourceIni['seam_position'] = 'nearest';
            sourceIni['perimeters'] = '3';
            sourceIni['first_layer_height'] = '0.3';
            sourceIni['travel_speed'] = '120';
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBe('print');
        });
        (0, vitest_1.it)('should detect filament type from parameters', () => {
            sourceIni['filament_type'] = 'PLA';
            sourceIni['temperature'] = '210';
            sourceIni['bed_temperature'] = '60';
            sourceIni['filament_diameter'] = '1.75';
            sourceIni['filament_density'] = '1.24';
            sourceIni['filament_cost'] = '20';
            sourceIni['filament_retract_length'] = '0.8';
            sourceIni['filament_retract_speed'] = '40';
            sourceIni['max_fan_speed'] = '100';
            sourceIni['min_fan_speed'] = '0';
            sourceIni['fan_always_on'] = '1';
            sourceIni['start_filament_gcode'] = 'M104 S210';
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBe('filament');
        });
        (0, vitest_1.it)('should detect printer type from parameters', () => {
            sourceIni['nozzle_diameter'] = '0.4';
            sourceIni['gcode_flavor'] = 'marlin';
            sourceIni['bed_shape'] = 'rectangular';
            sourceIni['max_print_height'] = '250';
            sourceIni['retract_length'] = '0.8';
            sourceIni['retract_speed'] = '40';
            sourceIni['start_gcode'] = 'G28';
            sourceIni['end_gcode'] = 'M104 S0';
            sourceIni['layer_gcode'] = '';
            sourceIni['machine_max_acceleration_x'] = '1000';
            sourceIni['machine_max_acceleration_y'] = '1000';
            sourceIni['machine_max_feedrate_x'] = '200';
            sourceIni['machine_max_feedrate_y'] = '200';
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBe('printer');
        });
        (0, vitest_1.it)('should return undefined if no type can be determined', () => {
            sourceIni['random_param'] = 'value';
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBeUndefined();
        });
        (0, vitest_1.it)('should return undefined if all counts are less than 10', () => {
            sourceIni['layer_height'] = '0.2';
            sourceIni['temperature'] = '210';
            sourceIni['nozzle_diameter'] = '0.4';
            // Not enough parameters to determine type
            (0, vitest_1.expect)((0, conversion_1.detectIniType)(sourceIni)).toBeUndefined();
        });
    });
});
//# sourceMappingURL=conversion.test.js.map