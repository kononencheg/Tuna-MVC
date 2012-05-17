


/**
 * @interface
 */
tuna.ui.nav.INavigationHandler = function() {};


/**
 * @param {string} pageIndex
 * @param {!Array.<string>} restPath
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.INavigationHandler.prototype
    .handlePath = function(pageIndex, restPath, opt_data) {};
