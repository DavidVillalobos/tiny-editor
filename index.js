const PATH = require('path');
const dirTree = require('directory-tree');

const tree = dirTree('./', {extensions:/\.txt$/}, null, (item, PATH, stats) => {
	console.log(item)	
});
