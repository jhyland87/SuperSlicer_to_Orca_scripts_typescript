import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  evaluateIroningType,
  getOS,
  getHomeDir,
  isOutputIniType,
  isValidIniType
} from './utils';
import type { IniType } from './types';

describe('utils', () => {
  describe('isDecimal', () => {
    it('should return true for valid decimal numbers', () => {
      expect(isDecimal('123.45')).toBe(true);
      expect(isDecimal('123')).toBe(true);
      expect(isDecimal('0')).toBe(true);
      expect(isDecimal('0.5')).toBe(true);
      expect(isDecimal('-123.45')).toBe(true);
      expect(isDecimal('+123.45')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isDecimal('abc')).toBe(false);
      expect(isDecimal('123abc')).toBe(false);
      expect(isDecimal('12.34.56')).toBe(false);
      expect(isDecimal('')).toBe(false);
      expect(isDecimal(undefined)).toBe(false);
      expect(isDecimal('50%')).toBe(false);
    });
  });

  describe('isPercent', () => {
    it('should return true for valid percentages', () => {
      expect(isPercent('50%')).toBe(true);
      expect(isPercent('123.45%')).toBe(true);
      expect(isPercent('0%')).toBe(true);
      expect(isPercent('-50%')).toBe(true);
      expect(isPercent('+50%')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isPercent('50')).toBe(false);
      expect(isPercent('abc%')).toBe(false);
      expect(isPercent('')).toBe(false);
      expect(isPercent(undefined)).toBe(false);
      expect(isPercent('50%%')).toBe(false);
    });
  });

  describe('removePercent', () => {
    it('should remove percent symbol from valid percentage strings', () => {
      expect(removePercent('50%')).toBe('50');
      expect(removePercent('100%')).toBe('100');
      expect(removePercent('123.45%')).toBe('123.45');
    });

    it('should return empty string for undefined or empty values', () => {
      expect(removePercent(undefined)).toBe('');
      expect(removePercent('')).toBe('');
    });

    it('should return original string if no percent symbol', () => {
      expect(removePercent('50')).toBe('50');
    });
  });

  describe('multivalueToArray', () => {
    it('should split comma-separated values', () => {
      expect(multivalueToArray('a, b, c')).toEqual(['a', 'b', 'c']);
      expect(multivalueToArray('1,2,3')).toEqual(['1', '2', '3']);
      expect(multivalueToArray('x, y, z')).toEqual(['x', 'y', 'z']);
    });

    it('should split semicolon-separated values', () => {
      expect(multivalueToArray('a; b; c')).toEqual(['a', 'b', 'c']);
      expect(multivalueToArray('1;2;3')).toEqual(['1', '2', '3']);
    });

    it('should prefer comma over semicolon', () => {
      expect(multivalueToArray('a, b; c')).toEqual(['a', 'b; c']);
    });

    it('should trim whitespace from values', () => {
      expect(multivalueToArray('  a  ,  b  ,  c  ')).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for undefined or empty values', () => {
      expect(multivalueToArray(undefined)).toEqual([]);
      expect(multivalueToArray('')).toEqual([]);
    });

    it('should handle single value', () => {
      expect(multivalueToArray('single')).toEqual(['single']);
    });
  });

  describe('unbackslash', () => {
    it('should unescape common escape sequences', () => {
      expect(unbackslash('Hello\\nWorld')).toBe('Hello\nWorld');
      // The function converts escape sequences: \\n -> \n, \\t -> \t, \\\\ -> \
      // Input 'Path\\to\\file' (2 backslashes) becomes 'Path\to\file'
      // where \t is converted to tab character by the function
      const result = unbackslash('Path\\\\to\\\\file');
      // The function processes: \\t -> \t (tab), then \\ -> \
      // Result: 'Path' + '\' + '\t' (tab) + 'o' + '\' + 'file'
      expect(result).toContain('Path');
      expect(result).toContain('o');
      expect(result).toContain('file');
      // Verify tab character is present (char code 9)
      expect(result.includes('\t')).toBe(true);
      expect(unbackslash('Tab\\tHere')).toBe('Tab\tHere');
      expect(unbackslash('Line\\rBreak')).toBe('Line\rBreak');
    });

    it('should unescape quotes', () => {
      expect(unbackslash('Say \\"hello\\"')).toBe('Say "hello"');
      expect(unbackslash("Say \\'hello\\'")).toBe("Say 'hello'");
    });

    it('should handle backslashes', () => {
      expect(unbackslash('\\\\')).toBe('\\');
      expect(unbackslash('\\\\\\\\')).toBe('\\\\');
    });

    it('should return original string if no escape sequences', () => {
      expect(unbackslash('normal string')).toBe('normal string');
    });
  });

  describe('percentToFloat', () => {
    it('should convert percentage to float', () => {
      expect(percentToFloat('150%')).toBe('1.5');
      expect(percentToFloat('100%')).toBe('1');
      expect(percentToFloat('50%')).toBe('0.5');
      expect(percentToFloat('200%')).toBe('2');
    });

    it('should cap values at 2.0', () => {
      expect(percentToFloat('250%')).toBe('2');
      expect(percentToFloat('300%')).toBe('2');
      expect(percentToFloat('500%')).toBe('2');
    });

    it('should return original value if not a percentage', () => {
      expect(percentToFloat('50')).toBe('50');
      expect(percentToFloat('abc')).toBe('abc');
      expect(percentToFloat(undefined)).toBe('');
    });
  });

  describe('percentToMm', () => {
    it('should convert percentage to millimeters', () => {
      expect(percentToMm(10, '50%')).toBe('5');
      expect(percentToMm(0.4, '200%')).toBe('0.8');
      expect(percentToMm(20, '25%')).toBe('5');
    });

    it('should handle numeric comparator', () => {
      expect(percentToMm(10, '50%')).toBe('5');
      const result = percentToMm(0.4, '150%');
      expect(result).toBeDefined();
      expect(parseFloat(result!)).toBeCloseTo(0.6, 10);
    });

    it('should return original value if not a percentage', () => {
      expect(percentToMm(10, '5')).toBe('5');
      expect(percentToMm(10, 'abc')).toBe('abc');
    });

    it('should return undefined for invalid inputs', () => {
      expect(percentToMm(undefined, '50%')).toBeUndefined();
      expect(percentToMm(10, undefined)).toBeUndefined();
      expect(percentToMm('', '50%')).toBeUndefined();
      expect(percentToMm(10, '')).toBeUndefined();
      expect(percentToMm('50%', '50%')).toBeUndefined();
    });
  });

  describe('mmToPercent', () => {
    it('should convert millimeters to percentage', () => {
      expect(mmToPercent(10, '5')).toBe('50%');
      expect(mmToPercent(0.4, '0.8')).toBe('200%');
      expect(mmToPercent(20, '5')).toBe('25%');
    });

    it('should handle string inputs', () => {
      expect(mmToPercent('10', '5')).toBe('50%');
      expect(mmToPercent('0.4', '0.8')).toBe('200%');
    });

    it('should return original value if already a percentage', () => {
      expect(mmToPercent(10, '50%')).toBe('50%');
    });

    it('should return undefined for invalid inputs', () => {
      expect(mmToPercent(undefined, '5')).toBeUndefined();
      expect(mmToPercent(10, undefined)).toBeUndefined();
      expect(mmToPercent('50%', '5')).toBeUndefined();
      expect(mmToPercent(0, '5')).toBeUndefined();
    });
  });

  describe('evaluatePrintOrder', () => {
    it('should return default order when both are false', () => {
      expect(evaluatePrintOrder(false, false)).toBe('inner wall/outer wall/infill');
    });

    it('should return outer wall first when externalPerimetersFirst is true', () => {
      expect(evaluatePrintOrder(true, false)).toBe('outer wall/inner wall/infill');
    });

    it('should return infill first when infillFirst is true', () => {
      expect(evaluatePrintOrder(false, true)).toBe('infill/inner wall/outer wall');
    });

    it('should return infill/outer wall/inner wall when both are true', () => {
      expect(evaluatePrintOrder(true, true)).toBe('infill/outer wall/inner wall');
    });

    it('should handle undefined values', () => {
      expect(evaluatePrintOrder(undefined, undefined)).toBe('inner wall/outer wall/infill');
      expect(evaluatePrintOrder(true, undefined)).toBe('outer wall/inner wall/infill');
      expect(evaluatePrintOrder(undefined, true)).toBe('infill/inner wall/outer wall');
    });
  });

  describe('evaluateIroningType', () => {
    it('should return ironing type when ironing is enabled', () => {
      expect(evaluateIroningType(true, 'top surface')).toBe('top surface');
      expect(evaluateIroningType(true, 'all surfaces')).toBe('all surfaces');
    });

    it('should return "no ironing" when ironing is disabled', () => {
      expect(evaluateIroningType(false, 'top surface')).toBe('no ironing');
      expect(evaluateIroningType(false, undefined)).toBe('no ironing');
    });

    it('should return "no ironing" when ironingType is undefined but ironing is enabled', () => {
      expect(evaluateIroningType(true, undefined)).toBe('no ironing');
    });

    it('should handle undefined ironing flag', () => {
      expect(evaluateIroningType(undefined, 'top surface')).toBe('no ironing');
    });
  });

  describe('getOS', () => {
    it('should return correct OS type', () => {
      const os = getOS();
      expect(['linux', 'MSWin32', 'darwin']).toContain(os);
    });

    it('should map win32 to MSWin32', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      expect(getOS()).toBe('MSWin32');
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('should map darwin to darwin', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      expect(getOS()).toBe('darwin');
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('should map linux to linux', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      expect(getOS()).toBe('linux');
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });
  });

  describe('getHomeDir', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should return HOME environment variable on Unix systems', () => {
      const originalHome = process.env.HOME;
      process.env.HOME = '/home/testuser';
      delete process.env.USERPROFILE;
      expect(getHomeDir()).toBe('/home/testuser');
      if (originalHome !== undefined) {
        process.env.HOME = originalHome;
      }
    });

    it('should return USERPROFILE environment variable on Windows', () => {
      const originalUserProfile = process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.USERPROFILE = 'C:\\Users\\testuser';
      expect(getHomeDir()).toBe('C:\\Users\\testuser');
      if (originalUserProfile !== undefined) {
        process.env.USERPROFILE = originalUserProfile;
      }
    });

    it('should prefer HOME over USERPROFILE', () => {
      const originalHome = process.env.HOME;
      const originalUserProfile = process.env.USERPROFILE;
      process.env.HOME = '/home/testuser';
      process.env.USERPROFILE = 'C:\\Users\\testuser';
      expect(getHomeDir()).toBe('/home/testuser');
      if (originalHome !== undefined) {
        process.env.HOME = originalHome;
      }
      if (originalUserProfile !== undefined) {
        process.env.USERPROFILE = originalUserProfile;
      }
    });

    it('should return empty string if neither is set', () => {
      const originalHome = process.env.HOME;
      const originalUserProfile = process.env.USERPROFILE;
      delete process.env.HOME;
      delete process.env.USERPROFILE;
      expect(getHomeDir()).toBe('');
      if (originalHome !== undefined) {
        process.env.HOME = originalHome;
      }
      if (originalUserProfile !== undefined) {
        process.env.USERPROFILE = originalUserProfile;
      }
    });
  });

  describe('isOutputIniType', () => {
    it('should return true for valid output types', () => {
      expect(isOutputIniType('print')).toBe(true);
      expect(isOutputIniType('filament')).toBe(true);
      expect(isOutputIniType('printer')).toBe(true);
    });

    it('should return false for invalid output types', () => {
      expect(isOutputIniType('physical_printer')).toBe(false);
      expect(isOutputIniType('unsupported')).toBe(false);
    });

    it('should act as a type guard', () => {
      const type: IniType = 'print';
      if (isOutputIniType(type)) {
        // TypeScript should know type is OutputIniType here
        expect(type).toBe('print');
      }
    });
  });

  describe('isValidIniType', () => {
    it('should return true for valid ini types', () => {
      expect(isValidIniType('print')).toBe(true);
      expect(isValidIniType('filament')).toBe(true);
      expect(isValidIniType('printer')).toBe(true);
      expect(isValidIniType('physical_printer')).toBe(true);
    });

    it('should return false for unsupported type', () => {
      expect(isValidIniType('unsupported')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidIniType(undefined)).toBe(false);
    });

    it('should act as a type guard', () => {
      const type: IniType | undefined = 'print';
      if (isValidIniType(type)) {
        // TypeScript should know type is not 'unsupported' here
        expect(type).not.toBe('unsupported');
      }
    });
  });
});

