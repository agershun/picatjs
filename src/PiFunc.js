export class PiFunc {
    constructor(functor, head, expr, cond, body) {
        this.functor = functor;
        this.head = head;
        this.expr = expr;
        this.cond = cond;
        this.body = body;
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
        if(this.cond) s += ','+this.cond.map(d=>d.toString()).join(',');
        if(this.body) s += this.functor+' ' + this.body.toString();
        s += '.';
        return s;
    };
}



