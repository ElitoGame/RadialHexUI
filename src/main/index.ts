import { app, BrowserWindow, ipcMain, globalShortcut, screen, Tray, Menu } from 'electron';
import * as path from 'path';
import { is } from '@electron-toolkit/utils';

let appVisible = true;
let tray: Tray | null = null;

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png'),
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
    },
    width: 800,
    show: false,
    frame: false,
    transparent: true,
    thickFrame: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    fullscreen: true,
  });

  // and load the index.html of the app.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.setAlwaysOnTop(true, 'pop-up-menu');
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  ipcMain.on('set-ignore-mouse-events', (_event, yes: boolean, forward: { forward: boolean }) => {
    mainWindow?.setIgnoreMouseEvents(yes, forward);
  });

  mainWindow.on('close', () => {
    mainWindow = null;
  });
}

function createSettingsWindow(): void {
  // create the settings window
  settingsWindow = new BrowserWindow({
    height: 600,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png'),
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/settings.js'), // Not sure if this is the correct preload script. I couldn't access the one in the SettingsMenu folder, so hoping this one is enough.
      nodeIntegration: true,
    },
    width: 800,
    title: 'RadialHexUI Settings',
    icon: path.join(__dirname, '../../build/icon.png'),
  });

  // and load the settings.html of the app.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('Loading settings from', process.env['ELECTRON_RENDERER_URL']);
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/settings.html');
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/settings.html'));
  }
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show();
  });

  settingsWindow.on('close', () => {
    settingsWindow = null;
  });
}

app.disableHardwareAcceleration();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Register a 'CommandOrControl+Shift+Space' shortcut listener.
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    // TODO test if this even works lol
    // Make sure the application is displayed on the currently active screen. Only move the window if it's being activated to avoid visual glitches.
    // Set it to fullscreen so that the window is maximized and the menu can be moved via CSS later.
    if (!appVisible) {
      mainWindow?.setPosition(screen.getCursorScreenPoint().x, screen.getCursorScreenPoint().y);
      mainWindow?.setFullScreen(true);
    }
    mainWindow?.webContents.send('toggle-window', appVisible);
    const pos = {
      x: screen.getCursorScreenPoint().x - (mainWindow?.getPosition()[0] ?? 0),
      y: screen.getCursorScreenPoint().y - (mainWindow?.getPosition()[1] ?? 0),
    };
    mainWindow?.webContents.send('set-mouse-position', pos);
    console.log('CommandOrControl+Shift+Space is pressed, now: ' + appVisible);
    appVisible = !appVisible;
    // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  // Create the tray menu
  tray = new Tray(path.join(__dirname, '../../build/icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Settings',
      type: 'normal',
      click: () => (settingsWindow === null ? createSettingsWindow() : settingsWindow.focus()),
    },
    { label: 'Close UI', type: 'normal', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Radial Hex UI');
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+Shift+Space');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Autolaunch:
const AutoLaunch = require('easy-auto-launch');

const hexAutoLauncher = new AutoLaunch({
  name: 'RadialHexUI',
  path: app.getPath('exe'),
});

hexAutoLauncher
  .isEnabled()
  .then(function (isEnabled: boolean) {
    if (isEnabled) {
      return;
    }
    hexAutoLauncher.enable();
  })
  .catch(function () {
    // handle error
  });
