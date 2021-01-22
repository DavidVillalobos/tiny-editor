/* 
File: Editor.js
Author: Luis David Villalobos Gonzalez
Date: 15/12/2020
*/

var editor = ace.edit("editor");

editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/c_cpp");
editor.session.setTabSize(2);
editor.setAutoScrollEditorIntoView(true);
editor.setShowPrintMargin(false);

document.getElementById('editor').style.fontSize='20px';
