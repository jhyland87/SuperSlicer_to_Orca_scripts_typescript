/**
 * Interactive menu and user input functions using inquirer.
 *
 * This module provides user interaction capabilities:
 * - Single and multi-select menus
 * - Text input prompts
 * - Integration with conversion summary on quit
 */
/**
 * Displays an interactive menu using inquirer and returns the user's selection(s).
 *
 * @param prompt - The message to display to the user
 * @param isSingleOption - If `true`, displays a single-select list; if `false`, displays a multi-select checkbox
 * @param options - Array of option strings to display
 * @returns For single-select: the selected string. For multi-select: array of selected strings, or all options if '<ALL>' was selected
 *
 * @remarks
 * - Adds a '<QUIT>' option that exits the program after showing conversion summary
 * - For multi-select, adds an '<ALL>' option that returns all options
 * - Exits the process if user selects '<QUIT>'
 *
 * @example
 * ```ts
 * // Single selection
 * const choice = await displayMenu("Choose a slicer:", true, ["PrusaSlicer", "SuperSlicer"]);
 * // choice is "PrusaSlicer" or "SuperSlicer"
 *
 * // Multiple selection
 * const choices = await displayMenu("Select profiles:", false, ["Profile1", "Profile2", "Profile3"]);
 * // choices is an array of selected profile names
 * ```
 */
export declare function displayMenu(prompt: string, isSingleOption: boolean, options: string[]): Promise<string | string[]>;
/**
 * Prompts the user for text input using inquirer.
 *
 * @param prompt - The message to display to the user
 * @param info - Optional additional information/description to display
 * @param defaultValue - Optional default value if user just presses Enter
 * @returns The user's input string
 *
 * @example
 * ```ts
 * const nozzleSize = await askInput(
 *   "Nozzle size: ",
 *   "Enter the nozzle diameter in mm (e.g., 0.4)",
 *   "0.4"
 * );
 * ```
 */
export declare function askInput(prompt: string, info?: string, defaultValue?: string): Promise<string>;
//# sourceMappingURL=menu.d.ts.map