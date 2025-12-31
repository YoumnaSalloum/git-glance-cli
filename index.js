#!/usr/bin/env node
import { program } from 'commander';
import { simpleGit } from 'simple-git';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import { primary, success, accent, error, text, createSpinner, createBox, createProgressBar, log, logError } from './utils/ui.js'; // Updated import

const git = simpleGit();

// --- Gemini AI Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_MODEL || "gemini-3-flash-preview" 
});

// --- 📊 THE DASHBOARD (Default) ---
async function showDashboard() {
  const spinner = createSpinner('Loading Git Dashboard...').start();
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      spinner.fail(error('Error: Not a git repository!'));
      return;
    }

    const status = await git.status();
    const logResult = await git.log({ n: 1 });
    const remote = await git.getRemotes(true);
    spinner.stop();

    const stats = `
${primary.bold('Branch:')}    ${text(status.current)}
${success.bold('Latest:')}    ${text(logResult.latest.message)}
${accent.bold('Author:')}    ${text(logResult.latest.author_name)}
${primary.bold('Status:')}    ${text(status.files.length + ' files modified')}
${primary.bold('Remote:')}    ${text(remote[0]?.refs.fetch || 'None')}
    `;

    log(createBox(stats, { title: '🚀 Youmna Git Dashboard (Hacker Mode)', borderColor: primary.toString() })); // Using new createBox
  } catch (err) {
    spinner.fail(error('Failed to load dashboard.'));
    logError(err.message);
  }
}

// --- 🤖 AI COMMANDS ---
program.name('ygit').version('2.2.0').description('Personal AI Git Assistant powered by Gemini');

// 1. AI Commit Suggestion
program
  .command('commit')
  .description('Suggest a commit message using Gemini AI')
  .action(async () => {
    const spinner = createSpinner('AI is analyzing changes...').start();
    try {
      const diff = await git.diff();
      if (!diff) return spinner.info(text('No changes found to describe.'));

      const prompt = `Write a professional, concise one-line git commit message for these changes: ${diff.substring(0, 5000)}`;
      const result = await model.generateContent(prompt);
      
      spinner.stop();
      log(createBox(success(result.response.text().trim()), { title: '✨ Gemini Suggestion', borderColor: 'green' }));
    } catch (err) {
      spinner.stop();
      if (err.message.includes('429')) {
        logError("Quota reached! Please wait 60 seconds before trying again.");
      } else if (err.message.includes('404')) {
        logError("Model not found. Ensure line 12 is: gemini-3-flash-preview");
      } else {
        logError(err.message);
      }
    }
  });

// 2. AI Code Review
program
  .command('review')
  .description('Let Gemini review your code for bugs')
  .action(async () => {
    const spinner = createSpinner('Gemini is inspecting your code...', accent).start();
    try {
      const diff = await git.diff();
      const prompt = `You are a senior reviewer. Spot bugs or messy logic in this diff. Be concise: ${diff.substring(0, 5000)}`;
      const result = await model.generateContent(prompt);
      
      spinner.stop();
      log(createBox(text(result.response.text()), { title: '🔍 AI Code Review', borderColor: accent.toString() }));
    } catch (err) { spinner.fail(error('Review failed.')); logError(err.message); }
  });

// 3. Repo Chat
program
  .command('chat <question>')
  .description('Ask a question about your git history')
  .action(async (question) => {
    const spinner = createSpinner('Consulting history...').start();
    try {
      const logs = await git.log({ n: 10 });
      const prompt = `Based on these git logs: ${JSON.stringify(logs)}, answer: ${question}`;
      const result = await model.generateContent(prompt);

      spinner.stop();
      log(`${accent('🤖 Gemini Assistant:')} ${text(result.response.text())}`);
    } catch (err) { spinner.fail(error('Chat failed.')); logError(err.message); }
  });

// 4. AI-Powered Merge Conflict Helper (NEW!)
program
  .command('merge-help')
  .description('Analyze and suggest resolutions for merge conflicts')
  .action(async () => {
    const spinner = createSpinner('Analyzing merge conflicts... 💔', error).start();
    try {
      const conflicts = await git.diff(['--check']); // This checks for unresolved conflicts
      if (!conflicts) {
        spinner.succeed(success('No merge conflicts detected.'));
        return;
      }

      spinner.text = primary('Reading conflict markers...');
      const conflictedFiles = await git.raw(['diff', '--name-only', '--diff-filter=U']);
      const conflictDetails = [];
      const files = conflictedFiles.trim().split('\n').filter(Boolean);

      if (files.length === 0) {
          spinner.succeed(success('No active merge conflicts found.'));
          return;
      }
      
      const progressBar = createProgressBar('Processing Files', 30);
      progressBar.start(files.length, 0);

      for (const [index, file] of files.entries()) {
          const fileContent = await git.raw(['show', `:${file}`]); // Get content with conflict markers
          conflictDetails.push(`File: ${file}\nContent:\n${fileContent}`);
          progressBar.update(index + 1);
      }
      progressBar.stop();
      
      const prompt = `You are an expert Git merge conflict resolver. Analyze the following merge conflicts and provide a clear explanation for each conflict and suggest the best way to resolve it. Be concise but clear.
      
Conflicts:
${conflictDetails.join('\n---\n').substring(0, 15000)}

Please output your suggestions for each file.`;

      spinner.text = primary('Asking Gemini for merge resolution...');
      spinner.start();

      const result = await model.generateContent(prompt);
      spinner.stop();
      
      log(createBox(text(result.response.text()), { 
        title: '💔 AI Merge Conflict Helper', 
        borderColor: error.toString() 
      }));

    } catch (err) {
      spinner.fail(error('Failed to help with conflicts.'));
      logError(err.message);
    }
  });

// Default behavior
if (!process.argv.slice(2).length) {
  showDashboard();
}

program.parse(process.argv);