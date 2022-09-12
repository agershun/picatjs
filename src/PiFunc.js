export class PiFunc {
    constructor(functor, head, expr, cond, body) {
        this.functor = functor;
        this.head = head;
        this.expr = expr;
        this.cond = cond;
        this.body = body;
// console.log(8,this.head.args);
    }

    inst(env) {
        return new PiFunc(
            this.functor,
            this.head.inst(env),
            this.expr.inst(env),
            this.cond?this.cond.inst(env):undefined,
            this.body?this.body.inst(env):undefined);
    }

    toString() {
        let s = this.head.toString() + ' = ' + this.expr.toString();
        if(this.cond) s += ','+this.cond.toString();
        if(this.body) s += ' => ' + this.body.toString();
        s += '.';
        return s;
    };
}



