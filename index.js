#!/usr/bin/env node

import { simpleGit } from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';

const git = simpleGit();

async function showGitStats() {
    const spinner = ora('Fetching Git Info...').start();

    try {
        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
            spinner.fail(chalk.red('Error: Not a git repository!'));
            return;
        }

        const status = await git.status();
        const log = await git.log({ n: 1 });
        const remote = await git.getRemotes(true);

        spinner.stop();

        const stats = `
${chalk.cyan.bold('Branch:')}    ${chalk.white(status.current)}
${chalk.green.bold('Latest:')}    ${chalk.white(log.latest.message)}
${chalk.yellow.bold('Author:')}    ${chalk.white(log.latest.author_name)}
${chalk.magenta.bold('Changes:')}   ${chalk.white(status.files.length + ' files modified')}
${chalk.blue.bold('Remote:')}    ${chalk.white(remote[0]?.refs.fetch || 'None')}
        `;

        console.log(boxen(stats, { 
            padding: 1, 
            margin: 1, 
            borderStyle: 'round', 
            title: 'Git Glance Dashboard', 
            titleAlignment: 'center',
            borderColor: 'cyan' 
        }));

    } catch (error) {
        spinner.fail(chalk.red('Something went wrong!'));
        console.error(error);
    }
}

showGitStats();