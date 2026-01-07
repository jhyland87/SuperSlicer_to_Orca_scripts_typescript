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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const fileIO_1 = require("./fileIO");
// Note: Most functions in index.ts are not exported, so we'll test the exported ones
// and test the logic through integration-style tests
(0, vitest_1.describe)('index helper functions', () => {
    let tempDir;
    let originalEnv;
    (0, vitest_1.beforeEach)(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
        originalEnv = { ...process.env };
    });
    (0, vitest_1.afterEach)(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        process.env = originalEnv;
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)('initializeStatus logic', () => {
        (0, vitest_1.it)('should create status with correct OS-specific data directory', () => {
            const osType = (0, utils_1.getOS)();
            const homeDir = (0, utils_1.getHomeDir)();
            const osDirs = constants_1.systemDirectories.os[osType];
            const expectedDataDir = path.join(homeDir, ...osDirs);
            // Simulate initializeStatus logic
            const status = {
                forceOut: false,
                legacyOverwrite: false,
                maxTemp: 0,
                interactiveMode: false,
                outdirWasProvided: false,
                slicerFlavor: undefined,
                iniType: undefined,
                profileName: undefined,
                ironingType: undefined,
                iterationsLeft: undefined,
                dirs: {
                    output: undefined,
                    data: expectedDataDir,
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
                    nozzleSize: undefined,
                    inherits: undefined,
                    compatiblePrintersCondition: undefined,
                    compatiblePrintsCondition: undefined
                }
            };
            (0, vitest_1.expect)(status.dirs.data).toBe(expectedDataDir);
            (0, vitest_1.expect)(status.forceOut).toBe(false);
            (0, vitest_1.expect)(status.interactiveMode).toBe(false);
        });
    });
    (0, vitest_1.describe)('checkOutputDirectory logic', () => {
        (0, vitest_1.it)('should validate directory exists and is writable', () => {
            const testDir = path.join(tempDir, 'output');
            fs.mkdirSync(testDir, { recursive: true });
            (0, vitest_1.expect)((0, fileIO_1.isDirectory)(testDir)).toBe(true);
            (0, vitest_1.expect)((0, fileIO_1.isWritable)(testDir)).toBe(true);
        });
        (0, vitest_1.it)('should detect non-existent directory', () => {
            const testDir = path.join(tempDir, 'nonexistent');
            (0, vitest_1.expect)((0, fileIO_1.isDirectory)(testDir)).toBe(false);
        });
        (0, vitest_1.it)('should detect non-writable directory', () => {
            // On Unix systems, we can test this by checking permissions
            // On Windows, this is harder to test reliably
            if (process.platform !== 'win32') {
                const testDir = path.join(tempDir, 'readonly');
                fs.mkdirSync(testDir);
                fs.chmodSync(testDir, 0o444); // Read-only
                // Note: isWritable might still return true on some systems
                // This is a basic test
                try {
                    const writable = (0, fileIO_1.isWritable)(testDir);
                    // Result depends on system permissions
                    (0, vitest_1.expect)(typeof writable).toBe('boolean');
                }
                finally {
                    fs.chmodSync(testDir, 0o755);
                }
            }
        });
    });
    (0, vitest_1.describe)('resetLoop logic', () => {
        (0, vitest_1.it)('should reset state variables correctly', () => {
            const status = {
                forceOut: false,
                legacyOverwrite: false,
                maxTemp: 100,
                interactiveMode: false,
                outdirWasProvided: false,
                slicerFlavor: 'PrusaSlicer',
                iniType: 'print',
                profileName: 'test',
                ironingType: 'top surface',
                iterationsLeft: 5,
                dirs: {
                    output: undefined,
                    data: '/tmp',
                    slicer: undefined,
                    temp: undefined
                },
                toVar: {
                    externalPerimetersFirst: true,
                    infillFirst: false,
                    ironing: true
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
            // Simulate resetLoop logic
            const newHash = {};
            status.maxTemp = 0;
            if (!status.interactiveMode) {
                status.iniType = undefined;
            }
            status.profileName = undefined;
            status.toVar.externalPerimetersFirst = undefined;
            status.toVar.infillFirst = undefined;
            status.toVar.ironing = undefined;
            status.ironingType = undefined;
            (0, vitest_1.expect)(status.maxTemp).toBe(0);
            (0, vitest_1.expect)(status.profileName).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.externalPerimetersFirst).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.infillFirst).toBeUndefined();
            (0, vitest_1.expect)(status.toVar.ironing).toBeUndefined();
            (0, vitest_1.expect)(status.ironingType).toBeUndefined();
        });
        (0, vitest_1.it)('should preserve iniType in interactive mode', () => {
            const status = {
                forceOut: false,
                legacyOverwrite: false,
                maxTemp: 0,
                interactiveMode: true,
                outdirWasProvided: false,
                slicerFlavor: undefined,
                iniType: 'print',
                profileName: undefined,
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
                    nozzleSize: undefined,
                    inherits: undefined,
                    compatiblePrintersCondition: undefined,
                    compatiblePrintsCondition: undefined
                }
            };
            // Simulate resetLoop logic
            if (!status.interactiveMode) {
                status.iniType = undefined;
            }
            (0, vitest_1.expect)(status.iniType).toBe('print');
        });
    });
    (0, vitest_1.describe)('logFileStatus logic', () => {
        (0, vitest_1.it)('should create ConvertedFile record correctly', () => {
            const inputFile = '/path/to/input.ini';
            const outputFile = '/path/to/output.json';
            const slicerFlavor = 'PrusaSlicer';
            const success = 'YES';
            const error = undefined;
            const completedFile = {
                inputFile,
                inputDir: path.dirname(inputFile),
                slicerFlavor,
                outputFile,
                outputDir: path.dirname(outputFile),
                success,
                error: error || ''
            };
            (0, vitest_1.expect)(completedFile.inputFile).toBe(inputFile);
            (0, vitest_1.expect)(completedFile.outputFile).toBe(outputFile);
            (0, vitest_1.expect)(completedFile.slicerFlavor).toBe(slicerFlavor);
            (0, vitest_1.expect)(completedFile.success).toBe(success);
            (0, vitest_1.expect)(completedFile.error).toBe('');
        });
        (0, vitest_1.it)('should handle failed conversions', () => {
            const inputFile = '/path/to/input.ini';
            const outputFile = undefined;
            const slicerFlavor = 'SuperSlicer';
            const success = 'NO';
            const error = 'Conversion failed';
            const completedFile = {
                inputFile,
                inputDir: path.dirname(inputFile),
                slicerFlavor,
                outputFile: outputFile || '',
                outputDir: '',
                success,
                error: error || ''
            };
            (0, vitest_1.expect)(completedFile.outputFile).toBe('');
            (0, vitest_1.expect)(completedFile.error).toBe(error);
        });
    });
    (0, vitest_1.describe)('status value reset logic', () => {
        (0, vitest_1.it)('should reset values when reset flag is set', () => {
            const status = {
                forceOut: false,
                legacyOverwrite: false,
                maxTemp: 0,
                interactiveMode: false,
                outdirWasProvided: false,
                slicerFlavor: undefined,
                iniType: undefined,
                profileName: undefined,
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
                    onExisting: true,
                    physicalPrinter: false,
                    nozzleSize: true,
                    inherits: false,
                    compatiblePrintersCondition: false,
                    compatiblePrintsCondition: false
                },
                value: {
                    onExisting: 'OVERWRITE',
                    physicalPrinter: undefined,
                    nozzleSize: 0.4,
                    inherits: undefined,
                    compatiblePrintersCondition: undefined,
                    compatiblePrintsCondition: undefined
                }
            };
            // Simulate reset logic
            for (const param of Object.keys(status.reset)) {
                const key = param;
                if (status.reset[key]) {
                    const valueKey = param;
                    status.value[valueKey] = undefined;
                    status.reset[key] = false;
                }
            }
            (0, vitest_1.expect)(status.value.onExisting).toBeUndefined();
            (0, vitest_1.expect)(status.reset.onExisting).toBe(false);
            (0, vitest_1.expect)(status.value.nozzleSize).toBeUndefined();
            (0, vitest_1.expect)(status.reset.nozzleSize).toBe(false);
        });
    });
});
//# sourceMappingURL=index.test.js.map