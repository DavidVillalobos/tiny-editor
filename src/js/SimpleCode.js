/* 
  File: SimpleCode.js
  Author: Luis David Villalobos Gonzalez
  Date: 04/02/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const { BrowserWindow } = require('electron').remote 
const { remote } = require('electron') 
const { exec } = require('child_process');

// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_simple_file = document.getElementById('button-simple-file')

var mainwin = remote.getCurrentWindow();

button_simple_file.onclick = function() {
  const codewin = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 720,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  })
  // codewin.removeMenu()
  codewin.maximize();
  codewin.loadFile('pages/code.html')
  //codewin.webContents.openDevTools()
  codewin.on('closed', function(){
    mainwin.close()
  });
  // CD resources/app &&
  codewin.once('ready-to-show', () => {
    mainwin.hide()
    codewin.show()
  })  
};
