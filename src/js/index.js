/* 
    File: main.js
    Author: Luis David Villalobos Gonzalez
    Date: 20/02/2021
*/

const { app, BrowserWindow} = require('electron')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindows () {
  const mainwin = new BrowserWindow({
    show: false,
    icon: 'src/img/feather.ico',
    height: 350,
    width: 550,
    minHeight: 350,
    minWidth: 550,
    maxHeight: 350,
    maxWidth: 550,
    frame: false,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  })
  mainwin.loadFile('src/components/index.html')
  mainwin.once('ready-to-show', () => {
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