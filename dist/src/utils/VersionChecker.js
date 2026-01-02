import axios from 'axios';
import chalk from 'chalk';
import boxen from 'boxen';
import { configManager } from '../core/ConfigManager.js';
const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
export async function checkForUpdates(currentVersion) {
    try {
        const now = Date.now();
        const settings = configManager.getSettings();
        const lastCheck = settings.lastVersionCheck || 0;
        if (now - lastCheck < VERSION_CHECK_INTERVAL) {
            return;
        }
        const { data } = await axios.get(`https://registry.npmjs.org/command-shortner/latest`, { timeout: 1000 });
        const latestVersion = data.version;
        if (latestVersion !== currentVersion) {
            const updateMessage = boxen(`${chalk.yellow('New version available!')} ${chalk.dim(currentVersion)} → ${chalk.green(latestVersion)}\n` +
                `Run ${chalk.cyan('npm install -g command-shortner')} to update`, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' });
            console.log(updateMessage);
        }
    }
    catch (error) {
    }
}
//# sourceMappingURL=VersionChecker.js.map