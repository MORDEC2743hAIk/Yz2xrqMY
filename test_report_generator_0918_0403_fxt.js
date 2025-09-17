// 代码生成时间: 2025-09-18 04:03:24
// Import necessary modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Function to generate a test report
function generateTestReport(testResults) {
  const pdfDoc = new PDFDocument();
  pdfDoc.addPage([
    {
      stack: [
        { text: 'Test Report', font: 'Helvetica-Bold', size: 25 },
        { text: new Date().toLocaleString(), font: 'Helvetica', size: 10 },
        {
          canvas: (canvas) => {
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(10, 50);
            ctx.lineTo(200, 50);
            ctx.stroke();
          },
          width: 200,
          height: 200,
        },
        {
          table: {
            headerRows: 1,
            body: testResults.map(result => [
              { text: result.testName, bold: true },
              { text: result.status, bold: true },
              { text: result.details },
            ]),
          },
        },
      ],
    },
  ]);

  return pdfDoc;
}

// Function to save the test report to a file
function saveTestReport(filePath, pdfDoc) {
  return pdfDoc.save();
}

// Create Electron application
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// Handle saving the report
ipcMain.on('save-report', async (event, testResults) => {
  try {
    const filePath = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Test Report',
      defaultPath: path.join(app.getPath('documents'), 'TestReport.pdf'),
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });

    if (filePath.canceled) return;

    const pdfDoc = await generateTestReport(testResults);
    const fileData = await saveTestReport(filePath.filePaths[0], pdfDoc);
    dialog.showMessageBox(mainWindow, {
      message: 'Test report saved successfully.',
      buttons: ['OK'],
    });
  } catch (error) {
    dialog.showMessageBox(mainWindow, {
      message: `Error: ${error.message}`,
      buttons: ['OK'],
    });
  }
});

// Main application logic
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});