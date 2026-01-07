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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const inquirer_1 = __importDefault(require("inquirer"));
const menu_1 = require("./menu");
const index = __importStar(require("./index"));
// Mock inquirer
vitest_1.vi.mock('inquirer');
vitest_1.vi.mock('./index', () => ({
    exitWithConversionSummary: vitest_1.vi.fn().mockResolvedValue(undefined)
}));
(0, vitest_1.describe)('menu', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)('displayMenu', () => {
        (0, vitest_1.it)('should return selected option for single-select menu', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ choice: 'Option 1' });
            const result = await (0, menu_1.displayMenu)('Choose an option:', true, ['Option 1', 'Option 2', 'Option 3']);
            (0, vitest_1.expect)(result).toBe('Option 1');
            (0, vitest_1.expect)(inquirer_1.default.prompt).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({
                    type: 'list',
                    message: 'Choose an option:',
                    choices: vitest_1.expect.arrayContaining(['Option 1', 'Option 2', 'Option 3', '\x1b[1;31m<QUIT>\x1b[0m'])
                })
            ]);
        });
        (0, vitest_1.it)('should return array of selected options for multi-select menu', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ choices: ['Option 1', 'Option 2'] });
            const result = await (0, menu_1.displayMenu)('Choose options:', false, ['Option 1', 'Option 2', 'Option 3']);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toEqual(['Option 1', 'Option 2']);
            (0, vitest_1.expect)(inquirer_1.default.prompt).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({
                    type: 'checkbox',
                    message: 'Choose options:',
                    choices: vitest_1.expect.arrayContaining(['<ALL>', 'Option 1', 'Option 2', 'Option 3', '\x1b[1;31m<QUIT>\x1b[0m'])
                })
            ]);
        });
        (0, vitest_1.it)('should return all options when <ALL> is selected', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ choices: ['<ALL>'] });
            const result = await (0, menu_1.displayMenu)('Choose options:', false, ['Option 1', 'Option 2', 'Option 3']);
            (0, vitest_1.expect)(result).toEqual(['Option 1', 'Option 2', 'Option 3']);
        });
        (0, vitest_1.it)('should exit when QUIT is selected in single-select', async () => {
            const exitSpy = vitest_1.vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ choice: '\x1b[1;31m<QUIT>\x1b[0m' });
            vitest_1.vi.mocked(index.exitWithConversionSummary).mockResolvedValue(undefined);
            await (0, vitest_1.expect)((0, menu_1.displayMenu)('Choose:', true, ['Option 1'])).rejects.toThrow('process.exit called');
            (0, vitest_1.expect)(index.exitWithConversionSummary).toHaveBeenCalled();
            exitSpy.mockRestore();
        });
        (0, vitest_1.it)('should exit when QUIT is selected in multi-select', async () => {
            const exitSpy = vitest_1.vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ choices: ['\x1b[1;31m<QUIT>\x1b[0m'] });
            vitest_1.vi.mocked(index.exitWithConversionSummary).mockResolvedValue(undefined);
            await (0, vitest_1.expect)((0, menu_1.displayMenu)('Choose:', false, ['Option 1'])).rejects.toThrow('process.exit called');
            (0, vitest_1.expect)(index.exitWithConversionSummary).toHaveBeenCalled();
            exitSpy.mockRestore();
        });
    });
    (0, vitest_1.describe)('askInput', () => {
        (0, vitest_1.it)('should return user input', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ value: 'test input' });
            const result = await (0, menu_1.askInput)('Enter value:');
            (0, vitest_1.expect)(result).toBe('test input');
            (0, vitest_1.expect)(inquirer_1.default.prompt).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({
                    type: 'input',
                    message: 'Enter value:'
                })
            ]);
        });
        (0, vitest_1.it)('should use default value when provided', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ value: 'default value' });
            const result = await (0, menu_1.askInput)('Enter value:', 'Description', 'default value');
            (0, vitest_1.expect)(inquirer_1.default.prompt).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({
                    type: 'input',
                    message: 'Enter value:',
                    default: 'default value'
                })
            ]);
        });
        (0, vitest_1.it)('should include description when provided', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ value: 'test' });
            await (0, menu_1.askInput)('Enter value:', 'This is a description');
            (0, vitest_1.expect)(inquirer_1.default.prompt).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({
                    type: 'input',
                    message: 'Enter value:',
                    description: 'This is a description'
                })
            ]);
        });
        (0, vitest_1.it)('should not include description when not provided', async () => {
            vitest_1.vi.mocked(inquirer_1.default.prompt).mockResolvedValue({ value: 'test' });
            await (0, menu_1.askInput)('Enter value:');
            const calls = vitest_1.vi.mocked(inquirer_1.default.prompt).mock.calls;
            (0, vitest_1.expect)(calls.length).toBeGreaterThan(0);
            const firstCall = calls[0];
            if (Array.isArray(firstCall) && firstCall.length > 0) {
                const question = firstCall[0];
                (0, vitest_1.expect)(question).not.toHaveProperty('description');
            }
        });
    });
});
//# sourceMappingURL=menu.test.js.map