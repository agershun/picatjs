import {PiRule} from './PiRule.js';
import {PiVar} from './PiVar.js';
import {PiInt} from './PiInt.js';
import {PiList} from './PiList.js';
//import {PiConjunction} from './PiConjunction.js';
import {TRUE,FAIL,PiBool} from './PiBool.js';
import {zip,mergeBindings} from './utils.js';


export class PiTerm {
    constructor(functor, args) {
        this.functor = functor;
        this.args = args || [];
    }

    inst (env) {
        return new PiTerm(this.functor, this.args.map(x => x.inst(env)));
    }    

    *iter(database) {
        if(this.functor == 'range') {
            var r0 = this.args[0].value(this);
            var r1 = this.args[1].value(this);
            var r2 = this.args.length == 3?this.args[2].value(this):{val:1n};

            if(r0 instanceof PiInt && r1 instanceof PiInt) {
                for(var i=r0.val; i<=r1.val; i+=r2.val) {
                    yield new PiInt(i);
                }
            } else {
                // error
                //if(r0.value() == r1.value()) yield goal;
            }
        }
    }

    value(database) {
        if(this.functor == 'eval') {
    //        console.log(224,this.args[0]);
    //        if(this.args[0] instanceof Term && this.args[0].functor == '$') {
                return this.args[0].value(database);
    //        }

        } else if(this.functor == 'range') {
             // console.log(42,'range',[...this.iter(database)]);
            return new PiList([...this.iter(database)]);

        } else if(this.functor == 'even') {
            let r = this.args[0].value(database);
            if(r instanceof PiInt) {
                console.log(26,r);
                return (r.val % 2n) == 0 ?TRUE:FAIL;
            }
        } else if(this.functor == 'odd') {
            let r = this.args[0].value(database);
            if(r instanceof PiInt) {
                return (r.val % 2n) == 1 ?TRUE:FAIL;
            }
        } else if(this.functor == 'prime') {
            let r = this.args[0].value(database);
            if(r instanceof PiInt) {

                function sqrt(value) {
                    if (value < 0n) {
                        throw 'square root of negative numbers is not supported'
                    }

                    if (value < 2n) {
                        return value;
                    }

                    function newtonIteration(n, x0) {
                        const x1 = ((n / x0) + x0) >> 1n;
                        if (x0 === x1 || x0 === (x1 - 1n)) {
                            return x0;
                        }
                        return newtonIteration(n, x1);
                    }

                    return newtonIteration(value, 1n);
                }                
                const isPrime = num => {
                    if(num == 1n || num == 2n) return true;
                    //console.log(59,sqrt(num)+1n);
                    for(let i = 2n, s = sqrt(num)+1n; i <= s; i++) {
                        if(num % i == 0) return false; 
                    }
                    return num > 1;
                } 
                //console.log(62,r.val,isPrime(r.val));
                return isPrime(r.val)?TRUE:FAIL;          
            }
        } else if(['print','println'].includes(this.functor)) {
                return TRUE;
        } else if(this.functor == '$') {
            return this.args[0];
        } else if(this.functor == '=') {
            let r0 = this.args[0],r1 = this.args[1];
            if(r0 instanceof PiVar || r1 instanceof PiVar ) {
                throw('*** error(instantiation_error,(+)/2)');
            }
            if( r0 instanceof PiTerm) {
                r0 = r0.value(database);
            }
            if( r1 instanceof PiTerm) {
                r1 = r1.value(database);
            }
            if(r0 instanceof PiInt && r1 instanceof PiInt) {
//                console.log(38,r0,r1,r0.val == r1.val);
                if(r0.val == r1.val) return TRUE; else return FAIL;
//                return new Integer(r0.val + r1.val);    
            } else {
                console.log(227,'not a Integer');
            }
        } else if(this.functor == '++') {
            let r0 = this.args[0].value(database),r1 = this.args[1].value(database);
            if(r0 instanceof PiList && r1 instanceof PiList) {
                return new PiList(r0.items.concat(r1.items));
            } else if(r0 instanceof PiList) {
                   return new PiList(r0.items.slice().concat([r1]));
            } else if(r1 instanceof PiList) {
                   return new PiList([r1].concat(r0.items));
            }

        } else if(this.functor == '==') {
            let r0 = this.args[0],r1 = this.args[1];
            if(r0 instanceof PiVar || r1 instanceof PiVar ) {
                throw('*** error(instantiation_error,(+)/2)');
            }
            if( r0 instanceof PiTerm || r0 instanceof PiList ) {
                r0 = r0.value(database);
            }
            if( r1 instanceof PiTerm || r1 instanceof PiList) {
                r1 = r1.value(database);
            }
            if(r0 instanceof PiInt && r1 instanceof PiInt) {
//                console.log(38,r0,r1,r0.val == r1.val);
                if(r0.val == r1.val) return TRUE; else return FAIL;
//                return new Integer(r0.val + r1.val);    
            } else if(r0 instanceof PiList && r1 instanceof PiList) {
                if(r0.items.length != r1.items.length) return FAIL;
                if(r0.tail != r1.tail) return FAIL;
                let ok = true;
                for(let d of zip([r0.items,r1.items])) {
                    let v0 = d[0].value(database);
                    let v1 = d[1].value(database);
                    if(v0.constructor != v1.constructor || v0.val != v1.val) {
                        ok = false;
                        break;
                    }                    
                }
                return ok?TRUE:FAIL;

            } else {
                console.log(227,'not a Integer');
            }
        } else if(this.functor == '+') {
            let r0 = this.args[0],r1 = this.args[1];
            if(r0 instanceof PiVar || r1 instanceof PiVar ) {
                throw('*** error(instantiation_error,(+)/2)');
            }
            if( r0 instanceof PiTerm) {
                r0 = r0.value(database);
            }
            if( r1 instanceof PiTerm) {
                r1 = r1.value(database);
            }
            if(r0 instanceof PiInt && r1 instanceof PiInt) {
                return new PiInt(r0.val + r1.val);    
            } else {
                console.log(227,'not a Integer');
            }
            
        } else if(this.functor == '-') {
            let r0 = this.args[0],r1 = this.args[1];
            if(r0 instanceof PiVar || r1 instanceof PiVar ) {
                throw('*** error(instantiation_error,(+)/2)');
            }
            if( r0 instanceof PiTerm) {
                r0 = r0.value(database);
            }
            if( r1 instanceof PiTerm) {
                r1 = r1.value(database);
            }
            if(r0 instanceof PiInt && r1 instanceof PiInt) {
                return new PiInt(r0.val - r1.val);    
            } else {
                console.log(227,'not a Integer');
            }
        } else if(this.functor == '*') {
            let r0 = this.args[0],r1 = this.args[1];
            if(r0 instanceof PiVar || r1 instanceof PiVar ) {
                throw('*** error(instantiation_error,(+)/2)');
            }
            if( r0 instanceof PiTerm) {
                r0 = r0.value(database);
            }
            if( r1 instanceof PiTerm) {
                r1 = r1.value(database);
            }
            if(r0 instanceof PiInt && r1 instanceof PiInt) {
                return new PiInt(r0.val * r1.val);    
            } else {
                console.log(227,'not a Integer');
            }
        } else if(this.functor == '/') {
            if(this.args[0] instanceof PiInt && this.args[1] instanceof PiInt) {
                return new PiInt(this.args[0].value(database) / this.args[1].value(database));    
            } else {
                console.log(227,'not a number +');
            }
        } else {
            // Попробовать найти как цель
    //        console.log('Пробуем доказать');
            let ars = [];
            for(let arg of this.args) {
                ars.push(arg.value(database));
            }
    //        console.log(308,ars);
            let pat = new PiTerm(this.functor,ars);

            for (var i = 0, rule; rule = database.rules[i]; i++) {
                var fresh = rule.inst(new Map);
        //        console.log(334,fresh);
        //        var fresh = rule;
                var match = fresh.head.match(pat);
        //        console.log(335,match);
                if (match) {
                    var head = fresh.head.substitute(match);
                    var body = fresh.body.substitute(match);

                    // console.log(294,head.toString(),'=',body.toString());
                    // console.log(295,body);
                    // if(body instanceof PiConjunction) {
                    //     let hbody = body.items.slice(0,body.items.length-1);
                    //     let hgoal = hbody.length > 1?new PiConjunction(hbody):hbody[0];
                    //     if(database.query(hgoal) == TRUE) {
                    //         let tbody = body.items[body.items.length-1];
                    //         return tbody.value(database);                            
                    //     }
                    // } else {
                    return body.value(database);
                    // }
                    //return body.value();
   //                 console.log(295,body.value());
                }
            }
            console.log(214, 'error: term value can not be calculated '+this.functor);
            return undefined;
        }
    }

    match(other) {

//        console.log(131);

        if (other instanceof PiTerm) {
            if (this.functor !== other.functor) {
                return null;
            }
            if (this.args.length !== other.args.length) {
                return null;
            }
            return zip([this.args, other.args]).map(function(args) {
                return args[0].match(args[1]);
            }).reduce(mergeBindings, new Map);
        }
        return other.match(this);
    }

    substitute(bindings) {
        return new PiTerm(this.functor, this.args.map(function(arg) {
            return arg.substitute(bindings);
        }));
    }

    *query(database) {
        yield* database.query(this);
    }

    toString() {
        if (this.args.length === 0) {
            return this.functor;
        }
        return this.functor + '(' + this.args.join(',') + ')';
    }
}
