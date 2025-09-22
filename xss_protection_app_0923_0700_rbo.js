// 代码生成时间: 2025-09-23 07:00:00
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { removeXSS } = require('xss'); // 引用第三方XSS防护库

// 程序主入口
function createWindow () {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载应用的index.html文件
  win.loadFile('index.html');

  // 开启开发者工具
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow).catch(console.error);

// 监听所有未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

// 监听所有未处理的拒绝的Promise
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的拒绝的Promise:', promise, '原因:', reason);
});

// 定义一个中间件函数来防护XSS攻击
function xssMiddleware(req, res, next) {
  const body = req.body;
  if (body && typeof body === 'object') {
    Object.keys(body).forEach((key) => {
      body[key] = removeXSS(String(body[key]));
    });
  }
  next();
}

// 导出中间件函数
module.exports = {
  xssMiddleware
};

// 注释：
// 1. 我们使用了ELECTRON框架来创建桌面应用程序。
// 2. 使用第三方库xss来防护XSS攻击。
// 3. 通过中间件函数xssMiddleware来清理请求体中的XSS。
// 4. 在ELECTRON应用中，我们通过监听未捕获的异常和未处理的拒绝的Promise
//    来增强应用的稳定性。
// 5. 代码遵循JS最佳实践，具有良好的可维护性和可扩展性。