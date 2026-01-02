import Conf from 'conf';
import { z } from 'zod';
const CommandSchema = z.record(z.string(), z.string());
const SettingsSchema = z.object({
    shellOverride: z.string().optional(),
    lastVersionCheck: z.number().optional(),
});
const StatsSchema = z.record(z.string(), z.number());
const ConfigSchema = z.object({
    commands: CommandSchema.default({}),
    settings: SettingsSchema.default({}),
    stats: StatsSchema.default({}),
});
export class ConfigManager {
    store;
    constructor(options = {}) {
        this.store = new Conf({
            projectName: 'command-shortner',
            schema: {
                commands: {
                    type: 'object',
                    default: {},
                },
                settings: {
                    type: 'object',
                    default: {},
                },
                stats: {
                    type: 'object',
                    default: {},
                },
            },
            ...options
        });
    }
    getCommands() {
        return this.store.get('commands') || {};
    }
    getCommand(alias) {
        const commands = this.getCommands();
        return commands[alias];
    }
    setCommand(alias, command) {
        const commands = this.getCommands();
        commands[alias] = command;
        this.store.set('commands', commands);
    }
    removeCommand(alias) {
        const commands = this.getCommands();
        if (commands[alias]) {
            delete commands[alias];
            this.store.set('commands', commands);
            const stats = this.getStats();
            if (stats[alias]) {
                delete stats[alias];
                this.store.set('stats', stats);
            }
        }
        else {
            throw new Error(`Alias "${alias}" not found`);
        }
    }
    incrementUsage(alias) {
        const stats = this.getStats();
        stats[alias] = (stats[alias] || 0) + 1;
        this.store.set('stats', stats);
    }
    getStats() {
        return this.store.get('stats') || {};
    }
    getSettings() {
        return this.store.get('settings') || {};
    }
}
export const configManager = new ConfigManager();
//# sourceMappingURL=ConfigManager.js.map