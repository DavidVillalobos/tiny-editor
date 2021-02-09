/*
	File: index.js
	Date: 2021/02/09
	Author: DavidVillalobos
*/
// Requirements
const dirTree = require('directory-tree');
const http = require('http');
const fs = require('fs');
const colors = require('colors');

const port = '8080';
const hostname = '127.0.0.1';

// For generate tree is
const folder_path = 'C:\\Users\\luisd\\Desktop\\Test';
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
	console.log(`New request URL : ${request.url}`.white) 
	let html = fs.readFileSync('index.html')
	if(html){
		response.writeHead(200, { 'Content-Type': 'text/html', });
		response.write(generateHTML())
		console.log(`Request Success :D`.green)
	}else{
		response.writeHead(404, { 'Content-Type': 'text/html', });
		response.write(`<h1 style="color: red;">File index not found<h1>`)
		console.log(`File index not found`.red)
		console.log(`Request Failed :c`.red)
	}
	response.end();  
}).listen(port, hostname, () => {
	console.log(`The server was running in http://${hostname}:${port}/`.green);
	console.log('Press ctrl + C to stop server'.blue);
});

function printDirectoryTree(myTree, levels) {
	let result = '';
	let size = myTree['children'].length - 1;
	let i = 0;
	for (let branch of myTree['children']) {
		/*for (let level = 0; level < levels.length-1; level++) {
			if (levels[level][1]) {
				result += line_vertical;
			} else {
				result += fill.repeat(2);
			}
			result += fill;
		}
		if (i < size) {
			result += start_folder + line_horizontal;
		} else {
			result += end_folder + line_horizontal;
			levels[levels.length-1][1] = false; // close directory in this level
		}*/
		result += '<a class="panel-block is-active">'+
		//'    <span class="panel-icon">'+
		//'        <i class="fas fa-book" aria-hidden="true"></i>'+
		//'    </span>'+
		'    ' + branch['path'].split(folder_path + '\\')[1] + 
		'</a>'
		if(branch['children']) { // branch has child?
			let aux_levels = [...levels]
			aux_levels.push([aux_levels.length-1, true])
			result += printDirectoryTree(branch, aux_levels);
		}
		i += 1
	}
	return result
}

function generateHTML(){
	let tree = dirTree(folder_path, { extensions : ext } );
	if(!tree) return '<h1 style="color: red;">Path not found<h1>'
	return '<!DOCTYPE html>'+
	'<html lang="en">'+
	'<head>'+
	'	<meta charset="UTF-8">'+
	'	<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
	'	<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
	'	<title>Document</title>'+
	'	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">'+
	'	<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>'+
	'</head>'+
	'<body>'+
	'	<div class="columns">'+
	'		<div class="column is-2">'+
	'			<nav class="panel is-warning">'+
	'				<p class="panel-heading">'+
	'					' + folder_name + 
	'				</p>'+
	'				<div class="panel-block">'+
	'					<p class="control has-icons-left">'+
	'						<input class="input" type="text" placeholder="Search">'+
	'						<span class="icon is-left">'+
	'							<i class="fas fa-search" aria-hidden="true"></i>'+
	'						</span>'+
	'					</p>'+
	'				</div>'+
					printDirectoryTree(tree, [[0, true]]) +
	'			</div>'+
	'			</nav>'+
	'		</div>'+
	'	</body>'+
	'</html>'
}