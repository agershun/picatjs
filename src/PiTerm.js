import {PiRule} from './PiRule.js';
import {PiVar} from './PiVar.js';
import {PiInt} from './PiInt.js';
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

    value(database) {
        if(this.functor == 'eval') {
    //        console.log(224,this.args[0]);
    //        if(this.args[0] instanceof Term && this.args[0].functor == '$') {
                return this.args[0].value(database);
    //        }
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
        } else if(this.functor == '==') {
            console.log(44);
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
                console.log(59);
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

    //                console.log(294,head.toString(),'=',body.toString());
                    //return body.value();
   //                 console.log(295,body.value());
                    return body.value(database);
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
        return this.functor + '(' + this.args.join(', ') + ')';
    }
}
