import {PiVar} from './PiVar.js';

export class PiString {
    constructor (val) {
        this.val = val;
    }

    value() {
        return this;
    }

    substitute(bindings) {
        return this;
    }

    match(other) {
        if (other instanceof PiString) {
            if(this.val != other.val) 
                return null;
            var bindings = new Map;
            return bindings;
        } else if (other instanceof PiVar) {
            return other.match(this);
        }
        return null;
    }

    inst(env) {
        return this;
    }

    toString() {
        return '"'+this.val+'"';
    }

    *query() {
        yield this;
    }

}
