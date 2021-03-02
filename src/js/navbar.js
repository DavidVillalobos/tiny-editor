/* 
    File:   navbar.js
    Author: Luis David Villalobos Gonzalez
    Date: 01/03/2021
*/
// ================ REQUIREMENTS ============
const { BrowserWindow } = require('electron').remote;
const { exec, execSync } = require('child_process');// Exec Module
const {dialog} = require('electron').remote;// Dialog Module
const path = require('path');// Path Module
const { remote } = require('electron'); 
// ================ WINDOWS ==================
//var win = remote.getCurrentWindow();
let settings_win = undefined;

// ========= BUTTONS ==================
var button_save = document.getElementById('button-save');
var button_save_as = document.getElementById('button-save-as');
var button_compiler = document.getElementById('button-compiler');
var button_runner = document.getElementById('button-runner');
var button_settings = document.getElementById('button-settings');
var button_new_file = document.getElementById('button-new-file');
var button_open_file = document.getElementById('button-open-file');

// ========= FILETABS ==================
var file_tabs = document.getElementById("filetabs")

function showFile(index){
    files[file_active]['text'] = editor.session.getValue(); // save preview tabfile data
    //console.log(files[new_active_file]);
    file_active = index;
    editor.session.setValue(files[file_active]['text'])
    editor.session.setMode('ace/mode/' + files[file_active]['highlighter'])
    if(files[file_active]['path'] == '') titlebar.updateTitle( 'untitled - ' + 'Tiny Editor');
    else titlebar.updateTitle(path.join(files[file_active]['path'] + '\\' + files[file_active]['name']) + ' - ' + 'Tiny Editor');
}
  
function closeFile(index){
    // save active file? . . .
    if(file_active == index) editor.session.setValue('')
    files.splice(index, 1);
    if(files.length == 0){ // not files in editor 
        files.push({ // load welcome file
          name: 'Test.txt',
          path: path.join(__dirname + '\\..\\..\\codes'), // default location, 
          language: undefined, 
          highlighter: 'text', 
          text: data['language']['Choose a language']['example']
       });
        editor.session.setValue(files[file_active]['text']);
    }
    if(file_active == index) file_active = 0;
    else if (file_active != 0) file_active--;
    showFile(file_active);
    loadFileTabs();
}
  
function getIcon(lang){
    var result = '<span> <i class="'
    if(lang == undefined) {
        result += 'fas fa-folder-open'
    } else if(lang == 'C++'){
    result += 'fab fa-cuttlefish'
    } else if(lang == 'Python'){ 
    result += 'fab fa-python'
    } else if(lang == 'Java'){ 
    result += 'fab fa-java'
    } else {
    result += 'fas fa-file'
    }
    result += '"> </i> </span>'
    return result	
}

function loadFileTabs(){
    file_tabs.innerHTML = '';
    for(let i in files){
        file_tabs.innerHTML +=  '<button class="button" value="' + i + '" onClick="showFile(this.value)">' + getIcon(files[i]['language']) + '&nbsp;' + files[i]['name'] + '</button>'
        file_tabs.innerHTML +=  '<button class="button" value="' + i + '" onClick="closeFile(this.value)"><i class="fas fa-times"></i></button>';
    }
}

function already_is_open(file_path, file_name){
    for(let i in files){
        if(files[i]['name'] == file_name && files[i]['path'] ==  file_path){
            return i;
        }
    }
    return -1;
}

button_new_file.onclick = function(event){
    let result = dialog.showSaveDialogSync({ 
        title: 'Selecciona la ubicacion para guardar el archivo', 
        defaultPath: path.join(process.env.userprofile, 'Desktop'), 
        filters: [
        { name: 'untitled'}
        ]
    });
    if(result != undefined){ 
        let aux_path = result.split('\\');    
        files.push({
            name: aux_path[aux_path.length - 1],
            path: result.split('\\' + aux_path[aux_path.length - 1])[0], 
            language: 'Choose a language', 
            highlighter: 'text', 
            text: '' 
        });
        loadFileTabs()
        showFile(files.length - 1); 
    }
}
  
button_open_file.onclick = function(event){
    let result = dialog.showOpenDialogSync({ 
    title: 'Selecciona la ubicacion del archivo', 
    defaultPath: path.join(process.env.userprofile, 'Desktop'),
    properties : ['multiSelections']
    });
    if(result != undefined){
        for(let file of result){
            let aux_path = file.split('\\');
            let file_name = aux_path[aux_path.length - 1];
            let file_path = file.split('\\' + file_name)[0];
            let index = already_is_open(file_path, file_name)
            if(index != -1){
                showFile(index);
                break;
            }
            let lang = undefined;
            let highligh = 'text';
            for(let i in data['language']){
                if(data['language'][i]['extension'] == '.' + file_name.split('.')[1]){
                    lang = i;
                    highligh = data['language'][i]['highlighter'];
                    break;
                }
            }
            // Add file to editor (session file)
            files.push({ 
                name: file_name,
                path: file_path, 
                language: lang, 
                highlighter: highligh, 
                text: fs.readFileSync(file_path + '\\' + file_name, { encoding : 'UTF-8'}) // content
            });
            loadFileTabs();
            showFile(files.length - 1); 
        }
    }
}

async function save_file(){
    let extension = data['language'][files[file_active]['language']]['extension']
    if(files[file_active]['path'] == ''){
        let result = dialog.showSaveDialogSync({ 
        title: 'Selecciona la ubicacion para guardar el archivo', 
        defaultPath: path.join(process.env.userprofile, 'Desktop'), 
        filters: [
            { name: 'untitled', extensions: [extension.slice(1, 5)] }
            ]
        });
        if(result == undefined) return false;
        let aux_path = result.split('\\');
        files[file_active]['name'] = aux_path[aux_path.length - 1];
        files[file_active]['path'] = result.split('\\' + files[file_active]['name'])[0];
    }
    await fs.writeFile(files[file_active]['path'] + '\\' +  files[file_active]['name'], editor.session.getValue(), {encoding : 'UTF-8', flag: 'w'}, ()=>{})
    loadFileTabs()
    showFile(file_active)
    return true;
}

// Save file
button_save.onclick = function(event){
    save_file()
} 

// Save as file
button_save_as.onclick = function(event){
    files[file_active]['name'] = files[file_active]['path'] = ''
    save_file();
}

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function compile_code(){
    // No need save file if you want compile, except if is java, because
    if(files[file_active]['path'] == '' && files[file_active]['language'] != 'Java'){ // the file_name need be same class_name
        files[file_active]['name'] = 'Test' + data['language'][files[file_active]['language']]['extension'] // default name
        files[file_active]['path'] = path.join(__dirname + '\\..\\..\\codes') // default location
    }
    if(files[file_active]['language'] != 'Python'){
        button_compiler.setAttribute('class', 'button is-warning is-loading')
        button_runner.setAttribute('class', 'button is-success is-static')
    }
    // Compile code
    let save_changes = await save_file();
    if(save_changes){ // Save changes
        if(files[file_active]['language'] == 'Python') return true;
        var compiler = data['language'][files[file_active]['language']]['compiler'] + ' ' + files[file_active]['name'];
        if(files[file_active]['language'] == 'C++') compiler += ' -o ' + files[file_active]['name'].split('.')[0];
        terminal.session.setValue('Compiling . . . :o');
        try{
            await wait(100);
            execSync(compiler, {cwd: files[file_active]['path']});
            button_compiler.setAttribute('class', 'button is-warning');
            button_runner.setAttribute('class', 'button is-success');
            terminal.session.setValue(compiler + '\nCompilation success :D')
            return true;
        }catch(err){
            button_compiler.setAttribute('class', 'button is-warning');
            button_runner.setAttribute('class', 'button is-success');
            terminal.session.setValue(compiler + '\nCompilation error :c\n Check the following syntax for:\n' + err)
            return false;
        }
    }
}
  
// Compile code (compile file)
button_compiler.onclick = function(event){
    compile_code();
}

// Run code
button_runner.onclick = async function(event) {
    let compiled = await compile_code();
    if(files[file_active]['language'] == 'Python' || compiled){
        let runner = data['language'][files[file_active]['language']]['runner'];
        runner += (files[file_active]['language'] != 'C++')? files[file_active]['name'] : files[file_active]['name'].split('.')[0];
        terminal.session.setValue("Run code with command:\n" + runner)
        if(my_settings['pause-end']) {
            runner += ' & cd ' + path.join(__dirname + '\\..\\config') + ' & pause.exe "'
        } else {
            runner += '"' 
        }
        await wait(100);
        exec('start "Tiny Editor" cmd /c "' + runner, {cwd: files[file_active]['path']},(error, stdout, stderr) => {
            if(error){
                console.log(`stderr: ${stderr}`)
            }
        });
    }
}
  
button_settings.onclick = function(event){
    if(!settings_win){
        settings_win = new BrowserWindow({
            show: false,
            icon: 'src/img/feather.ico',
            width: 800, 
            height: 430,
            resizable : false,
            frame: false,
            alwaysOnTop : true,
            webPreferences: {
                nodeIntegration: true, 
                enableRemoteModule: true
            }
        }); 
        settings_win.loadFile('src/html/settings.html');
        settings_win.once('ready-to-show', () => {
            settings_win.show()
        })  
        settings_win.on('closed', function(){
            settings_win = undefined;
            applySettings()
        });
    }
}