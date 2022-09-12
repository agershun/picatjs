export class PiRule {
    constructor(functor, head, cond, body) {
        this.functor = functor;
        this.head = head;
        this.cond = cond;
        this.body = body;
    }

    inst(env) {
        return new PiRule(
            this.functor, 
            this.head.inst(env), 
            this.cond?this.cond.inst(env):undefined,
            this.body?this.body.inst(env):undefined)
    }

    toString() {
        let s = this.head.toString();
        if(this.cond) s += ','+cond.map(d=>d.toString()).join(',');
        if(this.body) s += this.functor+' ' + this.body;
        s += '.';
        return s;
    };

}



