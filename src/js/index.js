/* 
    File: main.js
    Author: Luis David Villalobos Gonzalez
    Date: 24/02/2021
*/

const { app, BrowserWindow} = require('electron')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindows () {
  const mainwin = new BrowserWindow({
    show: false,
    icon: 'src/img/feather.ico',
    height: 800,
    width: 600,
    minHeight: 400,
    minWidth: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  })
  mainwin.loadFile('src/components/index.html')
  mainwin.once('ready-to-show', () => {
    mainwin.maximize()
    mainwin.show()
  })
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows()
  }
})