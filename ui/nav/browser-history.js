


/**
 * @constructor
 * @implements {tuna.ui.nav.INavigationHandler}
 * @param {!tuna.ui.nav.Navigation} navigation
 */
tuna.ui.nav.BrowserHistory = function(navigation) {

    /**
     * @type {!tuna.ui.nav.Navigation}
     * @protected
     */
    this._navigation = navigation;
};


/**
 *
 */
tuna.ui.nav.BrowserHistory.prototype.init = function() {
    var self = this;

    tuna.dom.addEventListener(window, 'popstate', function() {
        self._navigation.back();
    });

    this._navigation.navigate
        (location.pathname, tuna.utils.urlDecode(location.search.substr(1)));

    this._navigation.addHandler(this);
};


/**
 * @inheritDoc
 */
tuna.ui.nav.BrowserHistory.prototype.handlePath = function(path, opt_data) {
    if (window.history.pushState !== undefined) {
        var location = '/' + path.join('/');

        if (opt_data !== undefined) {
            var encodedData = tuna.utils.urlEncode(opt_data);
            if (encodedData.length > 0) {
                location += '?' + encodedData;
            }
        }

        window.history.pushState(null, '', location);
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.BrowserHistory.prototype.handlePage = function() {};
