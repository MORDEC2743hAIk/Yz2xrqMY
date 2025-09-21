// 代码生成时间: 2025-09-21 15:18:57
const { app, BrowserWindow } = require('electron');

// 数据模型类
class DataModel {
  // 构造函数
  constructor() {
    this.data = [];
  }

  // 添加数据
  addData(item) {
    try {
      this.data.push(item);
      console.log('Data added successfully:', item);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  // 获取所有数据
  getAllData() {
    return this.data;
  }

  // 更新数据
  updateData(index, newItem) {
    try {
      if (index >= 0 && index < this.data.length) {
        this.data[index] = newItem;
        console.log('Data updated successfully:', newItem);
      } else {
        throw new Error('Index out of bounds');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  // 删除数据
  deleteData(index) {
    try {
      if (index >= 0 && index < this.data.length) {
        this.data.splice(index, 1);
        console.log('Data deleted successfully');
      } else {
        throw new Error('Index out of bounds');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
}

// 创建Electron应用窗口
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
}

// 应用启动时创建窗口
app.whenReady().then(createWindow);

// 应用退出时清理资源
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});