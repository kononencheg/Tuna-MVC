


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
    this.__menuLinks = {};

    this._setDefaultOption('link-selector', 'a.j-link');
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
            path = item.getAttribute('href');

            if (path !== null) {
                if (path.indexOf('/') === 0) {
                    path = path.substr(1);
                }

                this.__menuLinks[path.split('/').shift()] = item;
            }
        }
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.NavigationMenu.prototype.handlePath = function(pageIndex) {
    var selectionClass = this.getStringOption('selection-class');
    var itemSelector = this.getStringOption('item-selector');
    
    if (selectionClass !== null) {
        var item = null;
        for (var i in this.__menuLinks) {
            item = this.__menuLinks[i];

            if (itemSelector !== null) {
                item = tuna.dom.getParentMatches(item, itemSelector, this._target);
            }

            if (item !== null) {
                tuna.dom.setClassExist(item, selectionClass, i === pageIndex);
            }
        }
    }
};