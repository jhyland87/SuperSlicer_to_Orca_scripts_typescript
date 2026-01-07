"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_1 = require("./utils");
(0, vitest_1.describe)('utils', () => {
    (0, vitest_1.describe)('isDecimal', () => {
        (0, vitest_1.it)('should return true for valid decimal numbers', () => {
            (0, vitest_1.expect)((0, utils_1.isDecimal)('123.45')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('123')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('0')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('0.5')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('-123.45')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('+123.45')).toBe(true);
        });
        (0, vitest_1.it)('should return false for invalid values', () => {
            (0, vitest_1.expect)((0, utils_1.isDecimal)('abc')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('123abc')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('12.34.56')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isDecimal)(undefined)).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isDecimal)('50%')).toBe(false);
        });
    });
    (0, vitest_1.describe)('isPercent', () => {
        (0, vitest_1.it)('should return true for valid percentages', () => {
            (0, vitest_1.expect)((0, utils_1.isPercent)('50%')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isPercent)('123.45%')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isPercent)('0%')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isPercent)('-50%')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isPercent)('+50%')).toBe(true);
        });
        (0, vitest_1.it)('should return false for invalid values', () => {
            (0, vitest_1.expect)((0, utils_1.isPercent)('50')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isPercent)('abc%')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isPercent)('')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isPercent)(undefined)).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isPercent)('50%%')).toBe(false);
        });
    });
    (0, vitest_1.describe)('removePercent', () => {
        (0, vitest_1.it)('should remove percent symbol from valid percentage strings', () => {
            (0, vitest_1.expect)((0, utils_1.removePercent)('50%')).toBe('50');
            (0, vitest_1.expect)((0, utils_1.removePercent)('100%')).toBe('100');
            (0, vitest_1.expect)((0, utils_1.removePercent)('123.45%')).toBe('123.45');
        });
        (0, vitest_1.it)('should return empty string for undefined or empty values', () => {
            (0, vitest_1.expect)((0, utils_1.removePercent)(undefined)).toBe('');
            (0, vitest_1.expect)((0, utils_1.removePercent)('')).toBe('');
        });
        (0, vitest_1.it)('should return original string if no percent symbol', () => {
            (0, vitest_1.expect)((0, utils_1.removePercent)('50')).toBe('50');
        });
    });
    (0, vitest_1.describe)('multivalueToArray', () => {
        (0, vitest_1.it)('should split comma-separated values', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('a, b, c')).toEqual(['a', 'b', 'c']);
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('1,2,3')).toEqual(['1', '2', '3']);
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('x, y, z')).toEqual(['x', 'y', 'z']);
        });
        (0, vitest_1.it)('should split semicolon-separated values', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('a; b; c')).toEqual(['a', 'b', 'c']);
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('1;2;3')).toEqual(['1', '2', '3']);
        });
        (0, vitest_1.it)('should prefer comma over semicolon', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('a, b; c')).toEqual(['a', 'b; c']);
        });
        (0, vitest_1.it)('should trim whitespace from values', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('  a  ,  b  ,  c  ')).toEqual(['a', 'b', 'c']);
        });
        (0, vitest_1.it)('should return empty array for undefined or empty values', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)(undefined)).toEqual([]);
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('')).toEqual([]);
        });
        (0, vitest_1.it)('should handle single value', () => {
            (0, vitest_1.expect)((0, utils_1.multivalueToArray)('single')).toEqual(['single']);
        });
    });
    (0, vitest_1.describe)('unbackslash', () => {
        (0, vitest_1.it)('should unescape common escape sequences', () => {
            (0, vitest_1.expect)((0, utils_1.unbackslash)('Hello\\nWorld')).toBe('Hello\nWorld');
            // The function converts escape sequences: \\n -> \n, \\t -> \t, \\\\ -> \
            // Input 'Path\\to\\file' (2 backslashes) becomes 'Path\to\file'
            // where \t is converted to tab character by the function
            const result = (0, utils_1.unbackslash)('Path\\\\to\\\\file');
            // The function processes: \\t -> \t (tab), then \\ -> \
            // Result: 'Path' + '\' + '\t' (tab) + 'o' + '\' + 'file'
            (0, vitest_1.expect)(result).toContain('Path');
            (0, vitest_1.expect)(result).toContain('o');
            (0, vitest_1.expect)(result).toContain('file');
            // Verify tab character is present (char code 9)
            (0, vitest_1.expect)(result.includes('\t')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.unbackslash)('Tab\\tHere')).toBe('Tab\tHere');
            (0, vitest_1.expect)((0, utils_1.unbackslash)('Line\\rBreak')).toBe('Line\rBreak');
        });
        (0, vitest_1.it)('should unescape quotes', () => {
            (0, vitest_1.expect)((0, utils_1.unbackslash)('Say \\"hello\\"')).toBe('Say "hello"');
            (0, vitest_1.expect)((0, utils_1.unbackslash)("Say \\'hello\\'")).toBe("Say 'hello'");
        });
        (0, vitest_1.it)('should handle backslashes', () => {
            (0, vitest_1.expect)((0, utils_1.unbackslash)('\\\\')).toBe('\\');
            (0, vitest_1.expect)((0, utils_1.unbackslash)('\\\\\\\\')).toBe('\\\\');
        });
        (0, vitest_1.it)('should return original string if no escape sequences', () => {
            (0, vitest_1.expect)((0, utils_1.unbackslash)('normal string')).toBe('normal string');
        });
    });
    (0, vitest_1.describe)('percentToFloat', () => {
        (0, vitest_1.it)('should convert percentage to float', () => {
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('150%')).toBe('1.5');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('100%')).toBe('1');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('50%')).toBe('0.5');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('200%')).toBe('2');
        });
        (0, vitest_1.it)('should cap values at 2.0', () => {
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('250%')).toBe('2');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('300%')).toBe('2');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('500%')).toBe('2');
        });
        (0, vitest_1.it)('should return original value if not a percentage', () => {
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('50')).toBe('50');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)('abc')).toBe('abc');
            (0, vitest_1.expect)((0, utils_1.percentToFloat)(undefined)).toBe('');
        });
    });
    (0, vitest_1.describe)('percentToMm', () => {
        (0, vitest_1.it)('should convert percentage to millimeters', () => {
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, '50%')).toBe('5');
            (0, vitest_1.expect)((0, utils_1.percentToMm)(0.4, '200%')).toBe('0.8');
            (0, vitest_1.expect)((0, utils_1.percentToMm)(20, '25%')).toBe('5');
        });
        (0, vitest_1.it)('should handle numeric comparator', () => {
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, '50%')).toBe('5');
            const result = (0, utils_1.percentToMm)(0.4, '150%');
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(parseFloat(result)).toBeCloseTo(0.6, 10);
        });
        (0, vitest_1.it)('should return original value if not a percentage', () => {
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, '5')).toBe('5');
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, 'abc')).toBe('abc');
        });
        (0, vitest_1.it)('should return undefined for invalid inputs', () => {
            (0, vitest_1.expect)((0, utils_1.percentToMm)(undefined, '50%')).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, undefined)).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.percentToMm)('', '50%')).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.percentToMm)(10, '')).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.percentToMm)('50%', '50%')).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('mmToPercent', () => {
        (0, vitest_1.it)('should convert millimeters to percentage', () => {
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(10, '5')).toBe('50%');
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(0.4, '0.8')).toBe('200%');
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(20, '5')).toBe('25%');
        });
        (0, vitest_1.it)('should handle string inputs', () => {
            (0, vitest_1.expect)((0, utils_1.mmToPercent)('10', '5')).toBe('50%');
            (0, vitest_1.expect)((0, utils_1.mmToPercent)('0.4', '0.8')).toBe('200%');
        });
        (0, vitest_1.it)('should return original value if already a percentage', () => {
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(10, '50%')).toBe('50%');
        });
        (0, vitest_1.it)('should return undefined for invalid inputs', () => {
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(undefined, '5')).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(10, undefined)).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.mmToPercent)('50%', '5')).toBeUndefined();
            (0, vitest_1.expect)((0, utils_1.mmToPercent)(0, '5')).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('evaluatePrintOrder', () => {
        (0, vitest_1.it)('should return default order when both are false', () => {
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(false, false)).toBe('inner wall/outer wall/infill');
        });
        (0, vitest_1.it)('should return outer wall first when externalPerimetersFirst is true', () => {
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(true, false)).toBe('outer wall/inner wall/infill');
        });
        (0, vitest_1.it)('should return infill first when infillFirst is true', () => {
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(false, true)).toBe('infill/inner wall/outer wall');
        });
        (0, vitest_1.it)('should return infill/outer wall/inner wall when both are true', () => {
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(true, true)).toBe('infill/outer wall/inner wall');
        });
        (0, vitest_1.it)('should handle undefined values', () => {
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(undefined, undefined)).toBe('inner wall/outer wall/infill');
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(true, undefined)).toBe('outer wall/inner wall/infill');
            (0, vitest_1.expect)((0, utils_1.evaluatePrintOrder)(undefined, true)).toBe('infill/inner wall/outer wall');
        });
    });
    (0, vitest_1.describe)('evaluateIroningType', () => {
        (0, vitest_1.it)('should return ironing type when ironing is enabled', () => {
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(true, 'top surface')).toBe('top surface');
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(true, 'all surfaces')).toBe('all surfaces');
        });
        (0, vitest_1.it)('should return "no ironing" when ironing is disabled', () => {
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(false, 'top surface')).toBe('no ironing');
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(false, undefined)).toBe('no ironing');
        });
        (0, vitest_1.it)('should return "no ironing" when ironingType is undefined but ironing is enabled', () => {
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(true, undefined)).toBe('no ironing');
        });
        (0, vitest_1.it)('should handle undefined ironing flag', () => {
            (0, vitest_1.expect)((0, utils_1.evaluateIroningType)(undefined, 'top surface')).toBe('no ironing');
        });
    });
    (0, vitest_1.describe)('getOS', () => {
        (0, vitest_1.it)('should return correct OS type', () => {
            const os = (0, utils_1.getOS)();
            (0, vitest_1.expect)(['linux', 'MSWin32', 'darwin']).toContain(os);
        });
        (0, vitest_1.it)('should map win32 to MSWin32', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
            (0, vitest_1.expect)((0, utils_1.getOS)()).toBe('MSWin32');
            Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
        });
        (0, vitest_1.it)('should map darwin to darwin', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
            (0, vitest_1.expect)((0, utils_1.getOS)()).toBe('darwin');
            Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
        });
        (0, vitest_1.it)('should map linux to linux', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
            (0, vitest_1.expect)((0, utils_1.getOS)()).toBe('linux');
            Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
        });
    });
    (0, vitest_1.describe)('getHomeDir', () => {
        (0, vitest_1.beforeEach)(() => {
            vitest_1.vi.restoreAllMocks();
        });
        (0, vitest_1.it)('should return HOME environment variable on Unix systems', () => {
            const originalHome = process.env.HOME;
            process.env.HOME = '/home/testuser';
            delete process.env.USERPROFILE;
            (0, vitest_1.expect)((0, utils_1.getHomeDir)()).toBe('/home/testuser');
            if (originalHome !== undefined) {
                process.env.HOME = originalHome;
            }
        });
        (0, vitest_1.it)('should return USERPROFILE environment variable on Windows', () => {
            const originalUserProfile = process.env.USERPROFILE;
            delete process.env.HOME;
            process.env.USERPROFILE = 'C:\\Users\\testuser';
            (0, vitest_1.expect)((0, utils_1.getHomeDir)()).toBe('C:\\Users\\testuser');
            if (originalUserProfile !== undefined) {
                process.env.USERPROFILE = originalUserProfile;
            }
        });
        (0, vitest_1.it)('should prefer HOME over USERPROFILE', () => {
            const originalHome = process.env.HOME;
            const originalUserProfile = process.env.USERPROFILE;
            process.env.HOME = '/home/testuser';
            process.env.USERPROFILE = 'C:\\Users\\testuser';
            (0, vitest_1.expect)((0, utils_1.getHomeDir)()).toBe('/home/testuser');
            if (originalHome !== undefined) {
                process.env.HOME = originalHome;
            }
            if (originalUserProfile !== undefined) {
                process.env.USERPROFILE = originalUserProfile;
            }
        });
        (0, vitest_1.it)('should return empty string if neither is set', () => {
            const originalHome = process.env.HOME;
            const originalUserProfile = process.env.USERPROFILE;
            delete process.env.HOME;
            delete process.env.USERPROFILE;
            (0, vitest_1.expect)((0, utils_1.getHomeDir)()).toBe('');
            if (originalHome !== undefined) {
                process.env.HOME = originalHome;
            }
            if (originalUserProfile !== undefined) {
                process.env.USERPROFILE = originalUserProfile;
            }
        });
    });
    (0, vitest_1.describe)('isOutputIniType', () => {
        (0, vitest_1.it)('should return true for valid output types', () => {
            (0, vitest_1.expect)((0, utils_1.isOutputIniType)('print')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isOutputIniType)('filament')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isOutputIniType)('printer')).toBe(true);
        });
        (0, vitest_1.it)('should return false for invalid output types', () => {
            (0, vitest_1.expect)((0, utils_1.isOutputIniType)('physical_printer')).toBe(false);
            (0, vitest_1.expect)((0, utils_1.isOutputIniType)('unsupported')).toBe(false);
        });
        (0, vitest_1.it)('should act as a type guard', () => {
            const type = 'print';
            if ((0, utils_1.isOutputIniType)(type)) {
                // TypeScript should know type is OutputIniType here
                (0, vitest_1.expect)(type).toBe('print');
            }
        });
    });
    (0, vitest_1.describe)('isValidIniType', () => {
        (0, vitest_1.it)('should return true for valid ini types', () => {
            (0, vitest_1.expect)((0, utils_1.isValidIniType)('print')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isValidIniType)('filament')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isValidIniType)('printer')).toBe(true);
            (0, vitest_1.expect)((0, utils_1.isValidIniType)('physical_printer')).toBe(true);
        });
        (0, vitest_1.it)('should return false for unsupported type', () => {
            (0, vitest_1.expect)((0, utils_1.isValidIniType)('unsupported')).toBe(false);
        });
        (0, vitest_1.it)('should return false for undefined', () => {
            (0, vitest_1.expect)((0, utils_1.isValidIniType)(undefined)).toBe(false);
        });
        (0, vitest_1.it)('should act as a type guard', () => {
            const type = 'print';
            if ((0, utils_1.isValidIniType)(type)) {
                // TypeScript should know type is not 'unsupported' here
                (0, vitest_1.expect)(type).not.toBe('unsupported');
            }
        });
    });
});
//# sourceMappingURL=utils.test.js.map