/*
File: index.js
Date: 2021/02/11
Author: David Villalobos
*/

const fs = require('fs');
const dirTree = require('directory-tree');
let directory_tree_panel = document.getElementById("directory-tree-panel");
let other_panel = document.getElementById("other-panel");

function getIcon(extension){
	var result = '<span> <i class="'
	if(extension == undefined) {
		result += 'fas fa-folder-open'
	} else if(extension == '.cpp' || extension == '.h'){
		result += 'fab fa-cuttlefish'
	} else if(extension == '.py'){ 
		result += 'fab fa-python'
	} else if(extension == '.java'){ 
		result += 'fab fa-java'
	} else {
		result += 'fas fa-file'
	}
	result += '"> </i> </span>'
	return result	
}


function printDirectoryTree(myTree, levels) {
	let result = '';
	for (let branch of myTree['children']) {
		result += '<button class="button has-text-white" value="' + branch['path'] + '" onclick="openFile(this.value)">' +
		getIcon(branch['extension']) + branch['name'] +
		'</button>'
		if(branch['type'] == 'directory'){
			result += '<ul class="menu-list">'
			if(branch['children']) { // branch has child? (is a directory)
				let aux_levels = [...levels]
				aux_levels.push([aux_levels.length-1, true])
				result += printDirectoryTree(branch, aux_levels)
			}
			result += '</ul>'
		}
	}
	return result
}

function generateTreePanel(folder_path){
	let folder_name = folder_path.split("\\")[folder_path.split("\\").length-1]
	let ext = /.*/; // filtered tree
	let tree = dirTree(folder_path, { extensions : ext } );
	if(tree){
		directory_tree_panel.innerHTML += '<div class="has-background-warning has-text-dark" style="margin-bottom: 8px">' +
	'		' + folder_name +
	'	</div>' +
	'	<ul class="menu-list" id="directory-content">' +
	'		<li>' + printDirectoryTree(tree, [[0, true]]) + '</li>' +
	'	</ul>'
	}else{
		directory_tree_panel.innerHTML += '<h1 style="color: red;">Path not found<h1>'
	}
}

generateTreePanel('C:\\Users\\luisd\\repos\\Tiny_Editor\\src'); // <-- Choose a path

function openFile(path_file){
	other_panel.value = fs.readFileSync(path_file)
}