


/**
 * @constructor
 * @extends {tuna.ui.Container}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container
 */
tuna.ui.selection.NavigationPage = function(target, opt_container) {
    tuna.ui.Container.call(this, target, opt_container);

    /**
     * @type {tuna.ui.selection.Navigation}
     * @protected
     */
    this._navigation = null;

    /**
     * @type {boolean}
     * @protected
     */
    this._isInitialized = false;
};


tuna.utils.extend(tuna.ui.selection.NavigationPage, tuna.ui.Container);


/**
 * @param {!tuna.ui.selection.Navigation} navigation
 */
tuna.ui.selection.NavigationPage.prototype.setNavigation =
    function(navigation) {

    this._navigation = navigation;
};


/**
 * @inheritDoc
 */
tuna.ui.selection.NavigationPage.prototype.init = function() {
    var controllerId = this.getStringOption('controller-id');
    if (controllerId !== null) {

        var controller  = tuna.control.getController(controllerId);
        if (controller instanceof tuna.control.PageController) {
            controller.setNavigation(this._navigation);
            controller.setContainer(this);
        }
    }
};

/**
 * @inheritDoc
 */
tuna.ui.selection.NavigationPage.prototype.select = function() {
    tuna.ui.Container.prototype.select.call(this);

    if (!this._isInitialized) {
        tuna.ui.Container.prototype.init.call(this);

        this._isInitialized = true;
    }

    this.dispatch('opened');
};


/**
 * @inheritDoc
 */
tuna.ui.selection.NavigationPage.prototype.deselect = function() {
    tuna.ui.Container.prototype.deselect.call(this);
    this.dispatch('closed');
};


/**
 * @inheritDoc
 */
tuna.ui.selection.NavigationPage.prototype.destroy = function() {
    tuna.ui.Container.prototype.destroy.call(this);

    this._isInitialized = false;
};
