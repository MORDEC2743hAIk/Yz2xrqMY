// 代码生成时间: 2025-09-18 16:24:25
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { expect } = chai;

// 初始化chai
chai.use(chaiAsPromised);

// 定义测试配置
const testConfig = {
  ui: 'bdd',
  timeout: 5000,
  reporter: 'spec'
};

// 创建Mocha实例
const mochaInstance = new mocha(testConfig);

// 自动加载所有的测试文件
fs.readdirSync(__dirname).forEach((file) => {
  if (file.toLowerCase().endsWith('.test.js')) {
    mochaInstance.addFile(path.join(__dirname, file));
  }
});

// Electron主进程
class AutomationTestSuite {
  constructor() {
    this.isTesting = process.argv.includes('--test');
  }

  start() {
    if (!this.isTesting) {
      app.quit();
      return;
    }

    // 运行测试
    mochaInstance.run((failures) => {
      if (failures > 0) {
        console.error('Some tests failed.');
      } else {
        console.log('All tests passed.');
      }
      app.quit();
    });
  }
}

// 创建BrowserWindow实例
class MainWindow extends BrowserWindow {
  constructor() {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
    });
  }

  loadApp() {
    this.loadURL('http://localhost:3000');
  }
}

// Electron生命周期
app.whenReady().then(() => {
  const mainWindow = new MainWindow();
  mainWindow.loadApp();
  if (process.argv.includes('--test')) {
    const testSuite = new AutomationTestSuite();
    testSuite.start();
  }
}).catch(console.error);

// 监听所有未捕获的异常和拒绝的promise
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// 测试文件示例
// example.test.js
describe('Electron App Test Suite', () => {
  it('should open a window', () => {
    const mainWindow = new MainWindow();
    mainWindow.loadApp();
    return expect(mainWindow.isVisible()).to.eventually.equal(true);
  });
});