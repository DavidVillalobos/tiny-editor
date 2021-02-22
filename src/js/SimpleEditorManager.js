/* 
    File:   EditorManager.js
    Author: Luis David Villalobos Gonzalez
    Date: 20/02/2021
*/

// ================ REQUIREMENTS ============
const { BrowserWindow } = require('electron').remote
const fs = require('fs');// File Module
const { execSync } = require('child_process');// Exec Module
const {dialog} = require('electron').remote;// Dialog Module
const path = require('path');// Path Module
const { remote } = require('electron') 

// ================ WINDOWS ==================
var win = remote.getCurrentWindow();

// ================ EDITOR ==================
var editor = ace.edit('editor')

// ============== TERMINAL ==================
var terminal = ace.edit('terminal');

// ============= BUTTONS ====================
var button_save = document.getElementById('button-save');
var button_compiler = document.getElementById('button-compiler');
var button_runner = document.getElementById('button-runner');
var button_settings = document.getElementById('button-settings');

// ========= EDITOR PANEL ==================
var editor_panel =  document.getElementById('editor')

var terminal_panel =  document.getElementById('terminal')
// ============= VARIABLES ==================
var compiled = false
var clean = true
var file_name = ''
var language = ''

// ============= PATHS ==================
// final path: resources/app/
var path_file = ''
var path_data = 'src/config/data.json'
var path_settings = 'src/config/settings.json'

// ============= SETTINGS DATA ==================
var data = JSON.parse(fs.readFileSync(path_data));

// ============= FUNCTIONS ================

function init_simple_editor(){
  //Load editor options
  editor_panel.style.position = 'absolute'
  editor.setOptions({
    readOnly : false,
    autoScrollEditorIntoView : false,
    highlightActiveLine : true,
    showGutter : true,
    showPrintMargin : true
  });
  
  editor.commands.addCommand({
    name: 'SaveAndCompile',
    bindKey: {win: 'Ctrl-S'},
    exec: function(editor) {
      button_save.click()
    }
  });
  editor.commands.addCommand({
    name: 'Compile',
    bindKey: {win: 'Ctrl-B'},
    exec: function(editor) {
      button_compiler.click()
    }
  });
  editor.commands.addCommand({
    name: 'Run',
    bindKey: {win: 'Ctrl-R'},
    exec: function(editor) {
      button_runner.click()
    }
  });

  //Load terminal options
  terminal_panel.style.position = 'absolute'
  terminal.setTheme('ace/theme/terminal');
  terminal.session.setMode('ace/mode/javascript');
  terminal.setOptions({
    readOnly : true,
    autoScrollEditorIntoView : true,
    highlightActiveLine : false,
    showGutter : false,
    showPrintMargin : false
  });
  // EVENTS
  // onchange in editor
  editor_panel.onclick = function(event){
    compiled = false
  }
  
  editor_panel.addEventListener("mousewheel", event => {
    if(event.ctrlKey == true){
      event.preventDefault();
      let actual = parseInt(editor_panel.style.fontSize.split('px')[0], 10);
      if(event.deltaY > 0) {
        actual--;
      } else {
        actual++;
      }
      editor_panel.style.fontSize = actual + 'px'
      let my_settings = JSON.parse(fs.readFileSync(path_settings));
      my_settings['fontSize-editor'] = actual;
      fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8')
    }
  }, { passive: false });
 
  terminal_panel.addEventListener("mousewheel", event => {
    if(event.ctrlKey == true){
      event.preventDefault();
      let actual = parseInt(terminal_panel.style.fontSize.split('px')[0], 10);
      if(event.deltaY > 0) {
        actual--;
      } else {
        actual++;
      }
      terminal_panel.style.fontSize = actual + 'px'
      let my_settings = JSON.parse(fs.readFileSync(path_settings));
      my_settings['fontSize-terminal'] = actual;
      fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8')
    }
  }, { passive: false });

}

init_simple_editor()



function save_file(){
  let extension = data['language'][language]['extension']
  if(path_file == ''){
    let result = dialog.showSaveDialogSync({ 
      title: 'Select the File Path to save', 
      defaultPath: path.join(process.env.userprofile, 'Desktop'), 
      filters: [
        { name: language, extensions: [extension.slice(1, 5)] }
       ]
    })
    if(result == undefined){
      file_name = path_file = ''
      return false
    }
    let aux_path = result.split('\\');
    file_name = aux_path[aux_path.length - 1];
    path_file = result.split('\\' + file_name)[0]
    fs.writeFileSync(path_file + '\\' + file_name , editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'})
  }else{
    fs.writeFileSync(path_file + '\\' +  file_name, editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'})
  }
  if(file_name == ''){
    titlebar.updateTitle( 'untitled - ' + 'Tiny Editor');
  }else{
    titlebar.updateTitle(path.join(path_file + '\\' + file_name) + ' - ' + 'Tiny Editor');
  }
  return true
}

// Save file
button_save.onclick = function(event){
  file_name = path_file = ''
  compiled = false
  save_file()
} 

// Compile code (compile file)
button_compiler.onclick = function(event){
  if(compiled) {
    terminal.session.setValue('The code is already compiled')
    return
  }
  if(language == 'Choose a language') 
    return
  if(language != 'Python') 
    button_compiler.setAttribute('class', 'button is-warning is-loading')
    terminal.session.setValue('Compiling . . . :o')
  // No need save file if you want compile, except if is java, because
  if(path_file == '' && language != 'Java'){ // file_name need be same class_name
    file_name = 'Test' + data['language'][language]['extension']
    path_file = path.join(__dirname + '\\..\\..\\codes')
  }
  // Save changes
  if(save_file()){
    // Compile code
    try{
      var compiler = data['language'][language]['compiler'] + ' ' + file_name;
      if(language == 'C++'){
        compiler += ' -o ' + file_name.split('.')[0];
      }
      let stdout = execSync('cd ' + path_file + ' & ' + compiler);
      console.log(`stdout: ${stdout}`)
      if(language != 'Python') 
        terminal.session.setValue('Compilation success :D')
      compiled = true
      clean = false
    }catch(stderr){
      console.log(`stderr: ${stderr}`) 
      terminal.session.setValue('Compilation error :c\n Check the following syntax for:\n' + stderr)
      compiled = false
    }
    if(language != 'Python') 
      button_compiler.setAttribute('class', 'button is-warning')
  }
}

// Run code (Run makefile)
button_runner.onclick = function(event) {
  terminal.session.setValue('')
  if(language == 'Python'){
    button_compiler.click()
    compiled = true
  }
  if(!compiled)
    button_compiler.click()
  if(compiled){
    try {
      let runner = data['language'][language]['runner'] + ' ';
      if(language == 'C++'){
        runner += file_name.split('.')[0];
      }else{
        runner += file_name
      }
      let stdout = execSync('cd ' + path_file + ' & start ' + runner)
      console.log(`stdout: ${stdout}`)
      terminal.session.setValue(stdout) // this go to terminal 
    } catch (stderr) {
      console.log(`stderr: ${stderr}`)
      terminal.session.setValue(stderr) // this go to terminal
    }
  }
}

let settings_win = undefined;

button_settings.onclick = function(event){
  if(!settings_win){
    settings_win = new BrowserWindow({
      show: false,
      icon: 'src/img/feather.ico',
      width: 800, 
      height: 430,
      resizable : false,
      frame: false,
      alwaysOnTop : true,
      webPreferences: {
        nodeIntegration: true, 
        enableRemoteModule: true
      }
    }); 
    settings_win.loadFile('src/components/settings.html');
    settings_win.once('ready-to-show', () => {
      settings_win.show()
    })  
    settings_win.on('closed', function(){
      settings_win = null;
      applySettings()
    });
  }
}

// Apply settings
function applySettings(){
  let my_settings = JSON.parse(fs.readFileSync(path_settings));
  // 'dark-mode' : 'true'
  // 'integrated-console' : 'true'
  editor_panel.style.fontSize = my_settings['fontSize-editor'] + 'px'
  terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + 'px'
  editor.session.setTabSize(my_settings['tabSize-editor'])
  editor.setTheme('ace/theme/' + my_settings['theme'])
  editor.session.setMode('ace/mode/' + my_settings['highlighter'])
  if(language != my_settings['current-language']){
    /*if(!clean){
        try {
          let stdout = execSync('cd ' + path_file + ' & del ' + file_name);
          console.log(`stdout: ${stdout}`)
        } catch (stderr) {
          console.log(`stderr: ${stderr}`)
        }
    }*/
    terminal.session.setValue('') // Clean terminal
    compiled = makefile = false
    editor.session.setValue(data['language'][my_settings['current-language']]['example'])
    language = my_settings['current-language']
    file_name = ''
    path_file = ''
  }

  if(language == 'Python' || language == 'Choose a language')  
    button_compiler.setAttribute('class', 'button is-dark is-static')
  else  
    button_compiler.setAttribute('class', 'button is-warning')
  if(language == 'Choose a language'){
    button_runner.setAttribute('class', 'button is-success is-static')
  }else{  
    button_runner.setAttribute('class', 'button is-success')
  }
  if(my_settings['terminal-position'] == 'right'){
  terminal_panel.style.top = '40px'
  terminal_panel.style.right = '0%'
  terminal_panel.style.bottom = '0%'
  terminal_panel.style.left = '60%'

  editor_panel.style.top = '40px'
  editor_panel.style.right = '40%'
  editor_panel.style.bottom = '0%'
  editor_panel.style.left = '0%'

  } else if(my_settings['terminal-position'] == 'left'){
  terminal_panel.style.top = '40px'
  terminal_panel.style.right = '60%'
  terminal_panel.style.bottom = '0%'
  terminal_panel.style.left = '0%'

  editor_panel.style.top = '40px'
  editor_panel.style.right = '0%'
  editor_panel.style.bottom = '0%'
  editor_panel.style.left = '40%'
  } else if(my_settings['terminal-position'] == 'up'){
  terminal_panel.style.top = '40px'
  terminal_panel.style.right = '0%'
  terminal_panel.style.bottom = '70%'
  terminal_panel.style.left = '0%'

  editor_panel.style.top = '30%'
  editor_panel.style.right = '0%'
  editor_panel.style.bottom = '0%'
  editor_panel.style.left = '0%'
  } else if(my_settings['terminal-position'] == 'down'){
  terminal_panel.style.top = '70%'
  terminal_panel.style.right = '0%'
  terminal_panel.style.bottom = '0%'
  terminal_panel.style.left = '0%'

  editor_panel.style.top = '40px'
  editor_panel.style.right = '0%'
  editor_panel.style.bottom = '30%'
  editor_panel.style.left = '0%'
  }
}

// Load current settings
applySettings()
