/* 
File: main.js
Author: Luis David Villalobos Gonzalez
Date: 27/01/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const { app, BrowserWindow } = require('electron')
const { exec } = require('child_process')


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
  win.maximize();
  //win.webContents.openDevTools()
  exec('MD codes', (err, stdout, stderr) => {});
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }  
  exec('RD /S/Q codes', (err, stdout, stderr) => {});
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})