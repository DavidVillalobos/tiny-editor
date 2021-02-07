const dirTree = require('directory-tree');
const http = require('http');
const colors = require('colors');

const port = '8080';
const hostname = '127.0.0.1';

const line_horizontal = '-'
const line_vertical = '|'
const start_folder = '+'
const end_folder = '+'
const fill = ' '

function printDirectoryTree(myTree, levels) {
	let result = '';
	let size = myTree['children'].length - 1;
	let i = 0;
	for (let branch of myTree['children']) {
		for (let level = 0; level < levels.length-1; level++) {
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
		}
		result += branch['name'] + '\n';
		if(branch['children']) { // branch has child?
			let aux_levels = [...levels]
			aux_levels.push([aux_levels.length-1, true])
			result += printDirectoryTree(branch, aux_levels);
		}
		i += 1
	}
	return result
}

http.createServer( (request, response) => {
	console.log(`New request URL : ${request.url}`.yellow)
	if(request.url == '/'){
		response.writeHead(200, {
			'Content-Type': 'text/plain',
		});
		let tree = dirTree('./', {extensions:/\.*$/});
		response.write(printDirectoryTree(tree, [[0, true]]))
		console.log(`Request Success :D`.green)
		response.end();
	} else {
		response.writeHead(404, {
			'Content-Type': 'text/plain',
		});
		response.write('Error 404: Not found')
		console.log(`Request failed :c`.red)
		response.end();
	}
}).listen(port, hostname, () => {
	console.log(`The server was running in http://${hostname}:${port}/`.green);
	console.log('Press ctrl + C to stop server'.blue);
});
