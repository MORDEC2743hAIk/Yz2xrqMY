// 代码生成时间: 2025-09-20 03:46:03
 * Last Edited: [Insert Date]
 */

// Import required modules
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Payment processing module (mock)
const paymentProcessor = {
  processPayment: function (amount) {
    // Simulate payment processing (in real scenario, this could be an API call)
    console.log(`Processing payment of ${amount}...`);
    // For demo purposes, we'll assume all payments are successful
    return Promise.resolve(true);
  }
};

// Create payment window function
function createPaymentWindow() {
  const paymentWindow = new BrowserWindow({
    width: 400,
    height: 200,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  paymentWindow.loadFile(path.join(__dirname, 'payment.html'));
  paymentWindow.on('closed', () => {
    paymentWindow = null;
  });
}

// IPC event handler for payment processing
ipcMain.on('process-payment', async (event, amount) => {
  try {
    const result = await paymentProcessor.processPayment(amount);
    if (result) {
      event.reply('payment-processed', { success: true, message: 'Payment processed successfully.' });
    } else {
      event.reply('payment-processed', { success: false, message: 'Payment processing failed.' });
    }
  } catch (error) {
    event.reply('payment-processed', { success: false, message: 'An error occurred during payment processing.' });
  }
});

// Electron application setup
app.on('ready', createPaymentWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Exit cleanly on request from parent process in development environment
if (process.platform === 'win32') {  process.on('message', (data) => {
    if (data === 'graceful-exit') {
      app.quit();
    }
  });
}
