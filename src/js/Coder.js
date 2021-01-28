/* 
  File:   coder.js
  Author: Luis David Villalobos Gonzalez
  Date:   28/01/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const fs = require('fs');
const { exec } = require('child_process');

// =/=/=/=/=/=/=/=/ EDITOR =/=/=/=/=/=/=/=/=/
var editor = ace.edit("editor")
editor.setReadOnly(false);
editor.setHighlightActiveLine(true);
editor.renderer.setShowGutter(true);
editor.setAutoScrollEditorIntoView(false);
editor.setShowPrintMargin(true);

// =/=/=/=/=/=/=/ TERMINAL =/=/=/=/=/=/=/=/=/
var terminal = ace.edit("terminal");
terminal.setTheme("ace/theme/terminal");
terminal.session.setMode("ace/mode/c_cpp");
terminal.setReadOnly(true);
terminal.setHighlightActiveLine(false);
terminal.renderer.setShowGutter(false);
terminal.setAutoScrollEditorIntoView(true);
terminal.setShowPrintMargin(false);

// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_compiler = document.getElementById("button-compiler");
var button_runner = document.getElementById("button-runner");
var button_settings = document.getElementById("button-settings");
var button_save_settings = document.getElementById("button-save-settings");
var button_close_settings = document.getElementById("button-close-settings");

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

// =/=/=/=/=/=/= MODE =/=/=/=/=/=/=/=/
var radio_mode = document.getElementById("mode");

// =/=/=/=/= EDITOR PANEL =/=/=/=/=/=/=/=/=/
var editor_panel =  document.getElementById("editor")
editor_panel.style.position = "absolute"
var terminal_panel =  document.getElementById("terminal")
terminal_panel.style.position = "absolute"

// =/=/=/=/=/=/= VARIABLES =/=/=/=/=/=/=/=/=/
var compiled = false
var makefile = false
var file_name = ''
// =/=/=/=/=/=/= PATHS =/=/=/=/=/=/=/=/=/
// final path: resources/app/
var path_data = 'config/data.json'
var path_codes = 'codes/'
var path_settings = 'config/settings.json'

// =/=/=/=/=/=/= CONFIGURATION DATA =/=/=/=/=/=/=/=/=/
var data = JSON.parse(fs.readFileSync(path_data));

// =/=/=/=/=/=/= FUNCTIONS =/=/=/=/=/=/=/=/

function loadSelects(){
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

// Load selects
loadSelects()

// Onchange text in editor
editor_panel.onchange = function(event){
  compiled = false
}

// Onchange programming language
select_language.onchange = function(event){
  if(select_language.value != "Choose a language") 
    exec(data['command']['clean'], (err, stdout, stderr) => {});
  terminal.session.setValue('')
  compiled = makefile = false
  editor.session.setMode("ace/mode/" + data['language'][select_language.value]['highlighter'])
  editor.session.setValue(data['language'][select_language.value]['example'])
  if(select_language.value == 'Python')  button_compiler.setAttribute("class", "button is-dark is-static")
  else  button_compiler.setAttribute("class", "button is-link")
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
      return "all:\n" + "run:\n" + "\tcls && title Tiny Editor/Run/" + file_name + " && python " + file_name + ".py\n" + "clean:\n"
}

// Compile code (Save file, create makefile and compile file)
button_compiler.onclick = function(event){
  if(select_language.value == "Choose a language") return
  if(select_language.value != "Python") button_compiler.setAttribute("class", "button is-link is-loading")
  file_name = 'Test'
  if(!makefile) fs.writeFile(path_codes +'makefile', generate_makefile(), 'UTF-8', function(err){console.log(err)})
  makefile = true
  fs.writeFile(path_codes + file_name + data['language'][select_language.value]['extension'], 
  editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
  exec(data['command']['compile'], (err, stdout, stderr) => {
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
    exec(data['command']['run'], (err, stdout, stderr) => {
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

function applySettings(){
  // if not settings does not exist apply default
  if(!fs.existsSync(path_settings))
    fs.writeFile(path_settings, JSON.stringify({"fontSize-editor":"18","fontSize-terminal":"18","tabSize-editor":"4","highlighter":"text","theme":"monokai","mode":"light","terminal-position":"right"}), 'UTF-8', function(){applySettings();})
  else{
    var my_settings = JSON.parse(fs.readFileSync(path_settings));
    // "mode" : "dark"
    // "terminal-position" : "right"
    editor_panel.style.fontSize = my_settings['fontSize-editor'] + "px"
    terminal_panel.style.fontSize = my_settings['fontSize-terminal'] + "px"
    editor.session.setTabSize(my_settings['tabSize-editor'])
    editor.setTheme("ace/theme/" + my_settings['theme'])
    editor.session.setMode("ace/mode/" + my_settings['highlighter'])
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




// Apply settings
button_save_settings.onclick = function(event) {
  // Save settings modal -> settings.json
  
  var  my_settings = JSON.parse(fs.readFileSync(path_settings));
  my_settings['fontSize-editor'] = input_editorFontSize.value
  my_settings['fontSize-terminal'] = input_terminalFontSize.value
  my_settings['tabSize-editor'] = input_editorTabSize.value
  my_settings['highlighter'] = select_highlighter.value
  my_settings['theme'] = select_theme.value
  my_settings['terminal-position'] = select_terminal_position.value
  fs.writeFile(path_settings, JSON.stringify(my_settings), 'UTF-8', function(){applySettings();})
  document.getElementById("modal").setAttribute("class", "modal")
}


// Load current settings
applySettings()

// Load current settings for language
select_language.onchange()

button_settings.onclick = function() {
  // Show settings settings.json -> modal
  var my_settings = JSON.parse(fs.readFileSync(path_settings));
  input_editorFontSize.value = my_settings['fontSize-editor']
  input_terminalFontSize.value = my_settings['fontSize-terminal']
  input_editorTabSize.value = my_settings['tabSize-editor']
  select_highlighter.value = my_settings['highlighter']
  select_theme.value = my_settings['theme']
  select_terminal_position.value = my_settings['terminal-position']  
  // "mode" : "dark",
  document.getElementById("modal").setAttribute("class", "modal is-active")
  
}

button_close_settings.onclick = function() {
	document.getElementById("modal").setAttribute("class", "modal")
}