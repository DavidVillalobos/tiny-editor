/* 
    File:   EditorManager.js
    Author: Luis David Villalobos Gonzalez
    Date: 20/02/2021
*/

// ================ REQUIREMENTS ============

const fs = require('fs');// File Module
const { execSync } = require('child_process');// Exec Module
const {dialog} = require('electron').remote;// Dialog Module
const path = require('path');// Path Module

// ================ EDITOR ==================
var editor = ace.edit('editor')

// ============== TERMINAL ==================
var terminal = ace.edit('terminal');

// ============= BUTTONS ====================
var button_save = document.getElementById('button-save');
var button_compiler = document.getElementById('button-compiler');
var button_runner = document.getElementById('button-runner');
var button_settings = document.getElementById('button-settings');
var button_save_settings = document.getElementById('button-save-settings');
var button_close_settings = document.getElementById('button-close-settings');

// ============= SETTINGS ================
// =========== NUMBERS ================
var input_editorFontSize = document.getElementById('editorFontSize');
var input_terminalFontSize = document.getElementById('terminalFontSize');
var input_editorTabSize = document.getElementById('editorTabSize');
// =========== SELECTS ================
var select_highlighter = document.getElementById('highlighter');
var select_theme = document.getElementById('theme');
var select_terminal_position = document.getElementById('terminalPosition');
var select_language = document.getElementById('languages')
// ============= CHECKBOX ================
var checkbox_dark_mode = document.getElementById('dark-mode');
var checkbox_integrated_console = document.getElementById('integrated-console');

// ========= EDITOR PANEL ==================
var editor_panel =  document.getElementById('editor')
var terminal_panel =  document.getElementById('terminal')
// ============= VARIABLES ==================
var compiled = false
var clean = true
var on_change_language = true
var file_name = ''

// ============= PATHS ==================
// final path: resources/app/
var path_file = ''
var path_data = 'src/config/data.json'
var path_settings = 'src/config/settings.json'

// ============= CONFIGURATION DATA ==================
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

  //  Load select languages
  var langs = []
  for(var lang in data['language']){
    var opt = document.createElement('option')
    opt.value= lang
    opt.innerHTML = lang
    select_language.appendChild(opt)
    langs.push(lang) // Add name language
  }
  // In settings
  //  Load select highlighter
  var arr = Object.values(data['language'])
  for(var i in arr){
    var opt = document.createElement('option')
    opt.value = arr[i]['highlighter']
    if(langs[i] != 'Choose a language')
      opt.innerHTML =  langs[i] // Use the name language
      else
      opt.innerHTML =  'Simple Text'

    select_highlighter.appendChild(opt)
  }
  //  Load select theme
  for(var theme of data['themes']){
    var opt = document.createElement('option')
    opt.value = theme
    opt.innerHTML = theme
    select_theme.appendChild(opt)
  }
  //  Load select position of terminal
  for(var pos of data['terminal-position']){
    var opt = document.createElement('option')
    opt.value = pos
    opt.innerHTML = pos
    select_terminal_position.appendChild(opt)
  }
}

init_simple_editor()

// Onchange text in editor
editor_panel.onkeypress = function(event){
  compiled = false
}

editor_panel.onclick = function(event){
  if(file_name == ''){
    titlebar.updateTitle( 'untitled - ' + 'Tiny Editor');
  }else{
    let extension = data['language'][select_language.value]['extension']
    titlebar.updateTitle(path.join(path_file + '\\' + file_name) + extension + ' - ' + 'Tiny Editor');
  }
}

function save_file(){
  // No need save file if you want compile, except if is java, because
  if(path_file == '' && select_language.value != 'Java'){ // file_name need be same class_name
    file_name = 'Test' + data['language'][select_language.value]['extension']
    path_file = path.join(__dirname + '\\..\\..\\codes')
  }
  let extension = data['language'][select_language.value]['extension']
  if(path_file == ''){
    let result = dialog.showSaveDialogSync({ 
      title: 'Select the File Path to save', 
      defaultPath: path.join(process.env.userprofile, 'Desktop'), 
      filters: [
        { name: select_language.value, extensions: [extension.slice(1, 5)] }
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
  if(select_language.value == 'Choose a language') 
    return
  if(select_language.value != 'Python') 
    button_compiler.setAttribute('class', 'button is-warning is-loading')
    terminal.session.setValue('Compiling . . . :o')
  // Save changes
  if(save_file()){
    // Compile code
    try{
      var compiler = data['language'][select_language.value]['compiler'] + ' ' + file_name;
      if(select_language.value == 'C++'){
        compiler += ' -o ' + file_name.split('.')[0];
      }
      let stdout = execSync('cd ' + path_file + ' && ' + compiler);
      console.log(`stdout: ${stdout}`)
      if(select_language.value != 'Python') 
        terminal.session.setValue('Compilation success :D')
      compiled = true
      clean = false
    }catch(stderr){
      console.log(`stderr: ${stderr}`) 
      terminal.session.setValue('Compilation error :c\n Check the following syntax for:\n' + stderr)
      compiled = false
    }
    if(select_language.value != 'Python') 
      button_compiler.setAttribute('class', 'button is-warning')
  }
}

// Run code (Run makefile)
button_runner.onclick = function(event) {
  terminal.session.setValue('')
  if(select_language.value == 'Python'){
    button_compiler.click()
    compiled = true
  }
  if(!compiled)
    button_compiler.click()
  if(compiled){
    try {
      let runner = data['language'][select_language.value]['runner'] + ' ';
      if(select_language.value == 'C++'){
        runner += file_name.split('.')[0];
      }else{
        runner += file_name
      }
      let stdout = execSync('cd ' + path_file + ' && start ' + runner)
      console.log(`stdout: ${stdout}`)
      terminal.session.setValue(stdout) // this go to terminal 
    } catch (stderr) {
      console.log(`stderr: ${stderr}`)
      terminal.session.setValue(stderr) // this go to terminal
    }
  }
}


// Apply settings
function applySettings(){
  // if settings does not exist, apply default settings
  if(!fs.existsSync(path_settings)){
    fs.writeFileSync(path_settings, JSON.stringify({'current-language':'Choose a language','fontSize-editor':18,'fontSize-terminal':18,'tabSize-editor':4,'highlighter':'text','theme':'monokai','dark-mode':true, 'integrated-console':true,'terminal-position':'right'}), 'UTF-8');
    applySettings();
  } else { 
    var my_settings = JSON.parse(fs.readFileSync(path_settings));
    // 'dark-mode' : 'true'
    // 'integrated-console' : 'true'
    editor_panel.style.fontSize = my_settings['fontSize-editor'] + 'px'
    terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + 'px'
    editor.session.setTabSize(my_settings['tabSize-editor'])
    editor.setTheme('ace/theme/' + my_settings['theme'])
    editor.session.setMode('ace/mode/' + my_settings['highlighter'])
    if(on_change_language){
      if(!clean){
        try {
          let stdout = execSync('cd ' + path_file + ' && del' + file_name);
          console.log(`stdout: ${stdout}`)
        } catch (stderr) {
          console.log(`stderr: ${stderr}`)
        }
      }
      terminal.session.setValue('') // Clean terminal
      compiled = makefile = false
      editor.session.setValue(data['language'][my_settings['current-language']]['example'])
      select_language.value = my_settings['current-language']
      file_name = ''
      path_file = ''
    }
    
    if(select_language.value == 'Python' || select_language.value == 'Choose a language')  
      button_compiler.setAttribute('class', 'button is-dark is-static')
    else  
      button_compiler.setAttribute('class', 'button is-warning')
    if(select_language.value == 'Choose a language'){
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
}

// Save settings modal -> settings.json  
button_save_settings.onclick = function(event) {
  var  my_settings = JSON.parse(fs.readFileSync(path_settings));
  my_settings['fontSize-editor'] = input_editorFontSize.value
  my_settings['fontSize-terminal'] = input_terminalFontSize.value
  my_settings['tabSize-editor'] = input_editorTabSize.value
  my_settings['highlighter'] = select_highlighter.value
  my_settings['theme'] = select_theme.value
  my_settings['terminal-position'] = select_terminal_position.value
  on_change_language = my_settings['current-language'] != select_language.value  
  my_settings['current-language'] = select_language.value
  my_settings['dark-mode'] = checkbox_dark_mode.checked
  my_settings['integrated-console'] = checkbox_integrated_console.checked
  fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8')
  applySettings()
  document.getElementById('modal').setAttribute('class', 'modal')
}


// Show settings settings.json -> modal
button_settings.onclick = function() {
  var my_settings = JSON.parse(fs.readFileSync(path_settings));
  input_editorFontSize.value = my_settings['fontSize-editor']
  input_terminalFontSize.value = my_settings['fontSize-terminal']
  input_editorTabSize.value = my_settings['tabSize-editor']
  select_highlighter.value = my_settings['highlighter']
  select_theme.value = my_settings['theme']
  select_terminal_position.value = my_settings['terminal-position']  
  select_language.value = my_settings['current-language']  
  checkbox_dark_mode.checked = my_settings['dark-mode']
  checkbox_integrated_console.checked = my_settings['integrated-console']
  document.getElementById('modal').setAttribute('class', 'modal is-active')
}

button_close_settings.onclick = function() {
	document.getElementById('modal').setAttribute('class', 'modal')
}

// Load current settings
applySettings()

