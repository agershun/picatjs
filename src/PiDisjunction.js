import {PiInt} from './PiInt.js';
import {PiBool} from './PiBool.js';
import {PiTerm} from './PiTerm.js';
import {PiConjunction} from './PiConjunction.js';
import {mergeBindings} from './utils.js';

export class PiDisjunction extends PiTerm {
    constructor(args) {
        // console.log('PD 9',args);
        super(';',args);
        //this.args = args;
    }

    *query(database) {
        for(let arg of args) {
            yield* arg.query(database);
        }            

//console.log(11);    
/*
        var self = this;
        function* solutions(index, bindings) {
            var arg = self.args[index];
            if (!arg) {
                yield self.substitute(bindings);
            } else {
                for (var item of database.query(arg.substitute(bindings))) {
                    var unified = mergeBindings(arg.match(item), bindings);
                    if (unified) {
                        yield* solutions(index + 1, unified);
                    }
                }
            }
        }
        yield* solutions(0, new Map);
  */
    };

    substitute(bindings) {
//        console.log('PiDisjunction,39',this,bindings);
        return new PiDisjunction(this.args.map(function(arg) {
//            console.log(42,arg);
            return arg.substitute(bindings);
        }));
    };

    inst(env) {
        return new PiDisjunction(this.args.map(x => x.inst(env)));
    }

    toString() {
        return this.args.join(';');
    }

/*
    value(database) {
        let res = false;
        let lastVal;
        for(let arg of this.args) {
            lastVal = arg.value(database);
            if(lastVal instanceof PiInt || lastVal instanceof PiBool) {
                res = res || lastVal.val;
            } else {

            }
            if(res) break;
        }
        //console.log(58,lastVal);
        if(res) return lastVal;
    }
*/    
    value(database) {
        let aa = [];
        for(let arg of this.args) {
            aa.push(arg.value(database));
        }
        return new PiDisjunction(aa);
    }

}
