// 代码生成时间: 2025-09-23 23:47:01
const { app, BrowserWindow, ipcMain } = require('electron');

// 权限控制配置
const accessControlConfig = {
  'admin': ['create', 'read', 'update', 'delete'],
  'editor': ['read', 'update'],
  'viewer': ['read']
};

// 用户数据（示例），实际应用中应该从数据库或其他存储中获取
const users = [
  { id: 1, username: 'adminUser', role: 'admin' },
  { id: 2, username: 'editorUser', role: 'editor' },
  { id: 3, username: 'viewerUser', role: 'viewer' }
];

// 权限验证中间件
function hasPermission(role, action) {
  return accessControlConfig[role]?.includes(action);
}

// 创建窗口并加载应用
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
  win.on('closed', () => {
    win = null;
  });
}

// 处理权限请求
ipcMain.on('check-permission', async (event, username, action) => {
  try {
    // 根据用户名查找用户角色
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }

    // 验证权限
    const hasAccess = hasPermission(user.role, action);
    if (!hasAccess) {
      throw new Error('Access denied');
    }

    event.reply('permission-reply', { success: true });
  } catch (error) {
    event.reply('permission-reply', { success: false, message: error.message });
  }
});

app.on('ready', createWindow);

// 其他Electron生命周期事件处理...
