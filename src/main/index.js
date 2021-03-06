import { app, BrowserWindow, ipcMain , dialog} from 'electron' // eslint-disable-line
import path from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1200,
    webPreferences: {
      webSecurity: false,
      devTools: true, // process.env.NODE_ENV === 'development',
    },
  });

  const APP_USER_DATA = process.env.NODE_ENV === 'development' ?
    path.join(process.cwd(), '.user-data') :
    app.getPath('userData');

  mainWindow.webContents.executeJavaScript(`window.APP_USER_DATA_DIR="${APP_USER_DATA}"`);

  mainWindow.maximize();

  mainWindow.loadURL(winURL);

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('open-dev-tool', () => {
  mainWindow.webContents.openDevTools();
});
