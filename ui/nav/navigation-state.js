


/**
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 * @constructor
 */
tuna.ui.nav.NavigationState = function(path, opt_data) {

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
 * @return {!Array.<string>}
 */
tuna.ui.nav.NavigationState.prototype.getPath = function() {
    return tuna.utils.cloneArray(this.__path);
};


/**
 * @return {Object.<string, string>}
 */
tuna.ui.nav.NavigationState.prototype.getData = function() {
    return this.__data;
};
