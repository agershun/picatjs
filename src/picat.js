import {lexer} from './Lexer.js';
import {parser} from './Parser.js';
import {PiDatabase} from './PiDatabase.js';
import {PiInt} from './PiInt.js';
import {PiTerm} from './PiTerm.js';
import {PiList} from './PiList.js';

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

    return {result:db.query(goal),database:db, goal};


    // switch(mode) {
    //     case 'log':
    //         return;
    //     case '*':
    //         return db.query(goal);
    //     case '*map':
    //         return function*(){
    //             for(let a of db.query(goal)) {
    //                 yield a.match(goal);
    //             }
    //         };
    //     case 'map':
    //         function* one(){
    //             for(let a of db.query(goal)) {
    //                 let m = a.match(goal);
    //                 let obj = {};
    //                 m.forEach((key,value)=>{obj[value.name]=key.val});
    //                 yield obj;
    //             }
    //         };
    //         return [...one()];
    //     default: 
    //         return [...db.query(goal)];
    // }
    // return 

}

picat.log = function(prog,que) {
    let {result} = picat(prog,que);
    let est = true;
    for (var item of result) {
        est = false;
        console.log(item.toString()+'.');
        //console.log(item);
    }
    
    if (est) {
      console.log('No solutions');
    }
}

picat.out = function(prog,que) {

    const tmpConsoleLog = console.log;
    const tmpProcessWrite = process.stdout.write;

    let ss = '';
    console.log = function(s){ ss += s+'\n'; };
    process.stdout.write = function(s){ ss += s; };
    let {result} = picat(prog,que);
    let r = [...result];

    console.log = tmpConsoleLog;
    process.stdout.write = tmpProcessWrite;

    return ss;
}

picat.genvar = function (prog,que) {
    let {result,goal} = picat(prog,que);
    function* one(){
        for(let a of result) {
            let m = a.match(goal);
            let obj = {};

            m.forEach((key,value)=>{
                // console.log(72,key.val,value.name);
                function kr(key) {
                    if(key instanceof PiInt) {
                        return key.val;
                    } else if(key instanceof PiList) {
                        return key.items.map(d=>kr(d));
                    } else if(key instanceof PiTerm) {
                        return key.args.map(d=>kr(d));
                    }
                }
                obj[value.name]=kr(key);
            });
    // console.log(67,m,obj);
            yield obj;
        }
    };
    return one();
}

picat.var = function (prog,que) {
    let result = picat.genvar(prog,que);
       return [...result];
}

picat.genstr = function(prog,que) {
    let {result} = picat(prog,que);
    return (function*(){
        for(let a of result) {
            yield a.toString();
        };
    })();
}

picat.str = function (prog,que) {
    let result = picat.genstr(prog,que);
       return [...result];
}

picat.all = function(prog,que) {
    let {result} = picat(prog,que);    
    return [...result];
}

