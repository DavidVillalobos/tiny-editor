/* 
File: config.js
Author: Luis David Villalobos Gonzalez
Date: 23/01/2021
*/

var settings = '';

button_settings.onclick = function(event) {
    // "color" : "dark"
    var data = fs.readFileSync('config/settings.json');
    settings = JSON.parse(data);
    console.log(settings);
    document.getElementById('editor').style.fontSize = settings.fontSize + "px"
    document.getElementById('terminal').style.fontSize = settings.fontSize-terminal + "px"
    editor.session.setTabSize(settings.tabSize)
    editor.setTheme("ace/theme/" + settings.theme)
    editor.session.setMode("ace/mode/" + settings.language)
}

button_settings.click()

