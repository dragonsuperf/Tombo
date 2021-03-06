const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const ioHook = require('iohook')

let mainWindow;

function createWindow(){
  const { width } = electron.screen.getPrimaryDisplay().workAreaSize;
  
   mainWindow = new BrowserWindow({
    width: isDev ? 800 : 300,
    height: isDev ? 600 : 125,
    frame: isDev,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });

  mainWindow.setPosition(width - 300, 0);
  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file:${path.join(__dirname, '../build/index.html')}`);
  
  if(isDev){
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', ()=>mainWindow = null);
   
  ioHook.on('keydown', event => {
    mainWindow.webContents.send('key-down', { key: event });
  })
  
  ioHook.start(true);
}

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
   if(process.platform !== 'darwin'){
      app.quit();
   }
});

app.on('activate',()=>{
   if(mainWindow === null){
      createWindow();
   }
});