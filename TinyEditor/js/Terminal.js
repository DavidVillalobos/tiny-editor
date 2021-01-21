/* 
File: Terminal.js
Author: Luis David Villalobos Gonzalez
Date: 21/01/2021
*/

var terminal = ace.edit("terminal");
terminal.setTheme("ace/theme/terminal");
terminal.session.setMode("ace/mode/python");
document.getElementById('terminal').style.fontSize='14px';
terminal.setReadOnly(true);
terminal.setHighlightActiveLine(false);
terminal.renderer.setShowGutter(false);
terminal.setAutoScrollEditorIntoView(true);
terminal.setShowPrintMargin(false);

