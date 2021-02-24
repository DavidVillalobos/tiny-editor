/* 
    File:   EditorManager.js
    Author: Luis David Villalobos Gonzalez
    Date: 24/02/2021
*/

// ================ REQUIREMENTS ============
const { BrowserWindow } = require('electron').remote;
const fs = require('fs');// File Module
const { execSync } = require('child_process');// Exec Module
const {dialog} = require('electron').remote;// Dialog Module
const path = require('path');// Path Module
const { remote } = require('electron'); 

// ================ WINDOWS ==================
var win = remote.getCurrentWindow();
let settings_win = undefined;

// ================ ACE EDITOR ==================
var editor = ace.edit('editor');

// ============== TERMINAL ==================
var terminal = ace.edit('terminal');

// ============= BUTTONS ====================
var button_save = document.getElementById('button-save');
var button_compiler = document.getElementById('button-compiler');
var button_runner = document.getElementById('button-runner');
var button_settings = document.getElementById('button-settings');
var button_new_file = document.getElementById('button-new-file');

// ========= FILETABS ==================
var file_tabs = document.getElementById("filetabs")

// ========= EDITOR PANEL ==================
var editor_panel =  document.getElementById('editor');
var terminal_panel =  document.getElementById('terminal');

// ============= VARIABLES ==================
var file_active = 0; // position
var files = []

// ============= PATHS ==================
// final path: resources/app/
var path_data = 'src/config/data.json'
var path_settings = 'src/config/settings.json'

// ============= SETTINGS DATA ==================
var data = JSON.parse(fs.readFileSync(path_data));
// ============= FUNCTIONS ================

function showFile(new_active_file){
  files[file_active]['active'] = false;
  files[file_active]['text'] = editor.session.getValue(); // save preview data
  //console.log(files[new_active_file]);
  editor.session.setMode('ace/mode/' + files[file_active]['highlighter'])
  editor.session.setValue(files[new_active_file]['text'])
  files[new_active_file]['active'] = true;
  file_active = new_active_file;
}

function getIcon(lang){
	var result = '<span> <i class="'
	if(lang == undefined) {
		result += 'fas fa-folder-open'
	} else if(lang == 'C++'){
		result += 'fab fa-cuttlefish'
	} else if(lang == 'Python'){ 
		result += 'fab fa-python'
	} else if(lang == 'Java'){ 
		result += 'fab fa-java'
	} else {
		result += 'fas fa-file'
	}
	result += '"> </i> </span>'
	return result	
}

function loadFileTabs(){
  file_tabs.innerHTML = '';
  for(let i in files){
    file_tabs.innerHTML +=  '<button class="button is-dark" value="' + i + '" onClick="showFile(this.value)">' + getIcon(files[i]['language']) + '&nbsp;' + files[i]['name'] + '</button>';
  }
}

function init_simple_editor(){
  loadFileTabs();
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
  editor_panel.onclick = function(event){ save_changes = compiled = false }
  
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

button_new_file.onclick = function(event){
  let result = dialog.showSaveDialogSync({ 
    title: 'Selecciona la ubicacion para guardar el archivo', 
    defaultPath: path.join(process.env.userprofile, 'Desktop'), 
    filters: [
      { name: 'untitled', extensions: data['language'][files[file_active]['language']]['extension']}
     ]
  });
  if(result != undefined){ 
    let aux_path = result.split('\\');    
    files.push({
      active: false, 
      name: aux_path[aux_path.length - 1],
      path: result.split('\\' + aux_path[aux_path.length - 1])[0], 
      compiled : false, 
      save_changes : false, 
      language: 'Choose a language', 
      highlighter: 'text', 
      text: '' 
    });
    loadFileTabs()
    showFile(files.length - 1); 
  }
}

function save_file(){
  let extension = data['language'][files[file_active]['language']]['extension']
  if(files[file_active]['path'] == ''){
    let result = dialog.showSaveDialogSync({ 
      title: 'Selecciona la ubicacion para guardar el archivo', 
      defaultPath: path.join(process.env.userprofile, 'Desktop'), 
      filters: [
        { name: 'untitled', extensions: [extension.slice(1, 5)] }
       ]
    });
    if(result == undefined){
      files[file_active]['file'] = files[file_active]['path'] = ''
      files[file_active]['save_changes'] = false;
    }
    let aux_path = result.split('\\');
    files[file_active]['name'] = aux_path[aux_path.length - 1];
    files[file_active]['path'] = result.split('\\' + file_name)[0];
  }
  fs.writeFileSync(files[file_active]['path'] + '\\' +  files[file_active]['name'], editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'})
  if(files[file_active]['name'] == '') titlebar.updateTitle( 'untitled - ' + 'Tiny Editor');
  else titlebar.updateTitle(path.join(files[file_active]['path'] + '\\' + files[file_active]['name']) + ' - ' + 'Tiny Editor');
  files[file_active]['save_changes'] = true
}

// Save file
button_save.onclick = function(event){
  file_name = path_file = ''
  compiled = false
  save_file()
} 

// Compile code (compile file)
button_compiler.onclick = function(event){
  if(files[file_active]['compiled']) {
    terminal.session.setValue('The code is already compiled')
    return;
  }
  // No need save file if you want compile, except if is java, because
  if(files[file_active]['path'] == '' && files[file_active]['language'] != 'Java'){ // the file_name need be same class_name
    files[file_active]['name'] = 'Test' + data['language'][files[file_active]['language']]['extension'] // default name
    files[file_active]['path'] = path.join(__dirname + '\\..\\..\\codes') // default location
  }
  button_compiler.setAttribute('class', 'button is-warning is-loading')
  button_runner.setAttribute('class', 'button is-success is-static')
  save_file();
  // Compile code
  if(files[file_active]['save_changes'] && files[file_active]['language'] != 'Python'){ // Save changes
    var compiler = data['language'][files[file_active]['language']]['compiler'] + ' ' + files[file_active]['name'];
    if(files[file_active]['language'] == 'C++') compiler += ' -o ' + files[file_active]['name'].split('.')[0] + '.exe';
    try{
      terminal.session.setValue('Compiling . . . :o')
      execSync(compiler, {cwd: files[file_active]['path']});
      terminal.session.setValue(compiler + '\nCompilation success :D')
      compiled = true
      clean = false
    }catch(stderr){
      terminal.session.setValue(compiler + '\nCompilation error :c\n Check the following syntax for:\n' + stderr)
      compiled = false
    }
  }
  button_compiler.setAttribute('class', 'button is-warning');
  button_runner.setAttribute('class', 'button is-success');
}

// Run code
button_runner.onclick = function(event) {
  button_compiler.click()
  if(files[file_active]['language'] == 'Python') compiled = true
  if(compiled){
    let runner = 'start ' + data['language'][files[file_active]['language']]['runner'] + ' ';
    runner += (files[file_active]['language'] != 'C++')? files[file_active]['name'] : files[file_active]['name'].split('.')[0] + '.exe';
    terminal.session.setValue("Run code with command:\n" + runner)
    try {
      execSync(runner, {cwd: files[file_active]['path']});
    } catch (stderr) {
      console.log(`stderr: ${stderr}`)
    }
  }
}

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
  if(!fs.existsSync(path_settings)){
    fs.writeFileSync(path_settings, JSON.stringify({'current-language':'Choose a language','fontSize-editor':18,'fontSize-terminal':18,'tabSize-editor':4,'highlighter':'text','theme':'monokai','dark-mode':true, 'integrated-console':true,'terminal-position':'right'}), 'UTF-8');
  } 
  let my_settings = JSON.parse(fs.readFileSync(path_settings));
  // 'dark-mode' : 'true'
  // 'integrated-console' : 'true'
  editor_panel.style.fontSize = my_settings['fontSize-editor'] + 'px'
  terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + 'px'
  editor.session.setTabSize(my_settings['tabSize-editor'])
  editor.setTheme('ace/theme/' + my_settings['theme'])
  if(files.length == 0){ // not files in editor 
    files.push({ // load default example
      active: true, 
      name: 'Test' + data['language'][my_settings['current-language']]['extension'],
      path: '', 
      compiled : false, 
      save_changes : false, 
      language: undefined, 
      highlighter: undefined, 
      text: data['language'][my_settings['current-language']]['example'] 
    });
    editor.session.setValue(files[file_active]['text']);
  }
  files[file_active]['language'] = my_settings['current-language'], 
  files[file_active]['highlighter'] = my_settings['highlighter'], 
  loadFileTabs(); // load new tab
  showFile(file_active);
  if(files[file_active]['language'] == 'Python' || files[file_active]['language'] == 'Choose a language')  
    button_compiler.setAttribute('class', 'button is-dark is-static')
  else  
    button_compiler.setAttribute('class', 'button is-warning')
  if(files[file_active]['language'] == 'Choose a language'){
    button_runner.setAttribute('class', 'button is-success is-static')
  }else{  
    button_runner.setAttribute('class', 'button is-success')
  }

  terminal_panel.style.top = editor_panel.style.top = '60px'
  terminal_panel.style.bottom = editor_panel.style.bottom = '0%'
  terminal_panel.style.left = terminal_panel.style.right = '0%'
  editor_panel.style.left = editor_panel.style.right = '0%'

  let percentOfEditor = 60;

  if(my_settings['terminal-position'] == 'right'){
    editor_panel.style.right = 100 - percentOfEditor + '%'
    terminal_panel.style.left = percentOfEditor + '%'
  } else if(my_settings['terminal-position'] == 'left'){
    editor_panel.style.left = 100 - percentOfEditor + '%'
    terminal_panel.style.right = percentOfEditor + '%'
  } else if(my_settings['terminal-position'] == 'up'){
    terminal_panel.style.bottom = percentOfEditor + '%'
    editor_panel.style.top = 100 - percentOfEditor + '%'
  } else if(my_settings['terminal-position'] == 'down'){
    terminal_panel.style.top = percentOfEditor + '%'
    editor_panel.style.bottom = 100 - percentOfEditor + '%'
  }
}

applySettings()