"use strict";
/**
 * Interactive menu and user input functions using inquirer.
 *
 * This module provides user interaction capabilities:
 * - Single and multi-select menus
 * - Text input prompts
 * - Integration with conversion summary on quit
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayMenu = displayMenu;
exports.askInput = askInput;
const inquirer_1 = __importDefault(require("inquirer"));
const index_1 = require("./index");
/** ANSI escape code for the quit option (red text). */
const QUIT = '\x1b[1;31m<QUIT>\x1b[0m';
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
async function displayMenu(prompt, isSingleOption, options) {
    if (isSingleOption) {
        const choices = [...options, QUIT];
        const answer = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'choice',
                message: prompt,
                choices: choices,
                pageSize: 20
            }
        ]);
        if (answer.choice === QUIT) {
            await (0, index_1.exitWithConversionSummary)();
            process.exit(0);
        }
        return answer.choice;
    }
    else {
        const choices = ['<ALL>', ...options, QUIT];
        const answer = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'choices',
                message: prompt,
                choices: choices,
                pageSize: 20
            }
        ]);
        if (answer.choices.includes(QUIT)) {
            await (0, index_1.exitWithConversionSummary)();
            process.exit(0);
        }
        if (answer.choices.includes('<ALL>')) {
            return options;
        }
        return answer.choices;
    }
}
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
async function askInput(prompt, info, defaultValue) {
    const answer = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'value',
            message: prompt,
            default: defaultValue,
            ...(info ? { description: info } : {})
        }
    ]);
    return answer.value;
}
//# sourceMappingURL=menu.js.map