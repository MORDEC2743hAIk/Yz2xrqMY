// 代码生成时间: 2025-09-30 01:59:21
const { app, BrowserWindow } = require('electron');
const isUrl = require('is-url');
const fetch = require('node-fetch');

// 创建并加载主窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  // 打开开发者工具
  win.webContents.openDevTools();
}

// 程序入口
app.whenReady().then(createWindow).catch(console.error);

// 捕获所有未处理的异常和拒绝的promises
process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
});

// 捕获所有未捕获的异常
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

// 定义验证URL链接有效性的函数
function validateUrl(url) {
  // 检查是否为有效的URL
  if (!isUrl(url)) {
    return {
      isValid: false,
      message: 'Provided string is not a valid URL.',
    };
  }
  
  // 尝试使用fetch API验证URL是否可达
  fetch(url)
    .then(response => {
      // 如果响应状态码在200-299之间，则URL有效
      if (response.ok) {
        return {
          isValid: true,
          message: 'URL is valid and reachable.',
        };
      } else {
        throw new Error('URL is not reachable. Status code: ' + response.status);
      }
    })
    .catch(error => {
      // 如果fetch失败，则URL无效
      return {
        isValid: false,
        message: error.message,
      };
    });}

// 导出validateUrl函数以便在主窗口中使用
module.exports = { validateUrl };
