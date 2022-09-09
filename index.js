import {picat} from './src/picat.js';

import fs from 'fs';

let argv = [...process.argv].slice(2);

if(argv.length == 0) {
	console.log(
`PicatJs - Picat programming language in JavaScript (c) 2022 Andrey Gershun
picat <filename> [-g <goal>] [<parameters>...]
`
)
} else if(argv.length == 1) {
	let prog = fs.readFileSync(argv[1]).toString();
	picat();	
}

console.log(5,argv);


