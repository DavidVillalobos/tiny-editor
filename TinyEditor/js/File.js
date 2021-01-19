/* 
File: File.js
Author: Luis David Villalobos Gonzalez
Date: 18/01/2021
*/

var fs = require('fs')
const { exec } = require('child_process')

var compiled = false
let extensions = { "C++":".cpp", 
                   "Java":".java",
                   "Python":".py"}

function changeEditor(){
  this.compiled = false
}

function changeLanguage(){
  var language = document.getElementById("lenguages").value
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
changeLanguage();
function compile(){
  var language = document.getElementById("lenguages").value
  fs.writeFile('File/' + language +'/Prueba' + extensions[language], editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
  console.log(editor.session.getValue())
  var command = 'cd File/' + language +' &&  mingw32-make'
  exec(command, (err, stdout, stderr) => {
    if(err){
      console.log(stderr)
      console.log(`stderr: ${stderr}`) // this go to output error
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

function run(){
  var language = document.getElementById("lenguages").value
  var command = 'cd File/' + language + ' && start mingw32-make run'
  exec(command, (err, stdout, stderr) => {
    if(err){
      console.log(`stderr: ${stderr}`)
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
