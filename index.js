/*
	File: index.js
	Date: 2021/02/10
	Author: David Villalobos
*/

// Requirements
const dirTree = require('directory-tree');
const http = require('http');
const fs = require('fs');
const colors = require('colors');

const port = '8080';
const hostname = '127.0.0.1';

// For generate tree is 
const folder_path = 'C:\\Users\\luisd\\Desktop\\Test'; // <-- Choose a path

let folder_name = folder_path.split("\\")[folder_path.split("\\").length-1]
const ext = /.*/; // filtered tree

// Design tree
const line_horizontal = '-'
const line_vertical = '|'
const start_folder = '+'
const end_folder = '+'
const fill = ' '

// Server
http.createServer( (request, response) => {
	console.log(`New request URL : ${request.url}`.yellow)
	if(request.url == '/'){ 
		response.writeHead(200, { 'Content-Type': 'text/html', });
		response.write(generateHTML())
		console.log(`Request Success :D`.green)
	}else if(request.url == '/css/style.css'){
		response.writeHead(200, { 'Content-Type': 'text/css', });
		response.write(fs.readFileSync('css/style.css'))
		console.log(`Request Success :D`.green)
	}
	response.end();  
}).listen(port, hostname, () => {
	console.log(`The server was running in http://${hostname}:${port}/`.green);
	console.log('Press ctrl + C to stop server'.blue);
});

function printDirectoryTree(myTree, levels) {
	let result = '';
	for (let branch of myTree['children']) {
		if(branch['type'] == 'directory'){
			result += '<button class="button is-white menu-label">' +
			'<span>' +
			'<i class="fas fa-angle-right has-text-info"></i>' +
		 	'</span>' +
			branch['name'] +
			'</button>' +
			'<ul class="menu-list">'
			if(branch['children']) { // branch has child? (is a directory)
				let aux_levels = [...levels]
				aux_levels.push([aux_levels.length-1, true])
				result += printDirectoryTree(branch, aux_levels)
			}
			result += '</ul>'
		}else{
			result += '<button class="button is-white">' +
			'<span>' +
			'	<i class="fas fa-file has-text-info"></i>' +
			'</span>' +    
			branch['name'] +
			'</button>'
		}
	}
	return result
}

function generateHTML(){
	let tree = dirTree(folder_path, { extensions : ext } );
	if(!tree) return '<h1 style="color: red;">Path not found<h1>'
	return '<!DOCTYPE html>' +
	'<html lang="es">' +
	'<head>' +
	'	<meta charset="UTF-8">' +
	'	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">' +
	'	<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>' +
	'	<link rel="stylesheet" href="css/style.css"/>' +
	'</head>' +
	'<body>' +
	'<nav class="panel is-info">' +
	'	<div class="menu-label panel-heading">' +
	'		' + folder_name +
	'	</div>' +
	'	<div class="panel-block" style=">' +
	'		<div class="menu">' +
	'	  	<ul class="menu-list">' +
	'			<li>' + printDirectoryTree(tree, [[0, true]]) + '</li>' +
	'	  	</ul>' +
	'		</div>' +
	'	</div>' +
	'</nav>' +
	'</body>' +
	'</html>'
}