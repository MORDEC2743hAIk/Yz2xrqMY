// 代码生成时间: 2025-10-09 23:38:38
// video_encoder_decoder.js
// A simple Electron application for video encoding and decoding

// Import necessary Electron modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Import video encoding/decoding library
const ffmpeg = require('fluent-ffmpeg');

// Function to encode video
function encodeVideo(inputPath, outputPath, callback) {
  // Check if input file exists
  fs.access(inputPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback('Input file does not exist', null);
      return;
    }

    // Start encoding process
    ffmpeg(inputPath)
      .audioCodec('aac')
      .videoCodec('libx264')
      .output(outputPath)
      .on('error', (err) => {
        callback('Encoding error: ' + err.message, null);
      })
      .on('end', () => {
        callback(null, outputPath);
      })
      .run();
  });
}

// Function to decode video
function decodeVideo(inputPath, outputPath, callback) {
  // Check if input file exists
  fs.access(inputPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback('Input file does not exist', null);
      return;
    }

    // Start decoding process
    ffmpeg(inputPath)
      .output(outputPath)
      .on('error', (err) => {
        callback('Decoding error: ' + err.message, null);
      })
      .on('end', () => {
        callback(null, outputPath);
      })
      .run();
  });
}

// Create Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load index.html of the app
  win.loadFile('index.html');
}

// Handle Electron app events
app.whenReady().then(createWindow).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}).on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Export functions for use in preload script
module.exports = {
  encodeVideo,
  decodeVideo,
};
