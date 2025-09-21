// 代码生成时间: 2025-09-22 07:56:52
const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 定义数据库迁移工具的配置项
const config = {
  migrationDir: './migrations',
  dbConfigPath: './dbConfig.json',
  executablePath: '/path/to/your/migration/command', // 请替换为实际的迁移命令路径
};

// 定义窗口的创建和加载函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// 监听所有窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 执行数据库迁移
function runMigration() {
  try {
    const dbConfig = JSON.parse(fs.readFileSync(config.dbConfigPath, 'utf-8'));
    const migrationCommand = spawn(config.executablePath, [config.migrationDir], {
      stdio: 'inherit',
    });

    migrationCommand.on('close', (code) => {
      if (code === 0) {
        console.log('Migration successful.');
      } else {
        console.error('Migration failed.');
      }
    });

    migrationCommand.on('error', (error) => {
      console.error('Error running migration:', error.message);
    });
  } catch (error) {
    dialog.showErrorBox('Migration Error', error.message);
  }
}

// 导出runMigration函数，以便在renderer进程中调用
module.exports = { runMigration };

// 注释和文档
/**
 * 运行数据库迁移
 * @param {string} commandPath - 数据库迁移命令的路径
 * @param {string} migrationDir - 存储migration文件的目录
 * @param {string} dbConfigPath - 数据库配置文件的路径
 */
