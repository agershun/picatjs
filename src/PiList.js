import {zip, mergeBindings} from './utils.js';

export class PiList {
	constructor(items,tail) {
	    if(tail instanceof PiList) {
//	    	console.log(8,'reduce tail');
	    	this.items = items.concat(tail.items);
	    	this.tail = tail.tail;
	    } else {
		    this.items = items;
		    this.tail = tail;	    	
	    }
	}

	value() {
    	return this;
	}

	substitute (bindings) {
	    return new PiList(this.items.map(function(item) {
	        return item.substitute(bindings);
	    }),this.tail?this.tail.substitute(bindings):undefined);
	}

	match(other) {
	    // console.log(237);
	    if (other instanceof PiList) {
	        // console.log(238,this.tail,other.tail);
	        if (!this.tail && !other.tail) {
	            if(this.items.length !== other.items.length) {
	                return null;
	            }
	            return zip([this.items, other.items]).map(function(items) {
	                return items[0].match(items[1]);
	            }).reduce(mergeBindings, new Map);
	        } else if (this.tail && other.tail) {
	        	// ??? Два хвоста

	        	console.log(30,'Два хвоста	')
	        } else {
	        	let first, second;
	        	if(this.tail && !other.tail) {
	        		let first = this, second = other;
	        	} else {
	        		let first = other, second = this;
	        	}
	        	// TODO - заменить
	            if(this.tail && !other.tail) {
	                if(this.items.length > other.items.length) {
	                    return null;
	                } else {
		                let zz = zip([this.items, other.items.slice(0,this.items.length)]);
		                zz.push([this.tail,new PiList(other.items.slice(this.items.length))]);
		                //zz.push([this.tail,other.items.slice(this.items.length)]);
		                //console.log(258,zz);
		                return zz.map(function(items) {
		                    return items[0].match(items[1]);
		                }).reduce(mergeBindings, new Map);
	                }
	            } else {
	                if(this.items.length < other.items.length) {
	                    return null;
	                }
	                let zz = zip([other.items, this.items.slice(0,other.items.length)]);
	                zz.push([other.tail,new PiList(this.items.slice(other.items.length))]);
	                return zz.map(function(items) {
	                    return items[0].match(items[1]);
	                }).reduce(mergeBindings, new Map);
	            }
	        }
	    } else if (other instanceof PiVar) {
	        return other.match(this);
	    }
	    return null;
	}

	toString() {
	    let s = '['+this.items.map(item=>item.toString()).join(',');
	    if(this.tail) {
	        s += '|'+this.tail.toString();
	    } 
	    return s+']';
	}

	inst(env) {
	    return new PiList(this.items.map(x => x.inst(env)),this.tail?this.tail.inst(env):undefined);
	}

    *query() {
        yield this;
    }
}