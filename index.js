import {picat} from './src/picat.js';

import fs from 'fs';

let argv = [...process.argv].slice(2);

if((argv.length == 0) || (argv.length == 1 && (argv[0] == '-h' || argv[0] == '--help'))) {
console.log(
`PicatJs - Picat and Prolog programming languages in JavaScript (c) 2022 Andrey Gershun
picatjs <filename> [-g <goal>] [<parameters>...]`);

} else {
	let prog = fs.readFileSync(argv[1]).toString();
	if(argv.length == 1) {
		picat(prog,'main');	
	} else if(argv.length >= 2 && argv[0] == '-g') {
		picat(prog, argv[1], argv.slice(2));
	} else {
		picat(prog, argv[0], argv.slice(1));
	}
}
