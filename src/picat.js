import {lexer} from './Lexer.js';
import {parser} from './Parser.js';
import {PiDatabase} from './PiDatabase.js';

export function picat(prog,que,mode) {
    if(!prog) prog = '';
    let rules = parser(lexer(prog)).parseRules();

    var db = new PiDatabase(rules);

//console.log(10,db.rules[0].body.args[1].args[0]);
    if(!que) {
        que = 'main';
    } else if(que instanceof Array) {
        que = `main(${JSON.stringify(que)})`;
    }

    let goal = parser(lexer(que)).parseGoal();

    // console.log(14,goal);

    //console.log(23,[...db.query(goal)]);


    switch(mode) {
        case 'verbose':
            let est = true;
            for (var item of db.query(goal)) {
                est = false;
                console.log(item.toString()+'.');
                //console.log(item);
            }
            
            if (est) {
              console.log('No solutions');
            }    
        case '*':
            return db.query(goal);
        default: 
            let res = [...db.query(goal)];
    }
    return res;

}
