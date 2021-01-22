/* 
File: Coder.js
Author: Luis David Villalobos Gonzalez
Date: 21/01/2021
*/

var fs = require('fs')
const { exec } = require('child_process')

var compiled = false
let extensions = { "C++":".cpp", "Java":".java", "Python":".py"}

document.getElementById("editor").onchange= function(event){
  this.compiled = false
}

document.getElementById("languages").onchange= function(event){
  terminal.session.setValue('')
  var language = document.getElementById("languages").value
  if(language == "C++"){
    editor.session.setValue('#include<iostream>\nusing namespace std;\nint main(){\n\tcout<<"Thank you very much for using Tiny Editor"<<endl;\n\tsystem("pause");\n}\n')
  }else if(language == "Python"){
    editor.session.setValue('print("Thank you very much for using Tiny Editor")\ninput("Press Any Key To Continue...")\n')
  }else if(language == "Java"){
    editor.session.setValue('import java.util.Scanner;\nimport java.io.*;\npublic class Prueba{\n\tpublic static void main(String[] args){\n\t\tSystem.out.println("Thank you very much for using Tiny Editor");\n\t\tSystem.out.println("Press Any Key To Continue...");\n\t\tnew java.util.Scanner(System.in).nextLine();\n\t}\n}\n')
  }else{
    editor.session.setValue('\n\n\t\tThank you very much for using Tiny Editor\n\t\t\t Choose a language, write code, build and run\n\n')
  }
}

function compile(){
  var language = document.getElementById("languages").value
  if(language != "Choose a language"){
    fs.writeFile('Codes/' + language +'/Prueba' + extensions[language], editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
    console.log(editor.session.getValue())
    var command = 'cd Codes/' + language +' &&  mingw32-make'
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
        terminal.session.setValue('Compilation success')
        compiled = true
      }
    })
  }
}

function run(){
  var language = document.getElementById("languages").value
  var command = 'cd Codes/' + language + ' && start mingw32-make run'
  terminal.session.setValue('')
  exec(command, (err, stdout, stderr) => {
    if(err){
      console.log(stderr)
      console.log(`stderr: ${stderr}`) // this go to output and show the error
      terminal.session.setValue(stderr)
      console.error(`err: ${err}`)
    }else{
      console.log(stdout);
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    }
  });
}

document.getElementById("button-compiler").onclick = function(event) {
  compile()
}

document.getElementById("button-run").onclick = function(event) {
  if(compiled){
    run()
  }else{
    compile()
    if(compiled){
      run()
    }
  }
}

editor.session.setValue('\n\n\t\tThank you very much for using Tiny Editor\n\t\t\t Choose a language, write code, build and run\n\n')
 