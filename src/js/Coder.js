/* 
  File:   coder.js
  Author: Luis David Villalobos Gonzalez
  Date: 04/02/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/

const fs = require('fs');// File Module
const { exec } = require('child_process');// Exec Module
const {dialog} = require('electron').remote;// Dialog Module

// =/=/=/=/=/=/=/=/ EDITOR =/=/=/=/=/=/=/=/=/
var editor = ace.edit("editor")

// =/=/=/=/=/=/=/ TERMINAL =/=/=/=/=/=/=/=/=/
var terminal = ace.edit("terminal");

// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_save = document.getElementById("button-save");
var button_compiler = document.getElementById("button-compiler");
var button_runner = document.getElementById("button-runner");
var button_settings = document.getElementById("button-settings");
var button_save_settings = document.getElementById("button-save-settings");
var button_close_settings = document.getElementById("button-close-settings");

// =/=/=/=/=/=/= LABELS =/=/=/=/=/=/=/=/=/=/
var label_current_language = document.getElementById("current-language");

// =/=/=/=/=/=/= INPUTS =/=/=/=/=/=/=/=/=/=/

// =/=/=/=/=/=/= SETTINGS =/=/=/=/=/=/=/=/

// =/=/=/=/=/= NUMBERS =/=/=/=/=/=/=/=/
var input_editorFontSize = document.getElementById("editorFontSize");
var input_terminalFontSize = document.getElementById("terminalFontSize");
var input_editorTabSize = document.getElementById("editorTabSize");

// =/=/=/=/=/= SELECTS =/=/=/=/=/=/=/=/
var select_highlighter = document.getElementById("highlighter");
var select_theme = document.getElementById("theme");
var select_terminal_position = document.getElementById("terminalPosition");
var select_language = document.getElementById("languages")

// =/=/=/=/=/=/= CHECKBOX =/=/=/=/=/=/=/=/
var checkbox_dark_mode = document.getElementById("dark-mode");
var checkbox_integrated_console = document.getElementById("integrated-console");

// =/=/=/=/= EDITOR PANEL =/=/=/=/=/=/=/=/=/
var editor_panel =  document.getElementById("editor")
editor_panel.style.position = "absolute"
var terminal_panel =  document.getElementById("terminal")
terminal_panel.style.position = "absolute"

// =/=/=/=/=/=/= VARIABLES =/=/=/=/=/=/=/=/=/
var compiled = false
var on_change_language = true
var makefile = false
var file_name = ''
// =/=/=/=/=/=/= PATHS =/=/=/=/=/=/=/=/=/
// final path: resources/app/
var path_file = ''
var path_data = 'config/data.json'
var path_settings = 'config/settings.json'

// =/=/=/=/=/=/= CONFIGURATION DATA =/=/=/=/=/=/=/=/=/
var data = JSON.parse(fs.readFileSync(path_data));

// =/=/=/=/=/=/= FUNCTIONS =/=/=/=/=/=/=/=/

function init_tiny_editor(){
  // Load options
  editor.setOptions({
    readOnly : false,
    autoScrollEditorIntoView : false,
    highlightActiveLine : true,
    showGutter : true,
    showPrintMargin : true
  });
  terminal.setTheme("ace/theme/terminal");
  terminal.session.setMode("ace/mode/javascript");
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
    var opt = document.createElement("option")
    opt.value= lang
    opt.innerHTML = lang
    select_language.appendChild(opt)
    langs.push(lang) // Add name language
  }
  // In settings
  //  Load select highlighter
  var arr = Object.values(data['language'])
  for(var i in arr){
    var opt = document.createElement("option")
    opt.value = arr[i]['highlighter']
    if(langs[i] != "Choose a language")
      opt.innerHTML =  langs[i] // Use the name language
      else
      opt.innerHTML =  "Simple Text"

    select_highlighter.appendChild(opt)
  }
  //  Load select theme
  for(var theme of data['themes']){
    var opt = document.createElement("option")
    opt.value = theme
    opt.innerHTML = theme
    select_theme.appendChild(opt)
  }
  //  Load select position of terminal
  for(var pos of data['terminal-position']){
    var opt = document.createElement("option")
    opt.value = pos
    opt.innerHTML = pos
    select_terminal_position.appendChild(opt)
  }
}

init_tiny_editor()

// Onchange text in editor
editor_panel.onchange = function(event){
  compiled = false
}

function generate_makefile(){
  if(select_language.value == "C++")
      return "OBJS	= " + file_name + ".o\n" +
      "SOURCE	= " + file_name + ".cpp\n" + "HEADER	=\n"  + "OUT	= run.exe\n"  +
      "CC	 = g++\n" + "FLAGS	 = -g -c -Wall\n" + "LFLAGS	 =\n" + "all: $(OBJS)\n"  +
      "\t$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)\n" + "Prueba.o: Prueba.cpp\n"  +
      "\t$(CC) $(FLAGS) " + file_name + ".cpp\n" + "run:\n" +
      "\tcls && title Tiny Editor/Run/" + file_name + " && $(OUT)\n" + "clean:\n" + "\tdel $(OBJS) $(OUT)\n"
  else if (select_language.value == "Java") 
      return "JFLAGS = -g\n" + "JC = javac \n" + ".SUFFIXES: .java .class\n" +
      ".java.class:\n" + "\t$(JC) $(JFLAGS) $*.java\n" + "CLASSES = \\\n" +
      "\t" + file_name + ".java \n" + "MAINCLASS = \\\n" + "\t" + file_name + "\n" + 
      "all: $(CLASSES:.java=.class)\n" + "run: \n" + "\tcls && title Tiny Editor/Run/$(MAINCLASS) && java -cp . $(MAINCLASS)\n" +
      "clean:\n" + "\tdel $(CLASSES:.java=.class)\n"
  else if (select_language.value == "Python")
      return "all:\n" + "run:\n" + "\tcls && title Tiny Editor/Run/" + file_name + " && python -i " + file_name + ".py\n" + "clean:\n"
}

// Save file
button_save.onclick = function(event){
  var extension = data['language'][select_language.value]['extension']
  if(path_file == ''){
    dialog.showSaveDialog({ 
      title: 'Select the File Path to save', 
      defaultPath: 'C:\\Users\\' +  process.env.username + '\\Desktop\\Test', 
      filters: [
        { name: label_current_language.textContent, extensions: [extension.slice(1, 5)] }
       ]
    }).then(result => { 
      var aux_path = result.filePath.split('\\')
      file_name = aux_path[aux_path.length-1].split('.')[0]
      path_file = result.filePath.split(file_name)[0]
      fs.writeFile(path_file + file_name + extension, editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'}, function(err){console.log(err)})
    });
  }else{
    fs.writeFile(path_file + file_name + extension, editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'}, function(err){console.log(err)})
  }
} 

// Compile code (create makefile and compile file)
button_compiler.onclick = function(event){
  if(select_language.value == "Choose a language") return
  if(select_language.value != "Python") button_compiler.setAttribute("class", "button is-link is-loading")
  if(!makefile) fs.writeFile(path_file +'makefile', generate_makefile(), 'UTF-8', function(err){console.log(err)})
  makefile = true
  button_save.click() // Save file :D
  exec("cd " + path_file + " && " + data['command']['compile'], (err, stdout, stderr) => {
    if(err){
      console.log(stderr)
      console.log(`stderr: ${stderr}`) // this go to output and show the error
      terminal.session.setValue(stderr)
      console.error(`err: ${err}`)
      compiled = false
    }else{
      console.log(`stderr: ${stderr}`)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      if(select_language.value != "Python") terminal.session.setValue('Compilation success')
      compiled = true
    }
    if(select_language.value != "Python") button_compiler.setAttribute("class", "button is-link")
  })
}

// Run code (Run makefile)
button_runner.onclick = function(event) {
  if(select_language.value == "Python"){
    button_compiler.click()
    compiled = true
  } 
  if(compiled){
    terminal.session.setValue('')
    exec("cd " + path_file + " && " + data['command']['run'], (err, stdout, stderr) => {
      if(err){
        console.error(`err: ${err}`)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`) // this go to output and show the error
        terminal.session.setValue(stdout)
      }else{
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        terminal.session.setValue(stdout)
      }
    });
  }else{
    terminal.session.setValue('Need compile first!')
  }
}


// Apply settings
function applySettings(){
  // if settings does not exist, apply default
  if(!fs.existsSync(path_settings))
    fs.writeFile(path_settings, JSON.stringify({"current-language":"Choose a language","fontSize-editor":18,"fontSize-terminal":18,"tabSize-editor":4,"highlighter":"text","theme":"monokai","dark-mode":true, "integrated-console":true,"terminal-position":"right"}), 'UTF-8', function(){applySettings();})
  else{ 
    var my_settings = JSON.parse(fs.readFileSync(path_settings));
    // "dark-mode" : "true"
    // "integrated-console" : "true"
    // Change Editor fontSize
    editor_panel.style.fontSize = my_settings['fontSize-editor'] + "px"
    // Change Terminal fontSize
    terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + "px"
    // Change Editor TabSize
    editor.session.setTabSize(my_settings['tabSize-editor'])
    // Change Theme
    editor.setTheme("ace/theme/" + my_settings['theme'])
    // Change Highlighter
    editor.session.setMode("ace/mode/" + my_settings['highlighter'])
    // Change language? 
    if(on_change_language){
      exec("cd " + path_file + " && " + data['command']['clean'], (err, stdout, stderr) => {});
      terminal.session.setValue('') // Clean terminal
      compiled = makefile = false
      editor.session.setValue(data['language'][my_settings['current-language']]['example'])
      select_language.value = my_settings['current-language']
    }
    
    if(select_language.value == 'Python' || select_language.value == 'Choose a language')  
      button_compiler.setAttribute("class", "button is-dark is-static")
    else  
      button_compiler.setAttribute("class", "button is-link")
    if(select_language.value == 'Choose a language'){
      button_runner.setAttribute("class", "button is-success is-static")
      label_current_language.textContent = '' 
    }else{  
      button_runner.setAttribute("class", "button is-success")
      label_current_language.textContent = my_settings['current-language']
    }
    if(my_settings['terminal-position'] == 'right'){
      terminal_panel.style.top = "52px"
      terminal_panel.style.right = "0%"
      terminal_panel.style.bottom = "0%"
      terminal_panel.style.left = "60%"

      editor_panel.style.top = "52px"
      editor_panel.style.right = "40%"
      editor_panel.style.bottom = "0%"
      editor_panel.style.left = "0%"
      
    } else if(my_settings['terminal-position'] == 'left'){
      terminal_panel.style.top = "52px"
      terminal_panel.style.right = "60%"
      terminal_panel.style.bottom = "0%"
      terminal_panel.style.left = "0%"

      editor_panel.style.top = "52px"
      editor_panel.style.right = "0%"
      editor_panel.style.bottom = "0%"
      editor_panel.style.left = "40%"
    } else if(my_settings['terminal-position'] == 'up'){
      terminal_panel.style.top = "52px"
      terminal_panel.style.right = "0%"
      terminal_panel.style.bottom = "60%"
      terminal_panel.style.left = "0%"

      editor_panel.style.top = "40%"
      editor_panel.style.right = "0%"
      editor_panel.style.bottom = "0%"
      editor_panel.style.left = "0%"
    } else if(my_settings['terminal-position'] == 'down'){
      terminal_panel.style.top = "60%"
      terminal_panel.style.right = "0%"
      terminal_panel.style.bottom = "0%"
      terminal_panel.style.left = "0%"

      editor_panel.style.top = "52px"
      editor_panel.style.right = "0%"
      editor_panel.style.bottom = "40%"
      editor_panel.style.left = "0%"
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
  fs.writeFile(path_settings, JSON.stringify(my_settings), 'UTF-8', function(){applySettings();})
  document.getElementById("modal").setAttribute("class", "modal")
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
  document.getElementById("modal").setAttribute("class", "modal is-active")
  
}

button_close_settings.onclick = function() {
	document.getElementById("modal").setAttribute("class", "modal")
}

// Load current settings
applySettings()

