


/**
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 * @constructor
 */
tuna.ui.selection.NavigationState = function(path, opt_data) {

    /**
     * @type {!Array.<string>}
     * @private
     */
    this.__path = path;

    /**
     * @type {Object.<string, string>}
     */
    this.__data = opt_data || null;
};


/**
 * @return {string}
 */
tuna.ui.selection.NavigationState.prototype.serialize = function() {
    var result = '';
    if (this.__data !== null) {
        result = tuna.utils.urlEncode(this.__data);
    }

    if (result !== '') {
        result = '?' + result;
    }

    return '/' + this.__path.join('/') + result;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.selection.NavigationState.prototype.getPath = function() {
    return tuna.utils.cloneArray(this.__path);
};


/**
 * @return {Object}
 */
tuna.ui.selection.NavigationState.prototype.getData = function() {
    return this.__data;
};
