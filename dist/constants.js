"use strict";
/**
 * Constants, mappings, and configuration data for the converter.
 *
 * This module contains:
 * - System directory structures
 * - Parameter mappings and type conversions
 * - Filament type mappings
 * - Infill pattern mappings
 * - Support style mappings
 * - G-code flavor mappings
 * - And other conversion constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.multivalueParams = exports.thumbnailFormat = exports.zhopEnforcement = exports.hostTypes = exports.gcodeFlavors = exports.interfacePatterns = exports.supportPatterns = exports.supportStyles = exports.infillTypes = exports.seamPositions = exports.speedParams = exports.speedSequence = exports.defaultMVS = exports.filamentTypes = exports.onExistingOpts = exports.illegalChars = exports.systemDirectories = void 0;
/**
 * System directory structure for different operating systems.
 *
 * Defines where PrusaSlicer/SuperSlicer and OrcaSlicer store their configuration files.
 */
exports.systemDirectories = {
    os: {
        linux: ['.config'],
        MSWin32: ['AppData', 'Roaming'],
        darwin: ['Library', 'Application Support']
    },
    input: {
        Filament: 'filament',
        Print: 'print',
        Printer: 'printer'
    },
    output: {
        filament: ['user', 'default', 'filament'],
        print: ['user', 'default', 'process'],
        printer: ['user', 'default', 'machine']
    }
};
exports.illegalChars = {
    MSWin32: /[<>:"\/\\|?*\x00-\x1F]/,
    darwin: /[:]/,
    linux: /\//
};
exports.onExistingOpts = {
    skip: 'LEAVE IT ALONE',
    merge: 'MERGE NEW PARAMETERS',
    overwrite: 'OVERWRITE'
};
exports.filamentTypes = {
    PET: 'PETG',
    FLEX: 'TPU',
    NYLON: 'PA'
};
exports.defaultMVS = {
    PLA: '15',
    PET: '10',
    ABS: '12',
    ASA: '12',
    FLEX: '3.2',
    NYLON: '12',
    PVA: '12',
    PC: '12',
    PSU: '8',
    HIPS: '8',
    EDGE: '8',
    NGEN: '8',
    PP: '8',
    PEI: '8',
    PEEK: '8',
    PEKK: '8',
    POM: '8',
    PVDF: '8',
    SCAFF: '8'
};
exports.speedSequence = [
    'perimeter_speed',
    'external_perimeter_speed',
    'solid_infill_speed',
    'infill_speed',
    'small_perimeter_speed',
    'top_solid_infill_speed',
    'gap_fill_speed',
    'support_material_speed',
    'support_material_interface_speed',
    'bridge_speed',
    'first_layer_speed',
    'first_layer_infill_speed'
];
exports.speedParams = {
    perimeter_speed: 'inner_wall_speed',
    external_perimeter_speed: 'outer_wall_speed',
    small_perimeter_speed: 'small_perimeter_speed',
    solid_infill_speed: 'internal_solid_infill_speed',
    infill_speed: 'sparse_infill_speed',
    top_solid_infill_speed: 'top_surface_speed',
    gap_fill_speed: 'gap_infill_speed',
    support_material_speed: 'support_speed',
    support_material_interface_speed: 'support_interface_speed',
    bridge_speed: 'bridge_speed',
    first_layer_speed: 'initial_layer_speed',
    first_layer_infill_speed: 'initial_layer_infill_speed'
};
exports.seamPositions = {
    cost: 'nearest',
    random: 'random',
    allrandom: 'random',
    aligned: 'aligned',
    contiguous: 'aligned',
    rear: 'back',
    nearest: 'nearest'
};
exports.infillTypes = {
    '3dhoneycomb': '3dhoneycomb',
    'adaptivecubic': 'adaptivecubic',
    'alignedrectilinear': 'alignedrectilinear',
    'archimedeanchords': 'archimedeanchords',
    'concentric': 'concentric',
    'concentricgapfill': 'concentric',
    'cubic': 'cubic',
    'grid': 'grid',
    'gyroid': 'gyroid',
    'hilbertcurve': 'hilbertcurve',
    'honeycomb': 'honeycomb',
    'lightning': 'lightning',
    'line': 'line',
    'monotonic': 'monotonic',
    'monotonicgapfill': 'monotonic',
    'monotoniclines': 'monotonicline',
    'octagramspiral': 'octagramspiral',
    'rectilinear': 'zig-zag',
    'rectilineargapfill': 'zig-zag',
    'rectiwithperimeter': 'zig-zag',
    'sawtooth': 'zig-zag',
    'scatteredrectilinear': 'zig-zag',
    'smooth': 'monotonic',
    'smoothhilbert': 'hilbertcurve',
    'smoothtriple': 'triangles',
    'stars': 'tri-hexagon',
    'supportcubic': 'supportcubic',
    'triangles': 'triangles'
};
exports.supportStyles = {
    grid: ['normal', 'grid'],
    snug: ['normal', 'snug'],
    tree: ['tree', 'default'],
    organic: ['tree', 'organic']
};
exports.supportPatterns = {
    rectilinear: true,
    'rectilinear-grid': true,
    honeycomb: true,
    lightning: true,
    default: true,
    hollow: true
};
exports.interfacePatterns = {
    auto: true,
    rectilinear: true,
    concentric: true,
    rectilinear_interlaced: true,
    grid: true
};
exports.gcodeFlavors = {
    klipper: 'klipper',
    mach3: 'reprapfirmware',
    machinekit: 'reprapfirmware',
    makerware: 'reprapfirmware',
    marlin: 'marlin',
    marlin2: 'marlin2',
    'no-extrusion': 'reprapfirmware',
    repetier: 'reprapfirmware',
    reprap: 'reprapfirmware',
    reprapfirmware: 'reprapfirmware',
    sailfish: 'reprapfirmware',
    smoothie: 'reprapfirmware',
    teacup: 'reprapfirmware',
    sprinter: 'reprapfirmware'
};
exports.hostTypes = {
    repetier: 'repetier',
    prusalink: 'prusalink',
    prusaconnect: 'prusaconnect',
    octoprint: 'octoprint',
    moonraker: 'octoprint',
    mks: 'mks',
    klipper: 'octoprint',
    flashair: 'flashair',
    duet: 'duet',
    astrobox: 'astrobox'
};
exports.zhopEnforcement = {
    'All surfaces': 'All Surfaces',
    'Not on top': 'Bottom Only',
    'Only on top': 'Top Only'
};
exports.thumbnailFormat = {
    PNG: 'PNG',
    JPG: 'JPG',
    QOI: 'QOI',
    BIQU: 'BTT_TFT'
};
exports.multivalueParams = {
    max_layer_height: 'single',
    min_layer_height: 'single',
    deretract_speed: 'single',
    default_filament_profile: 'single',
    machine_max_acceleration_e: 'array',
    machine_max_acceleration_extruding: 'array',
    machine_max_acceleration_retracting: 'array',
    machine_max_acceleration_travel: 'array',
    machine_max_acceleration_x: 'array',
    machine_max_acceleration_y: 'array',
    machine_max_acceleration_z: 'array',
    machine_max_feedrate_e: 'array',
    machine_max_feedrate_x: 'array',
    machine_max_feedrate_y: 'array',
    machine_max_feedrate_z: 'array',
    machine_max_jerk_e: 'array',
    machine_max_jerk_x: 'array',
    machine_max_jerk_y: 'array',
    machine_max_jerk_z: 'array',
    machine_min_extruding_rate: 'array',
    machine_min_travel_rate: 'array',
    nozzle_diameter: 'single',
    bed_shape: 'array',
    retract_before_wipe: 'single',
    retract_length_toolchange: 'single',
    retract_restart_extra_toolchange: 'single',
    retract_restart_extra: 'single',
    retract_layer_change: 'single',
    retract_length: 'single',
    retract_lift: 'single',
    retract_before_travel: 'single',
    retract_speed: 'single',
    thumbnails: 'array',
    extruder_offset: 'single',
    retract_lift_above: 'single',
    retract_lift_below: 'single',
    wipe: 'single'
};
//# sourceMappingURL=constants.js.map