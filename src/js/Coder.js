/* 
  File:   coder.js
  Author: Luis David Villalobos Gonzalez
  Date:   27/01/2021
*/

// =/=/=/=/=/=/=/=/ REQUIREMENTS =/=/=/=/=/=/
const fs = require('fs');
const { exec } = require('child_process')

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

// =/=/=/=/=/=/= VARIABLES =/=/=/=/=/=/=/=/=/
var compiled = false
var makefile = false
var file_name = ''

// =/=/=/=/=/=/= CONFIGURATION DATA =/=/=/=/=/=/=/=/=/
var data = JSON.parse(fs.readFileSync('config/data.json'));

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
    opt.innerHTML =  langs[i] // Use the name language
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
  file_name = 'Prueba'
  if(!makefile) fs.writeFile('codes/makefile', generate_makefile(), 'UTF-8', function(err){console.log(err)})
  makefile = true
  fs.writeFile('codes/' + file_name + data['language'][select_language.value]['extension'], 
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
  settings = JSON.parse(fs.readFileSync('config/settings.json'));
  
  // "mode" : "dark"
  // "terminal-position" : "right"
  document.getElementById('editor').style.fontSize = settings['fontSize-editor'] + "px"
  document.getElementById('terminal').style.fontSize = settings['fontSize-terminal'] + "px"
  editor.session.setTabSize(settings['tabSize-editor'])
  editor.setTheme("ace/theme/" + settings['theme'])
  editor.session.setMode("ace/mode/" + settings['highlighter'])
}



// Apply settings
button_save_settings.onclick = function(event) {
  // Save settings modal -> settings.json
  document.getElementById("modal").setAttribute("class", "modal")
  applySettings()

}

// Load current settings
applySettings()

// Load current settings for language
select_language.onchange()

button_settings.onclick = function() {
  // Show settings settings.json -> modal
  settings = JSON.parse(fs.readFileSync('config/settings.json'));
  document.getElementById("modal").setAttribute("class", "modal is-active")
  
}

button_close_settings.onclick = function() {
	document.getElementById("modal").setAttribute("class", "modal")
}