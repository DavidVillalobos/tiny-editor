/* 
  File:   coder.js
  Author: Luis David Villalobos Gonzalez
  Date:   24/01/2021
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
terminal.session.setMode("ace/mode/python");
document.getElementById('terminal').style.fontSize='14px';
terminal.setReadOnly(true);
terminal.setHighlightActiveLine(false);
terminal.renderer.setShowGutter(false);
terminal.setAutoScrollEditorIntoView(true);
terminal.setShowPrintMargin(false);

// =/=/=/=/=/=/= BUTTONS =/=/=/=/=/=/=/=/=/=/
var button_compiler = document.getElementById("button-compiler");
var button_runner = document.getElementById("button-runner");
var button_settings = document.getElementById("button-settings");

// =/=/=/=/= SELECT LANGUAGE =/=/=/=/=/=/=/=/
var select_language = document.getElementById("languages")

// =/=/=/=/= EDITOR PANEL =/=/=/=/=/=/=/=/=/
var editor_panel =  document.getElementById("editor")

// =/=/=/=/=/=/= VARIABLES =/=/=/=/=/=/=/=/=/
var compiled = false
var makefile = false
var file_name = ''

// =/=/=/=/=/=/= CONFIGURATION DATA =/=/=/=/=/=/=/=/=/
var data = JSON.parse(fs.readFileSync('config/data.json'));

// =/=/=/=/=/=/= FUNCTIONS =/=/=/=/=/=/=/=/

// Onchange text in editor
editor_panel.onchange = function(event){
  compiled = false
}

// Onchange programming language
select_language.onchange = function(event){
  if(select_language.value != "Choose a language") exec(data['command']['clean'] + file_name + '.*', (err, stdout, stderr) => {});
  terminal.session.setValue('')
  compiled = makefile = false
  editor.session.setMode(data[select_language.value]['syntax'])
  editor.session.setValue(data[select_language.value]['example'])
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
      "\tcls && $(OUT)\n" + "clean:\n" + "\tdel $(OBJS) $(OUT)\n"
  else if (select_language.value == "Java") 
      return "JFLAGS = -g\n" + "JC = javac \n" + ".SUFFIXES: .java .class\n" +
      ".java.class:\n" + "\t$(JC) $(JFLAGS) $*.java\n" + "CLASSES = \\\n" +
      "\t" + file_name + ".java \n" + "MAINCLASS = \\\n" + "\t" + file_name + "\n" + 
      "all: $(CLASSES:.java=.class)\n" + "run: \n" + "\tcls && java -cp . $(MAINCLASS)\n" +
      "clean:\n" + "\tdel $(CLASSES:.java=.class)\n"
  else if (select_language.value == "Python")
      return "all:\n" + "run:\n" + "\tcls && python " + file_name + ".py\n" + "clean:\n"
}

// Compile code (Save file, create makefile and compile file)
button_compiler.onclick = function(event){
  if(select_language.value == "Choose a language") return
  if(select_language.value != "Python") button_compiler.setAttribute("class", "button is-link is-loading")
  file_name = 'Prueba'
  if(!makefile) fs.writeFile('codes/makefile', generate_makefile(), 'UTF-8', function(err){console.log(err)})
  makefile = true
  fs.writeFile('codes/' + file_name + data[select_language.value]['extension'], editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
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
      if(select_language.value != "Python"){
        terminal.session.setValue('Compilation success')
      }
      compiled = true
    }
    if(select_language.value != "Python"){
      button_compiler.setAttribute("class", "button is-link")
    }
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

// Apply settings
button_settings.onclick = function(event) {
    // "color" : "dark"
    settings = JSON.parse(fs.readFileSync('config/settings.json'));
    console.log(settings);
    document.getElementById('editor').style.fontSize = settings.fontSize + "px"
    document.getElementById('terminal').style.fontSize = settings.fontSize-terminal + "px"
    editor.session.setTabSize(settings.tabSize)
    editor.setTheme("ace/theme/" + settings.theme)
    editor.session.setMode("ace/mode/" + settings.language)
}

// Load current settings
button_settings.click()

// Load current settings for language
select_language.onchange()
