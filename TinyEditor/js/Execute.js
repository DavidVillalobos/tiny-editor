const { exec } = require('child_process');

var command = 'make'
exec(command, (err, stdout, stderr) => {
	if(err){
		console.log(stderr);
		//console.log(`stderr: ${stderr}`);
		//console.error(err)
	}else{
		//console.log(`stderr: ${stderr}`)
		//console.log(`stdout: ${stdout}`);
		//console.log(`stderr: ${stderr}`);
		exec('run.exe', (err, stdout, stderr) => {
			if(err){
				console.log(`stderr: ${stderr}`)
				//console.error(err)
			}else{
				console.log(stdout);
				//console.log(`stdout: ${stdout}`);
				//console.log(`stderr: ${stderr}`);
			}
		});
	}
});