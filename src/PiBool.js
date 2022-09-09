export class PiBool {
    constructor(value) {
        this.val = value;
    }

    substitute() {
        return this;
    }

    inst(env) {
        return this;
    }

    toString() {
        return this.val?'true':'fail';
    }

    value() {
        return this.val;
    }

    *query(database) {
        if(this.val) yield this;
    }

}

export const TRUE = new PiBool(true);
export const FAIL = new PiBool(false);

