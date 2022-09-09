export class PiRule {
    constructor(functor, head, body) {
        this.functor = functor;
        this.head = head;
        this.body = body;
    }

    inst(env) {
        return new PiRule(this.functor,this.head.inst(env), this.body.inst(env));
    }

    toString() {
        // TODO Добавить functor + conds
        // 
        return this.head + ' '+this.functor+' ' + this.body;
    };

}



