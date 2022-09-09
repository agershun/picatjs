import {PiVar} from './PiVar.js';
import {PiInt} from './PiInt.js';
import {PiTerm} from './PiTerm.js';
import {PiList} from './PiList.js';
import {PiConjunction} from './PiConjunction.js';

export class PiDatabase {

    constructor(rules) {
        this.rules = rules;
    }

    *query(goal) {
//console.log(8,goal);

        if(goal.functor == '=') {
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
            } else if(r0 instanceof PiList && r1 instanceof PiList) {
                console.log(59);
            } else {

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
console.log(111);            
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
        } else if(goal.functor == 'println') {
            console.log(501,goal.args[0]);
            console.log(501,goal.args[0].value(this));
            console.log(goal.args[0].value(this).toString());
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

        } else if(goal instanceof PiConjunction) {
            //let fgoal = goal.inst(new Map);
            //console.log(112,[...goal.query(this)]);
            for(let sol of goal.query(this)) {
//                console.log(116,sol);
                yield sol;
            }

        } else {

            for (var i = 0, rule; rule = this.rules[i]; i++) {
                var fresh = rule.inst(new Map);
        //        console.log(334,fresh);
        //        var fresh = rule;
                var match = fresh.head.match(goal);
//                console.log(335,fresh.head,match);
                if (match) {
                    var head = fresh.head.substitute(match);
                    var body = fresh.body.substitute(match);

//                    console.log(122,body);
//                    console.log(116,[...body.query(this)]);
                    for (var item of body.query(this)) {
                        if(!this.cut) {
                            var ret = head.substitute(body.match(item));
                            //console.log(490, ret);
    //                        ret.result = RES;
    //                        ret.resname = RESNAME;
                            yield ret;
                        }

    //                    yield head.substitute(body.match(item));
                    }
                }
            }
        }
    }

    toString() {
        return this.rules.join('.\n') + '.';
    }
}   