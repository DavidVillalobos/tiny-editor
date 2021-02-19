/* 
    File:   Includer.js
    Author: Luis David Villalobos Gonzalez
    Date: 19/02/2021
*/

let module_fs = require('fs');// File Module

for(let include_div of document.querySelectorAll('include')){
    let path_file = __dirname + '\\' + include_div.getAttribute('src');
    if(module_fs.existsSync(path_file)){
        include_div.innerHTML += module_fs.readFileSync(path_file,'utf-8'); 
    }else{
        console.log('Error not found file in location: ' + path_file)
        include_div.innerHTML += '<p style="color: red;">Error: not found file in location: ' + path_file + '</p>'
    }
}