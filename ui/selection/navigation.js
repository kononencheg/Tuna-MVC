


/**
 * @constructor
 * @extends {tuna.ui.selection.WidgetGroup}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.selection.Navigation = function(target, opt_container) {
    tuna.ui.selection.WidgetGroup.call(this, target, opt_container);

    /**
     * @type {tuna.ui.selection.NavigationPage}
     * @private
     */
    this.__currentPage = null;

    /**
     * @type {tuna.ui.selection.Navigation}
     * @private
     */
    this.__parent = null;

    /**
     * @type {!Object.<(string|number), !tuna.ui.selection.Navigation>}
     * @private
     */
    this.__children = {};

    /**
     * @type {!Array.<!tuna.ui.selection.NavigationState>}
     * @private
     */
    this.__history = [];

    /**
     * @type {tuna.ui.selection.NavigationState}
     * @private
     */
    this.__currentState = null;
};


tuna.utils.extend(tuna.ui.selection.Navigation, tuna.ui.selection.WidgetGroup);


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype.init = function() {
    tuna.ui.selection.WidgetGroup.prototype.init.call(this);

    if (this._container instanceof tuna.ui.selection.NavigationPage) {
        var navigation = this._container.getNavigation();
        if (navigation !== null) {
            navigation.addChild(this);
        }
    }
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createCollection = function() {
    return new tuna.ui.selection.collection.NamedCollection(this);
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createSelectionRule = function() {
    return new tuna.ui.selection.rule.SingleSelectionRule(this._selectionState);
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype.handleCreatedWidget = function(page) {
    if (page instanceof tuna.ui.selection.NavigationPage) {
        page.setNavigation(this);
        page.init();
    }
};



tuna.ui.selection.Navigation.prototype.back = function() {
    if (this.isRoot()) {
        if (this.__history.length > 0) {
            this.__currentState = this.__history.pop();

            this.navigatePath
                (this.__currentState.getPath(), this.__currentState.getData());
        }
    } else {
        this.getRoot().back();
    }

};


/**
 * @param {string|!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.selection.Navigation.prototype.navigate = function(path, opt_data) {
    if (path instanceof Array) {

        if (this.isRoot()) {
            if (this.__currentState === null) {
                this.__currentState = 
                    new tuna.ui.selection.NavigationState(this.getPath());
            }

            this.navigatePath(path, opt_data);

            this.__history.push(this.__currentState);

            this.__currentState = 
                new tuna.ui.selection.NavigationState(this.getPath(), opt_data);

        } else {
            this.navigatePath(path, opt_data);
        }

    } else {
        var parsedPath = path.split('/');

        if (path.indexOf('/') !== 0) {
            parsedPath = this.getRelatedPath().concat(parsedPath);
        }

        this.getRoot().navigate(parsedPath, opt_data);
    }
};


/**
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.selection.Navigation.prototype.navigatePath = function(path, opt_data) {
    var index = path.shift();
    while (index === '' && path.length > 0) {
        index = path.shift();
    }

    if (index !== undefined) {
        this.openPage(index, opt_data);

        if (this.__children[index] !== undefined) {
            this.__children[index].navigatePath(path, opt_data);
        }
    }
};


/**
 * @param {string} index
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.selection.Navigation.prototype.openPage = function(index, opt_data) {
    if (this._selectionState.isEnabled(index) &&
       !this._selectionState.isSelected(index)) {

        if (this.__currentPage === null ||
            this.__currentPage.canClose(index)) {

            this._selectionRule.selectIndex(index);

            var page = this._itemsCollection.getItemAt(index);
            if (page instanceof tuna.ui.selection.NavigationPage) {
                this.__currentPage = page;
                if (this.__currentPage !== null) {
                    this.__currentPage.open(opt_data);
                }
            }
        }
    }
};


/**
 * @param {!tuna.ui.selection.Navigation} navigation
 */
tuna.ui.selection.Navigation.prototype.setParent = function(navigation) {
    this.__parent = navigation;
};


/**
 * @param {!tuna.ui.selection.Navigation} navigation
 */
tuna.ui.selection.Navigation.prototype.addChild = function(navigation) {
    navigation.setParent(this);

    var name = navigation.getName();
    if (name !== null) {
        this.__children[name] = navigation;
    }
};


/**
 * @return {!tuna.ui.selection.Navigation}
 */
tuna.ui.selection.Navigation.prototype.getRoot = function() {
    return this.isRoot() ? this : this.__parent.getRoot();
};


/**
 * @return {boolean}
 */
tuna.ui.selection.Navigation.prototype.isRoot = function() {
    return this.__parent === null;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.selection.Navigation.prototype.getPath = function() {
    var result = [];

    if (this.__currentPage !== null) {
        var index = this.__currentPage.getName();
        if (index !== null) {
            result.push(index);

            if (this.__children[index] !== undefined) {
                result = result.concat(this.__children[index].getPath());
            }
        }
    }

    return result;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.selection.Navigation.prototype.getRelatedPath = function() {
    var result = [];

    if (this.__parent !== null) {
        var index = this.getName();
        if (index !== null) {
            result.push(index);
            result = this.__parent.getRelatedPath().concat(result);
        }
    }

    return result;
};
