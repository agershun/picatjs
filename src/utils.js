export function zip(arrays) {
    return arrays[0].map(function(element, index) {
        return arrays.map(function(array) {
            return array[index];
        });
    });
}

export function mergeBindings(bindings1, bindings2) {
    if (!bindings1 || !bindings2) {
        return null;
    }
    var conflict = false;
    var bindings = new Map;
    bindings1.forEach(function(value, variable) {
        bindings.set(variable, value);
    });
    bindings2.forEach(function(value, variable) {
        var other = bindings.get(variable);
        if (other) {
            var sub = other.match(value);
            if (!sub) {
                conflict = true;
            } else {
                sub.forEach(function(value, variable) {
                    bindings.set(variable, value);
                });
            }
        } else {
            bindings.set(variable, value);
        }
    });
    if (conflict) {
        return null;
    }
    return bindings;
}
