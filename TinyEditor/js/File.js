var fs = require('fs');
const { exec } = require('child_process');
var compiled = false;

function compile(){
  fs.writeFile('File/main.cpp', editor.session.getValue(), 'UTF-8', function(err){console.log(err)})
  console.log(editor.session.getValue());
  var command = 'cd File && make'
  exec(command, (err, stdout, stderr) => {
    if(err){
      //console.log(stderr);
      console.log(`stderr: ${stderr}`); // this go to output error
      //console.error(`err: ${err}`);
      compiled = false;
    }else{
      //console.log(`stderr: ${stderr}`)
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
      compiled = true;
    }
  });
}

function run_program(){
  exec('start File/run.exe', (err, stdout, stderr) => {
    if(err){
      console.log(`stderr: ${stderr}`)
      //console.error(err)
    }else{
      console.log(stdout);
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
    }
  });
}

document.getElementById("button-compiler").onclick = function(event) {
  compile();
}


document.getElementById("button-run").onclick = function(event) {
  if(compiled){
    run_program();
  }
}






