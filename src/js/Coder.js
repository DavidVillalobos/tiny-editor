/* 
File: Coder.js
Author: Luis David Villalobos Gonzalez
Date: 22/01/2021
*/

var fs = require('fs')
const { exec } = require('child_process')

var compiled = false
var makefile = false
var languages = { "C++":1, "Java":2, "Python":3}
var extensions = { "C++":".cpp", "Java":".java", "Python":".py"}
var language = ''
var file_name = ''
var button_compiler = document.getElementById("button-compiler");
var button_runner = document.getElementById("button-run");

// Onchange editor
document.getElementById("editor").onchange= function(event){
  compiled = false
}

// Onchange language
document.getElementById("languages").onchange= function(event){
  if(language != "Choose a language"){
    var command = 'cd codes && mingw32-make clean && del makefile && del ' + file_name + extensions[language]
    exec(command, (err, stdout, stderr) => {});
  }
  terminal.session.setValue('')
  compiled = makefile = false
  // Update language
  language = document.getElementById("languages").value
  button_compiler.setAttribute("class", "button is-link")
  // Update text in editor
  switch(languages[language]){
    case 1:
      editor.session.setValue('#include<iostream>\nusing namespace std;\nint main(){\n\tcout<<"Thank you very much for using Tiny Editor"<<endl;\n\tsystem("pause");\n}\n')
      break
    case 2:  
      editor.session.setValue('import java.util.Scanner;\nimport java.io.*;\npublic class Prueba{\n\tpublic static void main(String[] args){\n\t\tSystem.out.println("Thank you very much for using Tiny Editor");\n\t\tSystem.out.println("Press Any Key To Continue...");\n\t\tnew java.util.Scanner(System.in).nextLine();\n\t}\n}\n')
      break
    case 3:
      button_compiler.setAttribute("class", "button is-dark is-static")
      editor.session.setValue('print("Thank you very much for using Tiny Editor")\ninput("Press Any Key To Continue...")\n')
      break
    default:
      editor.session.setValue('\n\n\t\tThank you very much for using Tiny Editor\n\t\t\t Choose a language, write code, build and run\n\n')
      break
    }
}

// Returns the makefile for language
function generate_makefile(){
    let result = ''
    switch(languages[language]){
      case 1:
        result ="OBJS	= " + file_name + ".o\n" +
        "SOURCE	= " + file_name + ".cpp\n" +
        "HEADER	=\n"  +
        "OUT	= run.exe\n"  +
        "CC	 = g++\n"  +
        "FLAGS	 = -g -c -Wall\n"  +
        "LFLAGS	 =\n"  +
        "all: $(OBJS)\n"  +
        "\t$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)\n"  +
        "Prueba.o: Prueba.cpp\n"  +
        "\t$(CC) $(FLAGS) Prueba.cpp\n"  +
        "run:\n" +
        "\tcls && $(OUT)\n" +
        "clean:\n" +
        "\tdel $(OBJS) $(OUT)\n" 
        break
      case 2:  
        result ="JFLAGS = -g\n" +
        "JC = javac \n" +
        ".SUFFIXES: .java .class\n" +
        ".java.class:\n" +
        "\t$(JC) $(JFLAGS) $*.java\n" +
        "CLASSES = \\\n" +
        "\t" + file_name + ".java \n" +
        "MAINCLASS = \\\n" +
        "\t" + file_name + "\n" +
        "all: $(CLASSES:.java=.class)\n" +
        "run: \n" +
        "\tcls && java -cp . $(MAINCLASS)\n" +
        "clean:\n" +
        "\tdel $(CLASSES:.java=.class)\n"
        break
      case 3:
        result = "all:\n" +
        "run:\n" +
        "\tcls && python " + file_name + ".py\n" +
        "clean:\n"
        break
      default: break
    }
    return result
}

// COMPILE CODE
button_compiler.onclick = function(event){
  if(language != "Choose a language"){
    if(language != "Python"){
      button_compiler.setAttribute("class", "button is-link is-loading")
    }
    file_name = 'Prueba'
    if(makefile == false){
      // generate makefile and save makefile 
      fs.writeFile('codes/makefile', generate_makefile(), 'UTF-8', function(err){console.log(err)})
      makefile = true
    }
    // Save main file
    fs.writeFile('codes/' + file_name + extensions[language], editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
    var command = 'cd codes &&  mingw32-make'
    exec(command, (err, stdout, stderr) => {
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
        if(language == "Python"){
          terminal.session.setValue('')
        }else{
          terminal.session.setValue('Compilation success')
        }
        compiled = true
      }
      if(language != "Python"){
        button_compiler.setAttribute("class", "button is-link")
      }
    })
  }else{
    terminal.session.setValue('Choose a language!!!')
  }
}

// RUN CODE
button_runner.onclick = function(event) {
  if(language == "Python"){
    button_compiler.click()
    compiled = true
  }
  if(compiled){
    var command = 'cd codes && start mingw32-make run'
    terminal.session.setValue('')
    exec(command, (err, stdout, stderr) => {
      if(err){
        console.error(`err: ${err}`)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`) // this go to output and show the error
        terminal.session.setValue(stderr)
      }else{
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        terminal.session.setValue(stderr)
      }
    });
  }else{
    terminal.session.setValue('Need compile first!')
  }
}

// Default message
editor.session.setValue('\n\n\t\tThank you very much for using Tiny Editor\n\t\t\t Choose a language, write code, build and run\n\n')
language = document.getElementById("languages").value