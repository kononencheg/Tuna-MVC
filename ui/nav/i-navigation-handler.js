


/**
 * @interface
 */
tuna.ui.nav.INavigationHandler = function() {};


/**
 * @param {string|number} index
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.INavigationHandler.prototype
    .handlePage = function(index, opt_data) {};


/**
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.INavigationHandler.prototype.handlePath = function(path, opt_data) {};
