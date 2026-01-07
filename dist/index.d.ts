#!/usr/bin/env node
/**
 * Main entry point for SuperSlicer/PrusaSlicer to OrcaSlicer profile converter.
 *
 * This module provides a command-line tool to convert INI profile files from PrusaSlicer
 * and SuperSlicer to JSON format for use with OrcaSlicer. Supports interactive and batch modes.
 */
/**
 * Displays a comprehensive conversion summary with statistics and file details.
 *
 * @remarks
 * Shows:
 * - Detailed conversion tables for each profile type
 * - Statistics (total processed, converted, merged, failed)
 * - Source slicer breakdown
 * - Directory information (where files are located)
 * - Profile type breakdown
 *
 * Exits the process after displaying the summary.
 */
export declare function exitWithConversionSummary(): Promise<void>;
//# sourceMappingURL=index.d.ts.map