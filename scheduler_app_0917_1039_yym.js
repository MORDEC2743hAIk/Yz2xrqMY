// 代码生成时间: 2025-09-17 10:39:19
 * It offers a simple interface to add, remove and list scheduled tasks.
 */

const { app, BrowserWindow } = require('electron');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Define the directory for storing task configuration
const tasksDir = path.join(os.homedir(), 'scheduler_tasks');

// Create tasks directory if it doesn't exist
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Store tasks in memory
let tasks = {};

// Function to schedule a new task
function scheduleTask(taskName, cronPattern, taskFunction) {
  if (cron.validate(cronPattern)) {
    tasks[taskName] = cron.schedule(cronPattern, taskFunction, { scheduled: true });
    console.log(`Task ${taskName} scheduled with pattern ${cronPattern}`);
  } else {
    throw new Error(`Invalid cron pattern for task ${taskName}`);
  }
}

// Function to remove a scheduled task
function removeTask(taskName) {
  if (tasks[taskName]) {
    tasks[taskName].stop();
    delete tasks[taskName];
    console.log(`Task ${taskName} removed`);
  } else {
    throw new Error(`Task ${taskName} not found`);
  }
}

// Function to list all scheduled tasks
function listTasks() {
  return tasks;
}

// Function to save tasks to a file
function saveTasksToFile() {
  const tasksFile = path.join(tasksDir, 'tasks.json');
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
  console.log('Tasks saved to file');
}

// Function to load tasks from a file
function loadTasksFromFile() {
  const tasksFile = path.join(tasksDir, 'tasks.json');
  if (fs.existsSync(tasksFile)) {
    const fileTasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
    Object.keys(fileTasks).forEach((taskName) => {
      const task = fileTasks[taskName];
      scheduleTask(taskName, task.pattern, task.function.toString()); // Recreate the task
    });
    console.log('Tasks loaded from file');
  } else {
    console.log('No tasks file found, starting with an empty schedule');
  }
}

// Initialize the application
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile('index.html');
}

// Save tasks before app quits
app.on('will-quit', saveTasksToFile);

app.whenReady().then(() => {
  createWindow();
  loadTasksFromFile();
});

// Handle app activation
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Handle app error
app.on('error', (error) => {
  console.error('An error occurred:', error);
});

// Export functions to be used by the preload script
module.exports = {
  scheduleTask,
  removeTask,
  listTasks,
  saveTasksToFile,
  loadTasksFromFile,
};