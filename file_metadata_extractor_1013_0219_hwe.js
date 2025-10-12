// 代码生成时间: 2025-10-13 02:19:22
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to extract file metadata
function extractMetadata(filePath) {
  let metadata = {};
  try {
    // Get file stats
    const stats = fs.statSync(filePath);
    metadata.size = stats.size;
    metadata.creationDate = stats.birthtime;
    metadata.modificationDate = stats.mtime;

    // Get file name
    metadata.fileName = path.basename(filePath);
  } catch (error) {
    // Handle file reading errors
    console.error('Error reading file:', error);
  }
  return metadata;
}

// Create the main window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html file
  win.loadFile('index.html');

  // Open the developer tools
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Handle file dialog for selecting files
function openFileDialog() {
  dialog.showOpenDialog({
    properties: ['openFile'],
  }, (filePaths) => {
    if (filePaths === undefined) {
      return;
    }
    const filePath = filePaths[0];
    const metadata = extractMetadata(filePath);

    // Display metadata in the main window
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.send('metadata', metadata);
  });
}

// Handle the 'open-file-dialog' event
app.on('open-file-dialog', openFileDialog);

// Export the openFileDialog function so it can be called from the renderer process
module.exports = { openFileDialog };
