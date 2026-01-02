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

export type ConfigType = z.infer<typeof ConfigSchema>;

export class ConfigManager {
    private store: Conf<ConfigType>;

    constructor(options: Partial<any> = {}) {
        this.store = new Conf<ConfigType>({
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
        } as any); // Type cast needed for conf schema compatibility with Zod inference
    }

    public getCommands(): Record<string, string> {
        return this.store.get('commands') || {};
    }

    public getCommand(alias: string): string | undefined {
        const commands = this.getCommands();
        return commands[alias];
    }

    public setCommand(alias: string, command: string): void {
        const commands = this.getCommands();
        commands[alias] = command;
        this.store.set('commands', commands);
    }

    public removeCommand(alias: string): void {
        const commands = this.getCommands();
        if (commands[alias]) {
            delete commands[alias];
            this.store.set('commands', commands);

            // Also cleanup stats
            const stats = this.getStats();
            if (stats[alias]) {
                delete stats[alias];
                this.store.set('stats', stats);
            }
        } else {
            throw new Error(`Alias "${alias}" not found`);
        }
    }

    public incrementUsage(alias: string): void {
        const stats = this.getStats();
        stats[alias] = (stats[alias] || 0) + 1;
        this.store.set('stats', stats);
    }

    public getStats(): Record<string, number> {
        return this.store.get('stats') || {};
    }

    public getSettings(): ConfigType['settings'] {
        return this.store.get('settings') || {};
    }
}

export const configManager = new ConfigManager();
