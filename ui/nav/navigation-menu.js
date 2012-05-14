


/**
 * @constructor
 * @implements {tuna.ui.nav.INavigationHandler}
 * @extends {tuna.ui.Widget}
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.nav.NavigationMenu = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);


    /**
     * @type {!Object.<string, !Node>}
     * @private
     */
    this.__menuItems = {};

    this._setDefaultOption('link-selector', '.j-link');
    this._setDefaultOption('selection-class', 'active');
};


tuna.utils.extend(tuna.ui.nav.NavigationMenu, tuna.ui.Widget);


/**
 * @inheritDoc
 */
tuna.ui.nav.NavigationMenu.prototype.init = function() {
    this.update();
};



tuna.ui.nav.NavigationMenu.prototype.update = function() {
    var itemSelector = this.getStringOption('link-selector');
    if (itemSelector !== null) {
        var items = tuna.dom.select(itemSelector, this._target);

        var path = null;
        var item = null;
        while (items.length > 0) {
            item = items.shift();
            path = item.getAttribute('href') ||
                   item.getAttribute('data-href');

            if (path !== null) {
                this.__menuItems[path.split('/').shift()] = item;
            }
        }
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.NavigationMenu.prototype.handlePage = function(index) {
    var selectionClass = this.getStringOption('selection-class');
    if (selectionClass !== null) {
        for (var i in this.__menuItems) {
            tuna.dom.setClassExist
                (this.__menuItems[i], selectionClass, i === index);
        }
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.NavigationMenu.prototype.handlePath = function() {};