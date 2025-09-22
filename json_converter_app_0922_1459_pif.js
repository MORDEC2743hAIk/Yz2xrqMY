// 代码生成时间: 2025-09-22 14:59:21
 const { app, BrowserWindow } = require('electron');

 // Handle creating/removing shortcuts on Windows when installing/uninstalling.
 if (require('electron-squirrel-startup')) { app.quit(); }

 // Create a function that creates the browser window.
 function createWindow () {
     // Create the browser window.
     let win = new BrowserWindow({
         width: 800,
         height: 600,
         webPreferences: {
             nodeIntegration: true,
             enableRemoteModule: true
         }
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

 // In this file you can include the rest of your app's specific main process
 // code. You can also put them in separate files and import them here.

 /**
 * Converts JSON data from one format to another.
 * @param {string} jsonData - The JSON data to convert.
 * @returns {string} - The converted JSON data.
 */
 function convertJsonData(jsonData) {
     try {
         // Parse the input JSON data.
         let parsedData = JSON.parse(jsonData);

         // Convert the parsed data to a string in the desired format.
         return JSON.stringify(parsedData, null, 2);
     } catch (error) {
         console.error('Error converting JSON data:', error);
         return null;
     }
 }

 // Example usage of the convertJsonData function:
 // let sampleJson = '{"key": "value"}';
 // let convertedJson = convertJsonData(sampleJson);
 // console.log(convertedJson);

 // Export the convertJsonData function for use in the renderer process.
 module.exports = { convertJsonData };
