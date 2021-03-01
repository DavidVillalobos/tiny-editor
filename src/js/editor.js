/* 
    File:   editor.js
    Author: Luis David Villalobos Gonzalez
    Date: 01/03/2021
*/

// ================ REQUIREMENTS ============
const fs = require('fs');

// ================ ACE EDITOR ==================
var editor = ace.edit('editor');

// ============== TERMINAL ==================
var terminal = ace.edit('terminal');

// ========= EDITOR AND TERMINAL PANEL ==================
var editor_panel =  document.getElementById('editor');
var terminal_panel =  document.getElementById('terminal');

// ============= VARIABLES ==================
var file_active = 0; // position
var files = []

// ============= PATHS ==================
var relative_path = '' //'resources/app/' // when package app
var path_data = relative_path + 'src/config/data.json'
var path_settings = relative_path + 'src/config/settings.json'

// ============= SETTINGS AND DATA ==================
var data = JSON.parse(fs.readFileSync(path_data));
var my_settings = JSON.parse(fs.readFileSync(path_settings));
// ============= FUNCTIONS ================

function init_editor(){
  loadFileTabs();
  //Load editor options
  editor_panel.style.position = 'absolute'
  editor.setOptions({
    readOnly : false,
    autoScrollEditorIntoView : true,
    highlightActiveLine : true,
    showGutter : true,
    showPrintMargin : false
  });
  editor.commands.addCommand({
    name: 'Save',
    bindKey: {win: 'Ctrl-S'},
    exec: function(editor) {
      button_save.click()
    }
  });
  editor.commands.addCommand({
    name: 'Save As',
    bindKey: {win: 'Ctrl-G'},
    exec: function(editor) {
      button_save_as.click()
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
  editor.commands.addCommand({
    name: 'Settings',
    bindKey: {win: 'Ctrl-W'},
    exec: function(editor) {
      button_settings.click()
    }
  });
  editor.commands.addCommand({
    name: 'New File',
    bindKey: {win: 'Ctrl-N'},
    exec: function(editor) {
      button_new_file.click()
    },
  });
  editor.commands.addCommand({
    name: 'Open File',
    bindKey: {win: 'Ctrl-O'},
    exec: function(editor) {
      button_open_file.click()
    },
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
  
  // editor mousewheel
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
      my_settings = JSON.parse(fs.readFileSync(path_settings));
      my_settings['fontSize-editor'] = actual;
      fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8')
    }
  }, { passive: false });
  // terminal mousewheel
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
      my_settings = JSON.parse(fs.readFileSync(path_settings));
      my_settings['fontSize-terminal'] = actual;
      fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8')
    }
  }, { passive: false });
  
  // DRAG AND DROP FILE
  document.addEventListener('drop', (event) => { 
    event.preventDefault(); 
    event.stopPropagation(); 
    for (const f of event.dataTransfer.files) { 
        // Using the path attribute to get absolute file path 
        //console.log('File Path of dragged files: ', f.path)  
        let index = already_is_open(f['path'], f['name'])
        if(index != -1){
          showFile(index);
          break;
        }
        files.push({ // add file to editor (session file)
          name: f['name'],
          path: f['path'].split(f['name'])[0],
          language: 'Choose a language', 
          highlighter: 'text', 
          text: fs.readFileSync(f['path'], { encoding : 'UTF-8'}) // content
        });
        loadFileTabs()
        showFile(files.length - 1); 
    } 
  });

  document.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
  }); 
  // apply settings
  applySettings()
}


// Apply settings
function applySettings(){
  if(!fs.existsSync(path_settings)){
    fs.writeFileSync(path_settings, JSON.stringify({'current-language':'Choose a language','fontSize-editor':18,'fontSize-terminal':18,'tabSize-editor':4,'highlighter':'text','theme':'monokai','dark-mode':true, 'integrated-console':true,'terminal-position':'right'}), 'UTF-8');
  } 
  my_settings = JSON.parse(fs.readFileSync(path_settings));
  // 'dark-mode' : 'true'
  // 'integrated-console' : 'true'
  editor_panel.style.fontSize = my_settings['fontSize-editor'] + 'px'
  terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + 'px'
  editor.session.setTabSize(my_settings['tabSize-editor'])
  editor.setTheme('ace/theme/' + my_settings['theme'])
  if(files.length == 0){ // not files in editor 
    files.push({ // load default example
      name: 'Test' + data['language'][my_settings['current-language']]['extension'],
      path: '', 
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

// init editor
init_editor()
