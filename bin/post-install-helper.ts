#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postInstallScript = path.join(__dirname, '..', 'scripts', 'post-install.js'); // Targeting the compiled js in dist

if (fs.existsSync(postInstallScript)) {
    try {
        import(postInstallScript);
    } catch (error) {
        console.error('Failed to run post-install script:', error);
    }
}
