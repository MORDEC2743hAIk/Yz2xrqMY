// 代码生成时间: 2025-09-19 01:15:53
const { app, BrowserWindow } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 创建主窗口
 * @param {string} filePath - 要读取的文件路径
 */
function createWindow(filePath) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('file-path', filePath);
  });
}

// 预加载脚本，用于在渲染器进程中暴露文件路径
const preload = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  calculateHash: async (algorithm, filePath) => {
    try {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          const hash = crypto.createHash(algorithm).update(data).digest('hex');
          resolve(hash);
        });
      });
    } catch (error) {
      throw error;
    }
  },
  openFile: async () => {
    return new Promise((resolve, reject) => {
      const { canceled, filePaths } = await ipcRenderer.invoke('open-file-dialog');
      if (canceled) {
        reject(new Error('User canceled'));
        return;
      }
      resolve(filePaths[0]);
    });
  },
});
`;

// 保存预加载脚本到文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// 监听主进程消息
app.on('ready', () => {
  const filePath = process.argv[2] || '';
  if (!filePath) {
    console.error('Please provide a file path as the first argument.');
    app.quit();
    return;
  }
  createWindow(filePath);
});

// 处理命令行参数
app.on('second-instance', (event, commandLine, workingDirectory) => {
  app.quit();
  process.start(process.execPath, commandLine.slice(1).concat([workingDirectory]));
});

// 错误监听器
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 确保应用程序在没有图形用户界面的情况下仍然运行
app.allowRendererProcessReuse = false;
