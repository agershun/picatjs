export class PiVar {
	static count = 0;

	constructor(name) {
		this.name = name;
	}

	value () {
		return this;
//		return this.name;
	}

	match (other) {
    	let bindings = new Map();
    	if (this !== other) {
        	bindings.set(this, other);
    	}
    	return bindings;
	}

	substitute (bindings) {
	    let value = bindings.get(this);
	    if (value) {
	        return value.substitute(bindings);
	    }
	    return this;
	};

	inst (env) {
	    let v = env.get(this);
	    if (v) {
	        return v; 
	    }
	    v = new PiVar('_'+this.name + String(PiVar.count++));
	    env.set(this, v);
	    return v;
	}

	toString () {
	    return this.name;
	}

    *query() {
        yield this;
    }
}