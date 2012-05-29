


/**
 * @constructor
 * @extends {tuna.ui.Container}
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.nav.NavigationPage = function(target, opt_container) {
    tuna.ui.Container.call(this, target, opt_container);

    /**
     * @type {tuna.ui.nav.Navigation}
     * @protected
     */
    this._navigation = null;

    /**
     * @type {boolean}
     * @protected
     */
    this._isInitialized = false;
};


tuna.utils.extend(tuna.ui.nav.NavigationPage, tuna.ui.Container);


/**
 * @param {!tuna.ui.nav.Navigation} navigation
 */
tuna.ui.nav.NavigationPage.prototype.setNavigation = function(navigation) {
    this._navigation = navigation;
};


/**
 * @return {tuna.ui.nav.Navigation}
 */
tuna.ui.nav.NavigationPage.prototype.getNavigation = function() {
    return this._navigation;
};


tuna.ui.nav.NavigationPage.prototype.init = function() {};


/**
 * @inheritDoc
 */
tuna.ui.nav.NavigationPage.prototype.destroy = function() {
    tuna.ui.Container.prototype.destroy.call(this);

    this._isInitialized = false;
};


/**
 * @param {Object.<string, string>=} opt_data Данные сопуствующие открытию.
 */
tuna.ui.nav.NavigationPage.prototype.open = function(opt_data) {
    if (!this._isInitialized) {
        tuna.ui.Container.prototype.init.call(this);
        this._isInitialized = true;
    }

    if (this._controller instanceof tuna.control.PageController) {
        this._controller.open(opt_data || null);
    }

};


/**
 * @param {string} index
 */
tuna.ui.nav.NavigationPage.prototype.canClose = function(index) {
    if (this._controller instanceof tuna.control.PageController) {
        if (this._controller.canClose(index)) {
            this._controller.close();

            return true;
        }

        return false;
    }

    return true;
};
