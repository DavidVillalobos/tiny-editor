/* 
    File:   settings.js
    Author: Luis David Villalobos Gonzalez
    Date: 01/03/2021
*/

// ================ REQUIREMENTS ============
const fs = require('fs');
const { remote } = require('electron') 

var settings_win = remote.getCurrentWindow();

// ============= PATH'S ==================
var relative_path = '' //'resources/app/' // when package app
var path_settings = relative_path + 'src/config/settings.json'
var path_data = relative_path + 'src/config/data.json'

// ============= DATA =================
var data = JSON.parse(fs.readFileSync(path_data));

// =========== BUTTONS ================
var button_save_settings = document.getElementById('button-save-settings')
var button_close_settings = document.getElementById('button-close-settings')
// =========== NUMBERS ================
var input_editorFontSize = document.getElementById('editorFontSize');
var input_terminalFontSize = document.getElementById('terminalFontSize');
var input_editorTabSize = document.getElementById('editorTabSize');

// =========== SELECTS ================
var select_highlighter = document.getElementById('highlighter');
var select_theme = document.getElementById('theme');
var select_terminal_position = document.getElementById('terminalPosition');
var select_language = document.getElementById('languages')

// ============= CHECKBOX ================
var checkbox_dark_mode = document.getElementById('dark-mode');
var checkbox_integrated_console = document.getElementById('integrated-console');
var checkbox_pause_end = document.getElementById('pause-end');

titlebar.updateTitle('Settings - Tiny Editor');

function load_settings(){  
    //  Load select languages
    let langs = []
    for(let lang in data['language']){
        let opt = document.createElement('option')
        opt.value= lang
        opt.innerHTML = lang
        select_language.appendChild(opt)
        langs.push(lang) // Add name language
    }
    // In settings
    //  Load select highlighter
    let arr = Object.values(data['language'])
    for(let i in arr){
        let opt = document.createElement('option')
        opt.value = arr[i]['highlighter']
        if(langs[i] != 'Choose a language')
            opt.innerHTML =  langs[i] // Use the name language
        else
            opt.innerHTML =  'Simple Text'
        select_highlighter.appendChild(opt)
    }
    //  Load select theme
    for(let theme of data['themes']){
        let opt = document.createElement('option')
        opt.value = theme
        opt.innerHTML = theme
        select_theme.appendChild(opt)
    }
    //  Load select position of terminal
    for(let pos of data['terminal-position']){
        let opt = document.createElement('option')
        opt.value = pos
        opt.innerHTML = pos
        select_terminal_position.appendChild(opt)
    }
    // Load settings from settings.json
    // if settings does not exist, create default settings
    if(!fs.existsSync(path_settings)){
        fs.writeFileSync(path_settings, JSON.stringify({
            'current-language' : 'Choose a language',
            'fontSize-editor' : 18,
            'fontSize-terminal' : 18,
            'tabSize-editor' : 4,
            'highlighter' : 'text',
            'theme' : 'monokai',
            'dark-mode' : true, 
            'integrated-console' : true,
            'terminal-position' : 'right',
            'pause-end' : true,
        }), 'UTF-8');
    } 
    let my_settings = JSON.parse(fs.readFileSync(path_settings));
    //console.log(path_settings)
    //console.log(my_settings)
    input_editorFontSize.value = my_settings['fontSize-editor']
    input_terminalFontSize.value = my_settings['fontSize-terminal']
    input_editorTabSize.value = my_settings['tabSize-editor']
    select_highlighter.value = my_settings['highlighter']
    select_theme.value = my_settings['theme']
    select_terminal_position.value = my_settings['terminal-position']  
    select_language.value = my_settings['current-language']  
    checkbox_dark_mode.checked = my_settings['dark-mode']
    checkbox_integrated_console.checked = my_settings['integrated-console']
    checkbox_pause_end.checked = my_settings['pause-end']
}

// load settings 
load_settings();

// Save settings   
button_save_settings.onclick = function(event) {
    let my_settings = JSON.parse(fs.readFileSync(path_settings));
    my_settings['fontSize-editor'] = input_editorFontSize.value;
    my_settings['fontSize-terminal'] = input_terminalFontSize.value;
    my_settings['tabSize-editor'] = input_editorTabSize.value;
    my_settings['highlighter'] = select_highlighter.value;
    my_settings['theme'] = select_theme.value;
    my_settings['terminal-position'] = select_terminal_position.value;
    on_change_language = my_settings['current-language'] != select_language.value ; 
    my_settings['current-language'] = select_language.value;
    my_settings['dark-mode'] = checkbox_dark_mode.checked;
    my_settings['integrated-console'] = checkbox_integrated_console.checked;
    my_settings['pause-end'] = checkbox_pause_end.checked;
    fs.writeFileSync(path_settings, JSON.stringify(my_settings), 'UTF-8');
    settings_win.close();
}

button_close_settings.onclick = function(event){
    settings_win.close();
}