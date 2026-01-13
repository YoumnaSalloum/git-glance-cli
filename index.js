#!/usr/bin/env node
import { program } from 'commander';
import { simpleGit } from 'simple-git';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import { primary, success, accent, error, text, createSpinner, createBox, createProgressBar, log, logError } from './utils/ui.js'; // Updated import
import fs from 'fs'; // Ensure you have this import at the top

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

log(createBox(text(result.response.text()), { 
    title: '🔍 AI Code Review', 
    borderColor: 'magenta' 
}));
    } catch (err) { spinner.fail(error('Review failed.')); logError(err.message); }
  });

// 3. Repo Chat
// 3. Repo Chat (Advanced Keyword Scout)
program
  .command('chat <question>')
  .description('Ask a question about your git history (Smart Context)')
  .action(async (question) => {
    const spinner = createSpinner('Scanning history for context...').start();
    try {
      // 1. Identify "keywords" from the question (simple split for now)
      // Example: "When did I fix the login?" -> ['fix', 'login']
      const keywords = question.toLowerCase().split(' ').filter(word => word.length > 3);
      
      let contextLogs;
      
      if (keywords.length > 0) {
        // 2. Search logs for these keywords across the ENTIRE history
        // We use --grep for messages and -i for case-insensitive
        const searchOptions = {
          '--all': null,
          '--grep': keywords,
          '-n': 15, // Get top 15 relevant matches
        };
        contextLogs = await git.log(searchOptions);
      }

      // 3. Fallback: If no keywords or no matches, get the most recent 10
      if (!contextLogs || contextLogs.all.length === 0) {
        contextLogs = await git.log({ n: 10 });
      }

      const prompt = `
        You are a Git History Expert. 
        Based on these relevant git logs: ${JSON.stringify(contextLogs.all)}
        
        Answer the following user question clearly: "${question}"
        
        If you found the answer in an older commit, mention the date and hash.
      `;

      const result = await model.generateContent(prompt);

      spinner.stop();
      log(`${accent.bold('🤖 Gemini Assistant:')}\n${text(result.response.text())}`);
    } catch (err) { 
      spinner.fail(error('Chat failed.')); 
      logError(err.message); 
    }
  });

// 4. AI-Powered Merge Conflict Helper (FIXED)
program
  .command('merge-help')
  .description('Analyze and suggest resolutions for merge conflicts')
  .action(async () => {
    const spinner = createSpinner('Scanning for 💔 conflicts...').start();
    try {
      const status = await git.status();
      const conflictedFiles = status.conflicted; // Get files that are "unmerged"

      if (conflictedFiles.length === 0) {
        spinner.succeed(success('No merge conflicts detected! Everything is clean.'));
        return;
      }

      const conflictDetails = [];
      for (const file of conflictedFiles) {
        // We read from the disk (worktree) instead of the Git index
        // This avoids the "Stage 0" error
        const content = await fs.promises.readFile(file, 'utf8');
        if (content.includes('<<<<<<<')) {
          conflictDetails.push(`File: ${file}\n${content}`);
        }
      }

      if (conflictDetails.length === 0) {
        spinner.fail(error('Conflicted files found, but no markers (<<<<<<<) detected.'));
        return;
      }

      spinner.text = primary('Gemini is resolving the puzzle...');
      const prompt = `You are a Git Expert. Explain the conflict and suggest a solution for:
      ${conflictDetails.join('\n\n').substring(0, 8000)}`;

      const result = await model.generateContent(prompt);
      spinner.stop();

      log(createBox(text(result.response.text()), { 
          title: '🛡️ AI Merge Resolution', 
          borderColor: 'red' 
      }));

    } catch (err) {
      spinner.stop();
      logError("Could not analyze conflicts: " + err.message);
    }
  });

// Default behavior
if (!process.argv.slice(2).length) {
  showDashboard();
}

program.parse(process.argv);