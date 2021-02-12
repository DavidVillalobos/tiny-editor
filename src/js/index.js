/* 
File: main.js
Author: Luis David Villalobos Gonzalez
Date: 28/01/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const { app, BrowserWindow, Menu } = require('electron')
const { exec } = require('child_process')
// Menu.setApplicationMenu(null);

function createWindows () {
  const mainwin = new BrowserWindow({
    show: false,
    icon: 'img/feather.ico',
    height: 350,
    width: 550,
    minHeight: 350,
    minWidth: 550,
    frame: false,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  })
  //mainwin.removeMenu()
  mainwin.loadFile('index.html')
  //mainwin.maximize();
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


