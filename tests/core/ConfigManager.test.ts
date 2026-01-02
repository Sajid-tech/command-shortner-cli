import { ConfigManager } from '../../src/core/ConfigManager';
import path from 'path';
import fs from 'fs';
import os from 'os';

const TEST_DIR = path.join(os.tmpdir(), 'boost-tests-' + Date.now());

describe('ConfigManager', () => {
    let configManager: ConfigManager;

    beforeAll(() => {
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });

    afterAll(() => {
        try {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        } catch (e) { }
    });

    beforeEach(() => {
        configManager = new ConfigManager({ cwd: TEST_DIR });
        // clear config
        const cmds = configManager.getCommands();
        for (const key of Object.keys(cmds)) {
            configManager.removeCommand(key);
        }
    });

    it('should set and get a command', () => {
        configManager.setCommand('test', 'echo hello');
        expect(configManager.getCommand('test')).toBe('echo hello');
    });

    it('should remove a command', () => {
        configManager.setCommand('del', 'echo goodbye');
        expect(configManager.getCommand('del')).toBe('echo goodbye');

        configManager.removeCommand('del');
        expect(configManager.getCommand('del')).toBeUndefined();
    });

    it('should throw when removing non-existent command', () => {
        expect(() => {
            configManager.removeCommand('nonexistent');
        }).toThrow('not found');
    });

    it('should get settings', () => {
        expect(configManager.getSettings()).toEqual({});
    });
});
