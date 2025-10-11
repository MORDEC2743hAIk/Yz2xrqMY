// 代码生成时间: 2025-10-11 22:06:54
const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const si = require('systeminformation');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Create a function to initialize the main window
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC communication between renderer and main processes
ipcMain.handle('get-system-info', async () => {
  try {
    // Get system information
    const systemInfo = await si.system();
    // CPU information
    const cpuInfo = await si.cpu();
    // Memory information
    const memInfo = await si.mem();
    // Disk information
    const diskInfo = await si.fsSize();
    // Network information
    const netInfo = await si.networkInterfaces();

    // Combine all the information into a single object
    const performanceData = {
      systemInfo,
      cpuInfo,
      memInfo,
      diskInfo,
      netInfo,
    };

    // Return the performance data
    return performanceData;
  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error retrieving system performance data:', error);
    throw error;
  }
});

// Handle the 'get-system-info' event from the renderer process
ipcMain.on('get-system-info', async (event) => {
  try {
    // Use the handle function to get system information
    const performanceData = await event.handle('get-system-info');
    // Send the performance data back to the renderer process
    event.reply('get-system-info-response', performanceData);
  } catch (error) {
    // Send any errors back to the renderer process
    event.reply('get-system-info-response', { error: error.message });
  }
});