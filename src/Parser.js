import {PiRule} from './PiRule.js';
import {PiFunc} from './PiFunc.js';
import {PiTerm} from './PiTerm.js';
import {PiVar} from './PiVar.js';
import {PiList} from './PiList.js';
import {PiInt} from './PiInt.js';
import {PiConjunction} from './PiConjunction.js';
import {TRUE,FAIL} from './PiBool.js';


export function parser(tokens) {
    var current, done, scope, prev;
    var ats = [];
    function next() {
        var next = tokens.next();
        prev = current;
        current = next.value;
        done = next.done;
    }
    function parseAtom() {
        var name = current;
        if (!/^[0-9A-Za-z_\+\-\*\/\=\!\>\<\$]+$/.test(name)) {
            throw new SyntaxError('Bad atom name: ' + name);
        }
        next();
        return name;
    }
    function parseTerm() {
        if (current === '(') {
            next(); // eat (
            var args = [];
            while (current !== ')') {
                args.push(parseTerm());

                if (current !== ',' && current !== ';' && current !== ')') {
                    throw new SyntaxError('Expected , or ) in term but got ' + current);
                }
                if (current === ';') {
                    args.push(new PiTerm(';'));
                    next(); // eat ,
                } else if (current === ',') {
                    next(); // eat ,
                }
            }
            next(); // eat )
            return new PiConjunction(args);
        }
        if (current === '[') {
            next(); // eat (
            var items = [];
            var tail = undefined;
            while (current !== ']') {
                items.push(parseTerm());
                if(current === '|') {
                    next(); // eat 
                    tail = parseTerm();
                }
                if(current === '@') {
                    let v = prev;
                    next(); // eat 
                    let p = parseTerm();
                    ats.push(new PiTerm('=',[new PiVar(v),p]));
                    if(tail) {
                        tail = p;
                    } else {
                        items.pop();
                        items.push(p);                        
                    }
                    // console.log(63,current,v,p,items);
                }
                if (current !== ',' && current !== ']' && current !== '@') {
                    throw new SyntaxError('Expected , or ] in term but got ' + current);
                }
                if (current === ',') {
                    next(); // eat ,
                }
            }
            next(); // eat )
            return new PiList(items,tail);
        }

        var functor = parseAtom();
        if (/^[A-Z_][A-Za-z_]*$/.test(functor)) {
            if (functor === '_') {
                return new PiVar('_');
            }
            // variable X in the same scope should point to the same object
            var variable = scope[functor];
            if (!variable) {
                variable = scope[functor] = new PiVar(functor);
            }
            return variable;
        }

        if (/^[0-9]*$/.test(functor)) {
            return new PiInt(functor|0);
        }

        if (current !== '(') {
            return new PiTerm(functor);
        }
        next(); // eat (
        var args = [];
        while (current !== ')') {
            args.push(parseTerm());
            if (current !== ',' && current !== ')') {
                throw new SyntaxError('Expected , or ) in term but got ' + current);
            }
            if (current === ',') {
                next(); // eat ,
            }
        }
        next(); // eat )
        return new PiTerm(functor, args);
    }


    function parseRule() {
        ats = [];
        let functor;
        let head = parseTerm();
        let args = [];
        let conds = [];
        let expr = undefined;

        if (current === '.') {
            next(); // eat .
            return new PiRule('.',head);
//            return new PiRule('.',head, TRUE);
        }
        if (current === ':-' || current === '?=>') {
            functor = current;
            next(); // eat :-
        } else if (current === '=') {
            functor = current;
            //args.push(new Term('!'));
            //console.log('***FUNCTION');
//            return new Rule(head, Term.FN);
//            type = 'function';
            next(); // eat :-
        } else if (current === '=>') {
            conds = args;
            args = [];
            functor = current;
            // args.push(new PiTerm('!'));
            next(); // eat :-
            //throw new SyntaxError('Rule ' + current);
        } else if (current === ',') {
            if(functor == '=') {
                console.log(143);
            }
            // Conditions
            while (current === ',') {
                next();
                // console.log(130,args,current);
                args.push(parseTerm());

                if (current === '.') {
                    var body, cond;
                    if (args.length === 1) {
                        // body is a regular Term
                        body = args[0];
                    } else {
                        // body is a conjunction of all terms
                        body = new PiConjunction(args);
                    }

                    if (conds.length === 0) {
                        cond = undefined;
                    } else if (conds.length === 1) {
                        // body is a regular Term
                        cond = conds[0];
                    } else {
                        // body is a conjunction of all terms
                        cond = new PiConjunction(conds);
                    }
//console.log(162);
              //      if(type == 'rule') {
                        return new PiRule('.',head, cond, body);    
                } else if (current === ':-' || current === '?=>') {
                    functor = current;
                    next(); // eat :-
                } else if (current === '=') {
                    functor = current;
                    //args.push(new Term('!'));
                    //console.log('***FUNCTION');
        //            return new Rule(head, Term.FN);
        //            type = 'function';
                    next(); // eat :-
                } else if (current === '=>') {
                    conds = args;
                    args = [];                    
                    functor = current;
                    // args.push(new PiTerm('!'));
                    next(); // eat :-
                } else {
                    throw new SyntaxError('Expected , or ) in term but got ' + current);
                }
                if (current === ',') {
//                    next(); // eat ,
                }
            }


        } else if (current !== ':-') {
            // console.log(159,current);
            throw new SyntaxError('Expected :- in rule but got ' + current);
        }
        while (current !== '.') {
            args.push(parseTerm());
            //console.log(173,args);
            if (current !== ',' && current !== ';' && current !== '.' && current !== '=>') {
                console.log(206,args);
                throw new SyntaxError('Expected , or ) in term but got ' + current);
            }
            if (current === ';') {
                args.push(new PiTerm(';'));
                next(); // eat ,
            } else if (current === ',') {
                next(); // eat ,
            } else if (current === '=>') {
                expr = args;
                args = [];
                // console.log(210,functor, args,conds);
                next(); // eat ,
            }
        }
        next(); // eat .
        var body,cond;
        if(ats.length > 0) {
            args = ats.concat(args);
        }
        if (args.length === 1) {
            // body is a regular Term
            body = args[0];
        } else {
            // body is a conjunction of all terms
            body = new PiConjunction(args);
        }

        if (conds.length === 0) {
            cond = undefined;
        } else if (conds.length === 1) {
            // body is a regular Term
            cond = conds[0];
        } else {
            // body is a conjunction of all terms
            cond = new PiConjunction(conds);
        }
// console.log(162);

  //      if(type == 'rule') {
        // if(ats.length > 0) {

        //     console.log(208,(new PiRule(functor,head, body)).toString());
        // }
        // if(functor == '=>') {
        //     console.log(212,functor,head,cond, body);
        // }
        if(functor == '=>' || functor == '?=>' || functor == ':-' ) {  
//console.log(223,body);

            return new PiRule(functor,head, cond, body);    
        } else if(functor == '=') {
//console.log(258,body);
            // expr = body[0];
            // body = body.slice(1);
            // console.log(246,head, expr, cond, body);
            if(body && !expr) {
                expr = body;
                body = undefined;
            } else if(body && expr && expr.length >= 1) {
                cond = expr.slice(1);
                if(cond.length == 0) {
                    cond = undefined;
                } else if(cond.length == 1) {
                    cond = cond[0];
                } else {
                    cond = new PiConjunction(cond);
                }
                expr = expr[0];
            }

            return new PiFunc(functor,head, expr, cond, body);    
        }
        // } else {
        //     return new Rule(head, body);
        // }
        
    }
    next(); // start the tokens iterator
    return {
        parseRules: function() {
            var rules = [];
            while (!done) {
                // each rule gets its own scope for variables
                scope = { };
                rules.push(parseRule());
            }
            return rules;
        },
        parseTerm: function() {
            scope = { };
            return parseTerm();
        },
        parseGoal: function() {
            scope = { };
            let t = parseTerm();
            if(!current) return t;
            else if(current == ',') {
                let tt = [t];
                while(current == ',') {
                    next();
                    t = parseTerm();
                    tt.push(t);
                }
//                console.log(214,tt);
                return new PiConjunction(tt);
            }
//            console.log(207,current);
            
        }
    };
}
