# 🦋 youmna-git (ygit)

**The AI-Powered Git Assistant that makes your workflow glide.**

[![npm version](https://img.shields.io/npm/v/youmna-git.svg)](https://www.npmjs.com/package/youmna-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`youmna-git` is a professional-grade CLI tool that transforms your terminal into a smart dashboard. Powered by **Google Gemini 1.5 Flash**, it doesn't just show you your git status—it helps you write code, review bugs, and understand your history.

---

## ✨ Features

- 📊 **Smart Dashboard:** A beautiful, color-coded summary of your branch, changes, and latest commits.
- 🤖 **Gemini AI Commit:** Instantly generate professional, one-line commit messages by analyzing your file changes.
- 🔍 **AI Code Review:** Get a senior-level review of your current diff to spot bugs before you push.
- 💬 **Repo Chat:** Ask questions like "What did I change in the last hour?" and get answers based on your git logs.
- ⚡ **Lightweight & Fast:** Built for speed, keeping your hands on the keyboard and out of heavy GUIs.

---

## 📦 Installation

Install the tool globally using npm:

```bash
npm install -g youmna-git
----------
# 🦋 youmna-git (ygit)

**The AI-Powered Git Assistant that makes your workflow glide.**

[![npm version](https://img.shields.io/npm/v/youmna-git.svg)](https://www.npmjs.com/package/youmna-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`youmna-git` is a professional-grade CLI tool that transforms your terminal into a smart dashboard. Powered by **Google Gemini 1.5 Flash**, it doesn't just show you your git status—it helps you write code, review bugs, and understand your history.

---

## 🔑 Setup

To use the AI features (Commit, Review, Chat), you need to get a free API Key from Google:

1.  **Get your Key:** Go to [Google AI Studio](https://aistudio.google.com/) and click **"Get API key"**.
2.  **Add to Environment:** Create a file named `.env` in your project root or add it to your shell profile:
    ```text
    GEMINI_API_KEY=your_key_here
    ```
3.  **Important:** Make sure your `.env` file is added to your `.gitignore` so your key stays private!

---

## 🚀 Usage

Once installed globally, you can launch the beautiful dashboard simply by typing:

```bash
ygit