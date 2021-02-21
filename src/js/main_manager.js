/* 
    File: MainManager.js
    Author: Luis David Villalobos Gonzalez
    Date: 21/02/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const { BrowserWindow } = require('electron').remote
const { remote } = require('electron') 

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_simple_file = document.getElementById('button-simple-file');
var button_open_folder = document.getElementById('button-open-folder');
var button_new_folder = document.getElementById('button-new-folder');
var button_settings = document.getElementById('button-settings');
var button_about = document.getElementById('button-about');

// =/=/=/=/=/=/= WINDOWS =/=/=/=/=/=/=/=/=/=/
let mainwin = remote.getCurrentWindow();

let simple_editor_win;
let folder_editor_win;
let settings_win;
let about_win;

function generate_window(path_to_html, my_width, my_height){
  let win = new BrowserWindow({
    show: false,
    icon: 'src/img/feather.ico',
    width: my_width, 
    height: my_height, 
    minHeight: 400,
    minWidth: 400,  
    frame: false,
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
    }
  });
  win.loadFile(path_to_html);
  //win.webContents.openDevTools()
  win.once('ready-to-show', () => {
    win.show()
    mainwin.hide()
  })  
  return win;
}

button_simple_file.onclick = function() {
  simple_editor_win = generate_window('src/components/simple_editor.html', 800, 600);
  simple_editor_win.on('closed', function(){
    mainwin.close();
    simple_editor_win = null;
  });
  simple_editor_win.maximize();
};


button_open_folder.onclick = function() {  
  folder_editor_win = generate_window('src/components/folder_editor.html', 800, 600); 
  folder_editor_win.on('closed', function(){
    mainwin.close();
    folder_editor_win = null;
  });
};

button_new_folder.onclick = function() {  
  folder_editor_win = generate_window('src/components/folder_editor.html', 800, 600); 
  folder_editor_win.on('closed', function(){
    mainwin.close();
    folder_editor_win = null;
  });
};

button_settings.onclick = function() {  
  settings_win = generate_window('src/components/settings.html', 800, 440); 
  settings_win.setResizable(false);
  settings_win.on('closed', function(){
    settings_win = null;
    mainwin.show();
  });
};

button_about.onclick = function() {  
  about_win = generate_window('src/components/about.html', 500, 500); 
  about_win.on('closed', function(){
    about_win = null;
    mainwin.show();
  });
};