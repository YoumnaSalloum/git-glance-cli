# 🦋 youmna-git-glance (ygit)
**The Git Assistant with Long-Term Memory.**
[![npm version](https://img.shields.io/npm/v/youmna-git-glance.svg)](https://www.npmjs.com/package/youmna-git-glance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`youmna-git-glance` is an AI-native CLI that transforms your repository's history into an active knowledge base. Powered by Google Gemini, it uses intelligent keyword extraction to scout your entire commit history, providing AI-powered code reviews, automated professional commits, and context-aware chat that truly understands your codebase.

---
## ⚡ Quick Look: Dashboard & AI Chat
![ygit in action](demo.gif)

## 🎥 Demo

<a href="https://www.youtube.com/watch?v=Jxc45Jc_-dc" target="_blank">
  <img src="https://img.youtube.com/vi/Jxc45Jc_-dc/maxresdefault.jpg" alt="ygit Demo Video" width="600px">
</a>

*Click to watch the full walkthrough (AI Review, Smart Chat, and Merge Resolution)*

---

## ✨ Features

- 📊 **Smart Dashboard:** A beautiful, color-coded summary of your branch, changes, and latest commits.
- 🤖 **Gemini AI Commit:** Instantly generate professional, one-line commit messages by analyzing your file changes.
- 🔍 **AI Code Review:** Get a senior-level review of your current diff to spot bugs before you push.
- 💬 **Smart Context Chat:** Ask natural questions about your repository. The AI scans your entire git history using intelligent keyword matching to find relevant commits and deliver context-aware answers.
- 🛡️ **Merge Helper:** Solve complex merge conflicts with a step-by-step AI resolution plan.
- ⚡ **Lightweight & Fast:** Built for speed, keeping your hands on the keyboard.

---

## 📦 Installation

Install the tool globally using npm:

```bash
npm install -g youmna-git-glance
```

Then use it anywhere with:

```bash
ygit
```

---

## 🔑 Setup & Configuration

To keep `ygit` private and free, it uses your own Google Gemini API key.

1. Get your Key: Visit [Google AI Studio](https://aistudio.google.com/) and create a new API key. 
2. Initial Setup: Run `ygit --reset-key`. The tool will immediately ask you to paste your new key. 
3. Automatic Prompt: If you forget to set it up, ygit will automatically ask for your key the first time you try to use an AI command like ygit chat or ygit commit.
4. Advanced Model Switching (Optional): By default, ygit uses gemini-3-flash-preview. You can override this by creating a .env file in your project root or setting an environment variable:
```bash
      GEMINI_MODEL=gemini-1.5-flash
```

> [!IMPORTANT]
> Your key is now stored securely in your local machine's config. You won't have to enter it again for future commands.

---

## 🚀 Usage

⭐ **View available commands & help**
```bash
ygit
```

⭐ **Check version**
```bash
ygit -v
```

⭐ **Launch the Hacker Mode Dashboard**
```bash
ygit -d
```

⭐ **Generate an AI commit message for staged changes**
```bash
ygit commit
```

⭐ **Analyze current code diff for bugs**
```bash
ygit review
```

⭐ **Ask a question about your repository history**
```bash
ygit chat "What features did I add yesterday?"
```

The chat command uses advanced keyword extraction to intelligently search your entire git history. It identifies important keywords from your question (like "features", "login", "bugfix") and searches across all branches to find the most relevant commits. If no matches are found, it falls back to your 10 most recent commits, ensuring you always get contextual answers about your work.

**Chat Examples:**
```bash
ygit chat "When did I fix the authentication bug?"
ygit chat "What changes did I make to the database module?"
ygit chat "Show me commits related to the API refactor"
```

⭐ **Get help resolving active merge conflicts**
```bash
ygit merge-help
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and modify it.

---

## 📞 Support & Community

- **Issues:** If you run into any trouble, please open an [issue on GitHub](https://github.com/YoumnaSalloum/git-glance-cli/issues).
- **Feature Requests:** Have an idea for a new AI command? Let us know in the issues!
- **Pull Requests:** We love community contributions. Feel free to fork the repo and submit a PR.

---

## 🚀 Happy Coding! 🎉
