// 代码生成时间: 2025-09-17 23:18:52
const { app, BrowserWindow, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * BatchRenamer class to handle batch file renaming.
 */
class BatchRenamer {
  /**
   * Create a new instance of BatchRenamer.
   */
  constructor() {
    this.window = null;
  }

  /**
   * Initialize the application window.
   */
  init() {
    this.createWindow();
  }

  /**
   * Create the application's main window.
   */
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.window.loadFile('index.html');
  }

  /**
   * Open the dialog to select files for renaming.
   */
  selectFiles() {
    dialog.showOpenDialog(this.window, {
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'All Files',
        extensions: ['*'],
      }],
    }).then(result => {
      if (result.canceled) return;
      if (result.filePaths.length === 0) return;
      this.renameFiles(result.filePaths);
    }).catch(err => {
      console.error(err);
    });
  }

  /**
   * Rename the selected files based on a given pattern.
   * @param {string[]} filePaths - Array of file paths to rename.
   */
  renameFiles(filePaths) {
    filePaths.forEach((file, index) => {
      // Define your renaming pattern here.
      // For example, prefix each file with 'renamed_'
      const newFileName = `renamed_${path.basename(file)}`;
      const newFilePath = path.join(path.dirname(file), newFileName);

      fs.rename(file, newFilePath, err => {
        if (err) {
          console.error(`Failed to rename ${file} to ${newFilePath}: ${err}`);
          return;
        }
        console.log(`Renamed ${file} to ${newFilePath}`);
      });
    });
  }
}

// Electron app event handling
app.on('ready', () => {
  const batchRenamer = new BatchRenamer();
  batchRenamer.init();
});

// Handle app closing
app.on('will-quit', () => {
  // Perform cleanup here if necessary
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'Reason:', reason);
});