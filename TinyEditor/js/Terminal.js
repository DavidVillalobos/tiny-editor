var terminal = ace.edit("terminal");
terminal.setTheme("ace/theme/terminal");
terminal.session.setMode("ace/mode/python");
document.getElementById('terminal').style.fontSize='16px';
terminal.setReadOnly(true);
terminal.setHighlightActiveLine(false);
terminal.renderer.setShowGutter(false);
terminal.setAutoScrollEditorIntoView(true);
terminal.setShowPrintMargin(false);