import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { successMsg, errorMsg } from '../utils/ui.js';
import chalk from 'chalk';

export const fixWindowsCommandAction = async () => {
    if (process.platform !== 'win32') {
        errorMsg('This command is only needed on Windows systems.');
        return;
    }
    try {
        const npmPath = execSync('npm root -g').toString().trim();
        const npmBinPath = path.join(npmPath, '..', '.bin');
        const batchFilePath = path.join(os.homedir(), 'boost.cmd');
        const batchContent = `@echo off\nnode "${path.join(npmBinPath, 'boost')}" %*`;

        fs.writeFileSync(batchFilePath, batchContent);
        successMsg(`Windows fix created successfully at: ${batchFilePath}`);
        console.log(chalk.blue('\nCopy this file to a directory in your PATH or add its location to your PATH variable.'));
    } catch (error: any) {
        errorMsg(error.message);
    }
};

export function registerFixWindowsCommand(program: Command) {
    program
        .command('fix-windows')
        .description('Generate a batch file to make boost work in PowerShell')
        .action(fixWindowsCommandAction);
}
