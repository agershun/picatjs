import {zip, mergeBindings} from './utils.js';
import {PiVar} from './PiVar.js';
import {PiTerm} from './PiTerm.js';

export class PiList {
	constructor(items,tail) {
	    if(tail instanceof PiList) {
	    	this.items = items.concat(tail.items);
	    	this.tail = tail.tail;
	    	// console.log(8,'reduce tail',this);
//	    	process.exit(0);
	    // } else if(tail instanceof PiTerm) {
	    	// console.log(8,'reduce tail term');
// 	    // 	this.items = items.concat(tail.items);
// 	    // 	this.tail = tail.tail;
// 	    	// this.items = items.concat(tail);
// 	    	// this.tail = tail.tail;
	    } else {
		    this.items = items;
		    this.tail = tail;	    	
	    }
	}

	// static nnn = 0;

	value(database) {
//		console.log(24,this.tail?this.tail.toString():'---');
//		console.log(25,this.tail?this.tail.value(database).toString():'---');
// console.log(24,this.items.map(item=>item.value(database)));
// console.log(25,this.tail && this.tail instanceof PiTerm?this.tail.value(database):false);
		let vi = this.items.map(item=>item.value(database));
		let tail;
		if(this.tail) {
			// let tail = this.tail;
			// console.log(33,this.tail.toString());
			// PiList.nnn++;
			// if(PiList.nnn>3) 
			// if(this.tail instanceof PiTerm) {
			// 	console.log(37,this.tail);
			// 	process.exit(0);
			// }
			tail = this.tail.value(database);
			if(tail instanceof PiList) {
				vi = vi.concat(tail.items);
				tail = tail.tail;
			} else {
				vi.push(tail);
			}

		} 
		return new PiList(vi,tail);
//		return new PiList(this.items.map(item=>item.value(database)),this.tail?this.tail.value(database):undefined);
    	//return this;
	}

	*iter(database) {
		for(let item of this.items) {
			yield item;
		}
		if(this.tail) {
			yield* this.tail.iter(this);
		}
	}


	substitute (bindings) {
//console.log(59,this.toString());		
	    return new PiList(this.items.map(function(item) {
	        return item.substitute(bindings);
	    }),this.tail?this.tail.substitute(bindings):undefined);
	}

	match(other) {
	    //console.log(237);
	    if (other instanceof PiList) {
 //console.log(238,'this=',this.toString(),'other=',other.toString());
	        if (!this.tail && !other.tail) {
	            if(this.items.length !== other.items.length) {
	                return null;
	            }
	            return zip([this.items, other.items]).map(function(items) {
	                return items[0].match(items[1]);
	            }).reduce(mergeBindings, new Map);
	        } else if (this.tail && other.tail) {
	        	if(this.tail instanceof PiVar && other.tail instanceof PiVar) {
	        	// console.log(30,'Два хвоста	',this, other);
		            if(this.items.length !== other.items.length) {
		                return null;
		            }
		            let aa =  zip([this.items, other.items]).map(function(items) {
		                return items[0].match(items[1]);
		            });
		            aa.push(this.tail.match(other.tail));
		            return aa.reduce(mergeBindings, new Map);
	        	}
	        } else {
	        	let first, second;
	        	if(this.tail && !other.tail) {
	        		let first = this, second = other;
	        	} else {
	        		let first = other, second = this;
	        	}
	        	// TODO - заменить
	            if(this.tail && !other.tail) {
	                if(this.items.length + (this.tail?1:0) > other.items.length) {
	                    return null;
	                } else {
//    	console.log(108,this,other);
		                let zz = zip([this.items, other.items.slice(0,this.items.length)]);
//		                if(other.items.length == 0) return;

		                zz.push([this.tail,new PiList(other.items.slice(this.items.length))]);
		                //zz.push([this.tail,other.items.slice(this.items.length)]);
		                let res = zz.map(function(items) {
		                    return items[0].match(items[1]);
		                }).reduce(mergeBindings, new Map);
            console.log(258,'this=',this.toString(),'other=',other.toString(),zz.map(d=>`[${d[0].toString()}=${d[1].toString()}]`).join(','));
		                return res;
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
// console.log(83,other.match(this));
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