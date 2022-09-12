import {PiVar} from './PiVar.js';
import {PiInt} from './PiInt.js';
import {PiTerm} from './PiTerm.js';
import {PiList} from './PiList.js';
import {TRUE, FAIL,PiBool} from './PiBool.js';
import {PiConjunction} from './PiConjunction.js';

export class PiDatabase {
    constructor(rules) {
        this.rules = rules;
        this.val = undefined;
    }

    *query(goal) {
        this.val = undefined;
        if(goal.functor == 'return') {
            this.val = goal.args[0].value(this);
            yield goal;
        } else if(goal.functor == '=') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0 instanceof PiVar && r1 instanceof PiVar) {
                yield goal.substitute(r0.match(r1));
            } else if(r0 instanceof PiVar && r1 instanceof PiTerm) {

                // console.log(22, r1.value(this));
                // console.log(23, r0.match(r1.value(this)));
                // console.log(24, goal.substitute(r0.match(r1.value(this))));
                yield goal.substitute(r0.match(r1.value(this)));
    //            yield goal.substitute(r0.match(new Integer(r1.value())));
            } else if(r0 instanceof PiVar && r1 instanceof PiInt) {
    //            yield goal.substitute(r0.match(r1));
                yield goal.substitute(r0.match(new PiInt(r1.value(this))));

            } else if(r1 instanceof PiVar && r0 instanceof PiInt) {
                yield goal.substitute(r1.match(new PiInt(r0.value(this))));

            } else if(r0 instanceof PiInt && r1 instanceof PiInt) {
                if(r0.value(this) == r1.value(this)) yield goal;
            } else {

            }
        } else if(goal.functor == '==') {   
            if(goal.value(this).val) yield goal;
            

        } else if(goal.functor == 'in') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            let rv1;
            if(r1 instanceof PiTerm || r1 instanceof PiList) {
                rv1 = r1;
            } else {
                rv1 = r1.value(this);
            }
            
//            console.log(69,);
            if(r0 instanceof PiVar) {
                for(let r of rv1.iter(this)) {
                    yield goal.substitute(r0.match(r));
                }
            } else {
                // error
                //if(r0.value() == r1.value()) yield goal;
            }
        } else if(goal.functor == 'range') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            var r2 = goal.args[2];
            if(r0 instanceof PiVar) {
                for(var i=r1.value(this); i<=r2.value(this); i++) {
                    yield goal.substitute(r0.match(new PiInt(i)));
                }
            } else {
                // error
                //if(r0.value() == r1.value()) yield goal;
            }
        // } else if(this.functor == 'even') {
        //     console.log(92);
        //     let r = this.args[0].value(database);
        //     if(r instanceof PiInt) {
        //         console.log(26,r);
        //         if(r.val % 2n == 0) yield goal;
        //     }
        // } else if(this.functor == 'odd') {
        //     console.log(99);
        //     let r = this.args[0].value(database);
        //     if(r instanceof PiInt) {
        //         if(r.val % 2n == 1) yield goal;
        //     }

        } else if(goal.functor == '>') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0.value(this) > r1.value(this)) {
                yield goal;
            } else {

            }
        } else if(goal.functor == '>=') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0.value(this) >= r1.value(this)) {
                yield goal;
            } else {

            }
        } else if(goal.functor == '<') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0.value(this) < r1.value(this)) {
                yield goal;
            } else {

            }
        } else if(goal.functor == '<=') {
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0.value(this) <= r1.value(this)) {
                yield goal;
            } else {

            }
        } else if(goal.functor == '==') {
//console.log(111);            
            var r0 = goal.args[0];
            var r1 = goal.args[1];
            if(r0.value(this) == r1.value(this)) {
                yield goal;
            } else {

            }
        } else if(goal.functor == '!') {
            if(this.cut) {
                // Nothing
            } else {
                yield goal;        
                this.cut = true;
            }
        } else if(goal.functor == 'true') {
            // console.log(501,goal.args[0]);
            // console.log(501,goal.args[0].value(this));
            // console.log(goal.args[0].value(this).toString());
            yield goal;
        } else if(goal.functor == 'fail') {
            // console.log(501,goal.args[0]);
            // console.log(501,goal.args[0].value(this));
            // console.log(goal.args[0].value(this).toString());
            // yield goal;
        } else if(goal.functor == 'println') {
            console.log(501,goal.toString(),goal.args[0].toString());
            // console.log(501,goal.args[0].value(this));
            let res = goal.args[0].value(this);
            console.log(154,res);
            yield goal;
         } else if(goal.functor == 'print') {
            if(globalThis.process) {
                process.stdout.write(goal.args[0].value(this).toString());
            } else {
                console.log(goal.args[0].value(this).toString());
            }
            yield goal;
        } else if(goal.functor == 'debug') {
            console.log(goal.args[0].functor||'', goal.args[0].toString());
            yield goal;
    //        console.log(411,this,goal);
    //        debugger;        
        } else if(['even','odd','prime'].includes(goal.functor)) {
            let r = goal.value(this);
            if( r instanceof PiBool) {
                if(r.val) yield goal;
            } else if( r instanceof PiInt) {
                if(r.val) yield goal;
            }
        } else if(goal instanceof PiConjunction) {
            //let fgoal = goal.inst(new Map);
            //console.log(112,[...goal.query(this)]);
            yield *goal.query(this)
//             for(let sol of goal.query(this)) {
// //                console.log(116,sol);
//                 yield sol;
//             }

        } else {

            for (var i = 0, rule; rule = this.rules[i]; i++) {
                if(goal.functor != rule.head.functor) continue;
                if(goal.args.length != rule.head.args.length) continue;
               if(!['.',':-','=>','?=>'].includes(rule.functor)) continue;

                var fresh = rule.inst(new Map);
        //        console.log(334,fresh);
        //        var fresh = rule;
                var match = fresh.head.match(goal);
               // console.log(335,match);
                if (match) {

                    var head = fresh.head.substitute(match);
                    if(!rule.body) {
                        yield head;
                    } else if(rule.functor == ':-') {
                        var body = fresh.body.substitute(match);
                        for (var item of body.query(this)) {
                            if(!this.cut) {
                                var ret = head.substitute(body.match(item));
                                yield ret;
                            }
                        }
                    } else if(rule.functor == '=>') {
                        if(fresh.cond) {
                            var cond = fresh.cond.substitute(match);
                            let condr = cond.query(this).next();
                            if(condr.done) continue;
                        }
                        var body = fresh.body.substitute(match);
//console.log(202,body);
                        for (var item of body.query(this)) {
//console.log(205,item);
                            if(!this.cut) {
        console.log(218,rule.toString());
                                var ret = head.substitute(body.match(item));
                                yield ret;
                            }
                            this.cut = true;
                            return;
                        }
                    } else if(rule.functor == '?=>') {
                        var body = fresh.body.substitute(match);
                        for (var item of body.query(this)) {
                            if(!this.cut) {
                                var ret = head.substitute(body.match(item));
                                yield ret;
                            }
                        }                        
                    }
                }
            }
        }
    }

    toString() {
        return this.rules.join('\n') ;
    }
}   