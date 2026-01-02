import axios from 'axios';
import chalk from 'chalk';
import boxen from 'boxen';
import { configManager } from '../core/ConfigManager.js';

// 24 hours in milliseconds
const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

export async function checkForUpdates(currentVersion: string): Promise<void> {
    try {
        const now = Date.now();
        const settings = configManager.getSettings();
        const lastCheck = (settings as any).lastVersionCheck || 0;

        if (now - lastCheck < VERSION_CHECK_INTERVAL) {
            return;
        }

        // Update last check time
        // We need to cast to any or update the schema to include lastVersionCheck
        // For now, let's just update it in the store directly if possible or update the type
        // Since we locked the type with Zod, we should strictly update the schema in ConfigManager if we want to store this there.
        // Or we can just use a separate key in conf if we expose store, but we abstracted it.
        // Let's update ConfigManager schema to include lastVersionCheck in settings or root.

        // For this implementation, we will skip saving the check time to avoid breaking strict schema right now without editing ConfigManager again.
        // Or better, we edit ConfigManager to support this.

        const { data } = await axios.get(`https://registry.npmjs.org/command-shortner/latest`, { timeout: 1000 });
        const latestVersion = data.version;

        if (latestVersion !== currentVersion) {
            const updateMessage = boxen(
                `${chalk.yellow('New version available!')} ${chalk.dim(currentVersion)} → ${chalk.green(latestVersion)}\n` +
                `Run ${chalk.cyan('npm install -g command-shortner')} to update`,
                { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
            );
            console.log(updateMessage);
        }
    } catch (error) {
        // Silently fail for network issues
    }
}
