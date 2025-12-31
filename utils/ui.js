// utils/ui.js
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import cliProgress from 'cli-progress'; // New dependency for progress bar

// --- Theme Colors ---
export const primary = chalk.hex('#00FFFF'); // Electric Cyan
export const success = chalk.hex('#00FF00'); // Bright Green
export const accent = chalk.hex('#FF00FF'); // Magenta
export const warning = chalk.hex('#FFFF00'); // Yellow
export const error = chalk.hex('#FF0000'); // Red
export const text = chalk.whiteBright;

// --- CLI Components ---
// utils/ui.js
export const createSpinner = (textMsg, color = primary) => {
    // Safe check for hex codes
    const match = color.toString().match(/#(?:[0-9a-fA-F]{3}){1,2}/);
    const spinnerColor = match ? match[0] : 'cyan'; 

    return ora({
        text: color(textMsg),
        spinner: { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] },
        // Don't pass hex codes to 'ora', use 'cyan' as a fallback
        color: spinnerColor.startsWith('#') ? 'cyan' : spinnerColor 
    });
};

export const createProgressBar = (name = "Progress", barSize = 20) => {
    const bar = new cliProgress.SingleBar({
        format: `${accent('{bar}')} ${text('{percentage}%')} | {value}/{total} ${primary(name)}`,
        barCompleteChar: '\u2588', // Full block
        barIncompleteChar: '\u2591', // Light shade
        hideCursor: true,
        barsize: barSize,
        linewrap: false
    }, cliProgress.Presets.shades_classic);
    return bar;
};

export const createBox = (content, options = {}) => {
    const defaultOptions = {
        padding: 1,
        margin: 1,
        borderStyle: 'double', // Hacker Mode border
        borderColor: primary.name,
        titleAlignment: 'center',
        ...options
    };
    return boxen(content, defaultOptions);
};

export const log = (message, color = text) => console.log(color(message));
export const logError = (message) => console.error(error('Error: ') + error(message));
export const logSuccess = (message) => console.log(success(message));
export const logWarning = (message) => console.log(warning(message));