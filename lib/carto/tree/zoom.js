(function(tree) {

tree.Zoom = function Zoom(op, value, index) {
    this.op = op.trim();
    this.value = value;
    this.index = index;
    this.is = 'zoom';
};

tree.Zoom.prototype = {
    eval: function(env) {
        var val = this.value;
        if (this.value instanceof tree.Variable) {
            val = this.value.eval(env);
        }
        val = parseInt(val, 10);
        //if (env.scale > 1) {
        //    val = val - (env.scale-1);
        //}
        if (val > tree.Zoom.maxZoom || val < 0) {
            throw {
                message: 'Only zoom levels between 0 and ' +
                tree.Zoom.maxZoom + ' supported.',
                index: this.index
            };
        }

        var start = 0,
            end = Infinity,
            zoom = 0;

        switch (this.op) {
            case '=':
                zoom = 1 << val;
                return zoom;
            case '>':
                start = val + 1;
                break;
            case '>=':
                start = val;
                break;
            case '<':
                end = val - 1;
                break;
            case '<=':
                end = val;
                break;
        }
        for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
            if (i >= start && i <= end) {
                zoom |= (1 << i);
            }
        }
        return zoom;
    },
};

tree.Zoom.toXML = function(zoom) {
    var conditions = [];
    if (zoom != tree.Zoom.all) {
        var start = null, end = null;
        for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
            if (zoom & (1 << i)) {
                if (start === null) start = i;
                end = i;
            }
        }
        if (start > 0) conditions.push('    <MaxScaleDenominator>' +
            tree.Zoom.ranges[start] + '</MaxScaleDenominator>\n');
        if (end < 22) conditions.push('    <MinScaleDenominator>' +
            tree.Zoom.ranges[end + 1] + '</MinScaleDenominator>\n');
    }
    return conditions;
};

tree.Zoom.all = 0x7FFFFF;

tree.Zoom.maxZoom = 22;

tree.Zoom.ranges = {
     0: 1000000000,
     1: 500000000,
     2: 200000000,
     3: 100000000,
     4: 50000000,
     5: 25000000,
     6: 12500000,
     7: 6500000,
     8: 3000000,
     9: 1500000,
    10: 750000,
    11: 400000,
    12: 200000,
    13: 100000,
    14: 50000,
    15: 25000,
    16: 12500,
    17: 5000,
    18: 2500,
    19: 1500,
    20: 750,
    21: 500,
    22: 250,
    23: 100
};

})(require('../tree'));


// Storage for zoom ranges. Only supports continuous ranges,
// and stores them as bit-sequences so that they can be combined,
// inverted, and compared quickly.
/*
tree.Zoom = function(op, value, index) {
    value = parseInt(value, 10);
    if (value > tree.Zoom.maxZoom || value < 0) {
        throw {
            message: 'Only zoom levels between 0 and ' +
                tree.Zoom.maxZoom + ' supported.',
            index: index
        };
    }

    var start = 0,
        end = Infinity,
        zoom = 0;

    switch (op) {
        case '=':
            return 1 << value;
        case '>':
            start = value + 1;
            break;
        case '>=':
            start = value;
            break;
        case '<':
            end = value - 1;
            break;
        case '<=':
            end = value;
            break;
    }
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        if (i >= start && i <= end) {
            zoom |= (1 << i);
        }
    }
    return zoom;
};

// Covers all zoomlevels from 0 to 22
tree.Zoom.all = 0x7FFFFF;

tree.Zoom.maxZoom = 22;

tree.Zoom.ranges = {
     0: 1000000000,
     1: 500000000,
     2: 200000000,
     3: 100000000,
     4: 50000000,
     5: 25000000,
     6: 12500000,
     7: 6500000,
     8: 3000000,
     9: 1500000,
    10: 750000,
    11: 400000,
    12: 200000,
    13: 100000,
    14: 50000,
    15: 25000,
    16: 12500,
    17: 5000,
    18: 2500,
    19: 1500,
    20: 750,
    21: 500,
    22: 250,
    23: 100
};

// Only works for single range zooms. `[XXX....XXXXX.........]` is invalid.
tree.Zoom.toXML = function(zoom) {
    var conditions = [];
    if (zoom != tree.Zoom.all) {
        var start = null, end = null;
        for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
            if (zoom & (1 << i)) {
                if (start === null) start = i;
                end = i;
            }
        }
        if (start > 0) conditions.push('    <MaxScaleDenominator>' +
            tree.Zoom.ranges[start] + '</MaxScaleDenominator>\n');
        if (end < 22) conditions.push('    <MinScaleDenominator>' +
            tree.Zoom.ranges[end + 1] + '</MinScaleDenominator>\n');
    }
    return conditions;
};


tree.Zoom.toString = function(zoom) {
    var str = '';
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        str += (zoom & (1 << i)) ? 'X' : '.';
    }
    return str;
};
*/