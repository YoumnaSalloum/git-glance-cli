#!/usr/bin/env node
import { program } from 'commander';
import { simpleGit } from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const git = simpleGit();

// --- Gemini AI Setup ---
// Make sure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Theme Colors
const primary = chalk.cyan;
const success = chalk.green;
const accent = chalk.magenta;

// --- 📊 THE DASHBOARD ---
async function showDashboard() {
  const spinner = ora(primary('Synchronizing with repository...')).start();
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
${primary.bold('Branch:')}    ${chalk.white(status.current)}
${success.bold('Latest:')}    ${chalk.white(log.latest.message)}
${accent.bold('Author:')}    ${chalk.white(log.latest.author_name)}
${chalk.yellow.bold('Status:')}    ${chalk.white(status.files.length + ' files modified')}
${chalk.blue.bold('Remote:')}    ${chalk.white(remote[0]?.refs.fetch || 'None')}
    `;

    console.log(boxen(stats, {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      title: '🚀 Youmna Git Assistant (Gemini)',
      titleAlignment: 'center',
      borderColor: 'cyan'
    }));
  } catch (err) {
    spinner.fail(chalk.red('Failed to load dashboard.'));
  }
}

// --- 🤖 AI COMMANDS ---
program.name('ygit').version('2.1.0').description('Personal AI Git Assistant powered by Gemini');

// 1. AI Commit Suggestion
program
  .command('commit')
  .description('Suggest a commit message using Gemini AI')
  .action(async () => {
    const spinner = ora(primary('Gemini is analyzing changes...')).start();
    try {
      const diff = await git.diff();
      if (!diff) return spinner.info('No changes found to describe.');

      const prompt = `Write a professional, concise one-line git commit message for these changes: ${diff.substring(0, 5000)}`;
      const result = await model.generateContent(prompt);
      
      spinner.stop();
      console.log(boxen(success(result.response.text().trim()), { 
        title: '✨ Gemini Suggestion', 
        padding: 1, 
        borderColor: 'green' 
      }));
    } catch (err) { spinner.fail('Gemini error: ' + err.message); }
  });

// 2. AI Code Review
program
  .command('review')
  .description('Let Gemini review your code for bugs')
  .action(async () => {
    const spinner = ora(accent('Gemini is inspecting your code...')).start();
    try {
      const diff = await git.diff();
      const prompt = `You are a senior reviewer. Spot bugs or messy logic in this diff. Be concise: ${diff.substring(0, 5000)}`;
      const result = await model.generateContent(prompt);
      
      spinner.stop();
      console.log(boxen(chalk.white(result.response.text()), { 
        title: '🔍 AI Code Review', 
        padding: 1, 
        borderColor: 'magenta' 
      }));
    } catch (err) { spinner.fail('Review failed.'); }
  });

// 3. Repo Chat
program
  .command('chat <question>')
  .description('Ask a question about your git history')
  .action(async (question) => {
    const spinner = ora(primary('Consulting history...')).start();
    try {
      const logs = await git.log({ n: 10 });
      const prompt = `Based on these git logs: ${JSON.stringify(logs)}, answer: ${question}`;
      const result = await model.generateContent(prompt);

      spinner.stop();
      console.log(`${accent('🤖 Gemini Assistant:')} ${chalk.white(result.response.text())}`);
    } catch (err) { spinner.fail('Chat failed.'); }
  });

// Default behavior
if (!process.argv.slice(2).length) {
  showDashboard();
}

program.parse(process.argv);