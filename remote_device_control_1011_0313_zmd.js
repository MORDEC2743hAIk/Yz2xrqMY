// 代码生成时间: 2025-10-11 03:13:27
const { app, BrowserWindow, ipcMain } = require('electron');
const net = require('net');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define the port for remote control server
const CONTROL_PORT = 1234;

// Define the path to the index.html file in the renderer process
const indexHTMLPath = path.join(__dirname, 'index.html');

// Create a map to keep track of connected clients
const clients = new Map();

// Function to handle incoming connections
function handleConnection(client) {
  clients.set(client.remoteAddress, client);
  client.on('data', (data) => {
    // Handle incoming data from the client
    console.log(`Received data from ${client.remoteAddress}: ${data}`);
    // Emit event to the renderer process
    BrowserWindow.getAllWindows().forEach((win) => win.webContents.send('device-control-data', data));
  });
  client.on('end', () => {
    // Remove the client from the map when disconnected
    clients.delete(client.remoteAddress);
  });
}

// Create a server to listen for incoming connections
const server = net.createServer(handleConnection);
server.listen(CONTROL_PORT, () => {
  console.log(`Remote control server listening on port ${CONTROL_PORT}`);
});

// Handle 'ready' event from Electron
app.on('ready', () => {
  // Create the main browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile(indexHTMLPath);

  // Handle window close event to clean up
  mainWindow.on('closed', () => {
    server.close();
    app.quit();
  });
});

// Handle 'error' event from Electron
app.on('error', (error) => {
  console.error('An error occurred:', error);
});

// Handle IPC messages from the renderer process
ipcMain.on('send-device-control-command', (event, arg) => {
  // Broadcast the command to all connected clients
  for (const client of clients.values()) {
    client.write(arg);
  }
});

// Write the index.html file for the renderer process
fs.writeFileSync(indexHTMLPath, `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Remote Device Control</title>
</head>
<body>
  <h1>Remote Device Control</h1>
  <input type="text" id="commandInput" placeholder="Enter command..." />
  <button id="sendCommand">Send Command</button>
  <script>
    document.getElementById('sendCommand').addEventListener('click', () => {
      const command = document.getElementById('commandInput').value;
      window.electronAPI.sendToDeviceControl(command);
    });
  </script>
</body>
</html>
`);

// Preload script to expose Electron APIs to the renderer process
const preloadJSPath = path.join(__dirname, 'preload.js');
fs.writeFileSync(preloadJSPath, `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendToDeviceControl: (command) => {
    ipcRenderer.send('send-device-control-command', command);
  },
});
`);
