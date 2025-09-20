// 代码生成时间: 2025-09-21 05:59:32
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
# 添加错误处理
const path = require('path');
const util = require('util');

// 自定义JSON转换函数
function convertJson(inputJsonString) {
  try {
    // 尝试解析输入的JSON字符串
# TODO: 优化性能
    const parsedJson = JSON.parse(inputJsonString);
    // 转换为驼峰命名法的JSON对象
    const camelCaseJson = JSON.parse(JSON.stringify(parsedJson, (key, value) => {
      if (typeof value === 'string') {
        return value.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      }
# 优化算法效率
      return value;
    }));
    return JSON.stringify(camelCaseJson, null, 2);
  } catch (error) {
    // 错误处理，返回错误信息
    return error.message;
  }
}

// 创建Electron窗口的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载index.html文件
  win.loadFile('index.html');
}

// Electron的主函数
app.on('ready', createWindow);

// 在主进程中使用异步读写文件
# 改进用户体验
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.whenReady().then(() => {
  // 读取JSON文件
  readFileAsync(path.join(__dirname, 'input.json'), 'utf8').then(inputJsonString => {
    // 转换JSON数据
    const outputJsonString = convertJson(inputJsonString);
    // 写入转换后的JSON文件
# FIXME: 处理边界情况
    writeFileAsync(path.join(__dirname, 'output.json'), outputJsonString, 'utf8').then(() => {
      console.log('JSON conversion completed successfully.');
    }).catch(error => {
      console.error('Error writing to file:', error);
    });
  }).catch(error => {
    console.error('Error reading from file:', error);
  });
});

// 确保Electron应用在所有窗口关闭后退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 重启事件处理，以便开发者在开发时快速重启应用
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});