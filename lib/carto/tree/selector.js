var assert = require('assert');

(function(tree) {

tree.Selector = function Selector(filters, zoom, zooms, elements, attachment, conditions, index) {
    this.elements = elements || [];
    this.attachment = attachment;
    this.filters = filters || {};
    this.zoom = typeof zoom !== 'undefined' ? zoom : tree.Zoom.all;
    this.zooms = zooms || [];
    this.conditions = conditions;
    this.index = index;
};

/**
 * Determine the specificity of this selector
 * based on the specificity of its elements - calling
 * Element.specificity() in order to do so
 *
 * [ID, Class, Filters, Position in document]
 */
tree.Selector.prototype.specificity = function() {
    return this.elements.reduce(function(memo, e) {
        var spec = e.specificity();
        memo[0] += spec[0];
        memo[1] += spec[1];
        return memo;
    }, [0, 0, this.conditions, this.index]);
};

tree.Selector.prototype.evalzoom = function(env) {
    for (var i = 0; i < this.zooms.length; i++) {
        var z = this.zooms[i];
        this.zoom &= z.eval(env);
    }
};

})(require('../tree'));
