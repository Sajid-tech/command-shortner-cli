import { jest } from '@jest/globals';
import EventEmitter from 'events';

// Define mock before imports
jest.unstable_mockModule('child_process', () => ({
    spawn: jest.fn(),
}));

// Import dynamic modules
const { spawn } = await import('child_process');
const { commandExecutor } = await import('../../src/core/CommandExecutor.js');

const mockSpawn = spawn as jest.Mock;

describe('CommandExecutor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call spawn with correct arguments', async () => {
        const mockProcess = new EventEmitter() as any;
        mockProcess.stdout = new EventEmitter();
        mockProcess.stderr = new EventEmitter();

        mockSpawn.mockReturnValue(mockProcess);

        const promise = commandExecutor.execute('echo test', true);

        // Simulate process completion
        setTimeout(() => {
            mockProcess.emit('close', 0);
        }, 10);

        await promise;

        expect(mockSpawn).toHaveBeenCalled();
        const calls = mockSpawn.mock.calls[0];

        // Check arguments
        const shellArgs = calls[1] as string[];
        expect(shellArgs.some((arg: string) => arg.includes('echo test') || arg.includes('echo'))).toBeTruthy();
    });
});
