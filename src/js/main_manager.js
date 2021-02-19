/* 
    File: MainManager.js
    Author: Luis David Villalobos Gonzalez
    Date: 12/02/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const { BrowserWindow } = require('electron').remote
const { remote } = require('electron') 
const { exec } = require('child_process');

// Navbar
const customTitlebar = require('custom-electron-titlebar');
  new customTitlebar.Titlebar({
   backgroundColor: customTitlebar.Color.fromHex('#252525'),
   menu: null,
   maximizable: false
});


// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_simple_file = document.getElementById('button-simple-file');
var button_open_folder = document.getElementById('button-open-folder');
// var button_new_folder = document.getElementById('button-new-folder');

var mainwin = remote.getCurrentWindow();

button_simple_file.onclick = function() {
  const codewin = new BrowserWindow({
    show: false,
    icon: 'src/img/feather.ico',
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 740,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  })
  // codewin.removeMenu()
  codewin.maximize();
  codewin.loadFile('src/components/simple_editor.html')
  //codewin.webContents.openDevTools()
  codewin.on('closed', function(){
    mainwin.close()
    exec('rd /s/q codes', (err, stdout, stderr) => {});
  });
  codewin.once('ready-to-show', () => {
    mainwin.hide()
    codewin.show()
  })  
  exec('md codes', (err, stdout, stderr) => {});
};


button_open_folder.onclick = function() {  
  const codewin = new BrowserWindow({
    show: false,
    icon: 'img/feather.ico',
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
  codewin.loadFile('src/components/folder_editor.html')
  //codewin.webContents.openDevTools()
  codewin.on('closed', function(){
    mainwin.close()
  });
  codewin.once('ready-to-show', () => {
    mainwin.hide()
  })
};

