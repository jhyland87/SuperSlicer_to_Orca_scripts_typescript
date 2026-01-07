import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import inquirer from 'inquirer';
import { displayMenu, askInput } from './menu';
import * as index from './index';

// Mock inquirer
vi.mock('inquirer');
vi.mock('./index', () => ({
  exitWithConversionSummary: vi.fn().mockResolvedValue(undefined)
}));

describe('menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('displayMenu', () => {
    it('should return selected option for single-select menu', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ choice: 'Option 1' });

      const result = await displayMenu('Choose an option:', true, ['Option 1', 'Option 2', 'Option 3']);

      expect(result).toBe('Option 1');
      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'list',
          message: 'Choose an option:',
          choices: expect.arrayContaining(['Option 1', 'Option 2', 'Option 3', '\x1b[1;31m<QUIT>\x1b[0m'])
        })
      ]);
    });

    it('should return array of selected options for multi-select menu', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ choices: ['Option 1', 'Option 2'] });

      const result = await displayMenu('Choose options:', false, ['Option 1', 'Option 2', 'Option 3']);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['Option 1', 'Option 2']);
      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'checkbox',
          message: 'Choose options:',
          choices: expect.arrayContaining(['<ALL>', 'Option 1', 'Option 2', 'Option 3', '\x1b[1;31m<QUIT>\x1b[0m'])
        })
      ]);
    });

    it('should return all options when <ALL> is selected', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ choices: ['<ALL>'] });

      const result = await displayMenu('Choose options:', false, ['Option 1', 'Option 2', 'Option 3']);

      expect(result).toEqual(['Option 1', 'Option 2', 'Option 3']);
    });

    it('should exit when QUIT is selected in single-select', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      vi.mocked(inquirer.prompt).mockResolvedValue({ choice: '\x1b[1;31m<QUIT>\x1b[0m' });
      vi.mocked(index.exitWithConversionSummary).mockResolvedValue(undefined);

      await expect(displayMenu('Choose:', true, ['Option 1'])).rejects.toThrow('process.exit called');

      expect(index.exitWithConversionSummary).toHaveBeenCalled();
      exitSpy.mockRestore();
    });

    it('should exit when QUIT is selected in multi-select', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      vi.mocked(inquirer.prompt).mockResolvedValue({ choices: ['\x1b[1;31m<QUIT>\x1b[0m'] });
      vi.mocked(index.exitWithConversionSummary).mockResolvedValue(undefined);

      await expect(displayMenu('Choose:', false, ['Option 1'])).rejects.toThrow('process.exit called');

      expect(index.exitWithConversionSummary).toHaveBeenCalled();
      exitSpy.mockRestore();
    });
  });

  describe('askInput', () => {
    it('should return user input', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ value: 'test input' });

      const result = await askInput('Enter value:');

      expect(result).toBe('test input');
      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'input',
          message: 'Enter value:'
        })
      ]);
    });

    it('should use default value when provided', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ value: 'default value' });

      const result = await askInput('Enter value:', 'Description', 'default value');

      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'input',
          message: 'Enter value:',
          default: 'default value'
        })
      ]);
    });

    it('should include description when provided', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ value: 'test' });

      await askInput('Enter value:', 'This is a description');

      expect(inquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'input',
          message: 'Enter value:',
          description: 'This is a description'
        })
      ]);
    });

    it('should not include description when not provided', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValue({ value: 'test' });

      await askInput('Enter value:');

      const calls = vi.mocked(inquirer.prompt).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const firstCall = calls[0];
      if (Array.isArray(firstCall) && firstCall.length > 0) {
        const question = firstCall[0] as { description?: string };
        expect(question).not.toHaveProperty('description');
      }
    });
  });
});

