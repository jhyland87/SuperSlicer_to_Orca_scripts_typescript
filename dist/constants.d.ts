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
import { SystemDirectories, MultivalueParams } from './types';
/**
 * System directory structure for different operating systems.
 *
 * Defines where PrusaSlicer/SuperSlicer and OrcaSlicer store their configuration files.
 */
export declare const systemDirectories: SystemDirectories;
export declare const illegalChars: {
    [key: string]: RegExp;
};
export declare const onExistingOpts: {
    [key: string]: string;
};
export declare const filamentTypes: {
    [key: string]: string;
};
export declare const defaultMVS: {
    [key: string]: string;
};
export declare const speedSequence: string[];
export declare const speedParams: {
    [key: string]: string;
};
export declare const seamPositions: {
    [key: string]: string;
};
export declare const infillTypes: {
    [key: string]: string;
};
export declare const supportStyles: {
    [key: string]: [string, string];
};
export declare const supportPatterns: {
    [key: string]: boolean;
};
export declare const interfacePatterns: {
    [key: string]: boolean;
};
export declare const gcodeFlavors: {
    [key: string]: string;
};
export declare const hostTypes: {
    [key: string]: string;
};
export declare const zhopEnforcement: {
    [key: string]: string;
};
export declare const thumbnailFormat: {
    [key: string]: string;
};
export declare const multivalueParams: MultivalueParams;
//# sourceMappingURL=constants.d.ts.map