import {PiInt} from './PiInt.js';
import {PiBool} from './PiBool.js';
import {PiTerm} from './PiTerm.js';
import {mergeBindings} from './utils.js';
import {PiDisjunction} from './PiDisjunction.js';

export class PiConjunction extends PiTerm {
    constructor(args) {
//console.log(10,args);        
        if(args.find(arg => arg instanceof PiTerm && arg.functor == ';')) {
//            console.log(8,args);
            let aad = [], ac = [];
            for(let arg of args) {
                if(arg.functor != ';') {
                    ac.push(arg);
                } else {
                    if(ac.length == 1) {
                        aad.push(ac[0]);
                    } else {
                        aad.push(new PiConjunction(ac));    
                    }
                    ac = [];
                }
            }
            if(ac.length == 1) {
                aad.push(ac[0]);
            } else {
                aad.push(new PiConjunction(ac));    
            }

            return new PiDisjunction(aad);
        }

        super(',',args);
        //this.args = args;
    }

    *query(database) {
//console.log(11);    

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
    };

    substitute(bindings) {
        return new PiConjunction(this.args.map(function(arg) {
            return arg.substitute(bindings);
        }));
    };

    inst(env) {
        return new PiConjunction(this.args.map(x => x.inst(env)));
    }

    toString() {
        return this.args.join(',');
    }
/*
    value(database) {
        let res = true;
        let lastVal;
        for(let arg of this.args) {
            lastVal = arg.value(database);
            if(lastVal instanceof PiInt || lastVal instanceof PiBool) {
                res = res && lastVal.val;
            } else {

            }
            if(!res) break;
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
        //return new PiConjunction(aa);
        return aa[aa.length-1];
    }

}
