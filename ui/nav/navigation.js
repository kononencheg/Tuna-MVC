


/**
 * @constructor
 * @extends {tuna.ui.selection.WidgetGroup}
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.nav.Navigation = function(target, opt_container) {
    tuna.ui.selection.WidgetGroup.call(this, target, opt_container);

    /**
     * @type {tuna.ui.nav.NavigationPage}
     * @protected
     */
    this._currentPage = null;

    /**
     * @type {tuna.ui.nav.Navigation}
     * @protected
     */
    this._parent = null;
    
    /**
     * @type {!Object.<(string|number), !tuna.ui.nav.Navigation>}
     * @protected
     */
    this._children = {};

    /**
     * @type {!Array.<!tuna.ui.nav.NavigationState>}
     * @protected
     */
    this._history = [];

    /**
     * @type {tuna.ui.nav.NavigationState}
     * @protected
     */
    this._currentState = null;

    /**
     *
     * @type {Array.<!tuna.ui.nav.INavigationHandler>}
     * @protected
     */
    this._handlers = [];


    this._setDefaultOption('item-selector', '.j-navigation-page');
    this._setDefaultOption('link-selector', '.j-link');
    this._setDefaultOption('back-link-selector', '.j-back-link');
};


tuna.utils.extend(tuna.ui.nav.Navigation, tuna.ui.selection.WidgetGroup);


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype.init = function() {
    tuna.ui.selection.WidgetGroup.prototype.init.call(this);

    if (this._container instanceof tuna.ui.nav.NavigationPage) {
        var navigation = this._container.getNavigation();
        if (navigation !== null) {
            navigation.addChild(this);
        }
    }

    var self = this;

    var linkSelector = this.getStringOption('link-selector');
    if (linkSelector !== null) {
        tuna.dom.addChildEventListener(
            this._target, linkSelector, 'click', function(event) {
                tuna.dom.preventDefault(event);
                tuna.dom.stopPropagation(event);

                var path = this.getAttribute('href') ||
                           this.getAttribute('data-href');

                if (path !== null) {
                    var data = tuna.dom.getAttributesData(this);
                    delete data['href'];

                    self.navigate(path, data);
                }
            }
        );
    }

    var backLinkSelector = this.getStringOption('back-link-selector');
    if (backLinkSelector !== null) {
        tuna.dom.addChildEventListener(
            this._target, backLinkSelector, 'click', function(event) {
                tuna.dom.preventDefault(event);
                tuna.dom.stopPropagation(event);

                self.back();
            }
        );
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype.destroy = function() {
    if (this._parent !== null) {
        this._parent.removeChild(this);
    }

    for (var index in this._children) {
        this.removeChild(this._children[index]);
    }

    this._history.length = 0;
    this._handlers.length = 0;

    this._currentPage = null;
    this._currentState = null;

    tuna.ui.selection.WidgetGroup.prototype.destroy.call(this);
};

/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype._createCollection = function() {
    return new tuna.ui.selection.collection.NamedCollection(this);
};


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype._createRule = function() {
    return new tuna.ui.selection.rule.SingleSelectionRule(this._selectionState);
};


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype._createFactory = function() {
    return new tuna.ui.WidgetFactory
        (new tuna.ui.nav.NavigationPage(tuna.ui.DUMMY_NODE));
};


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype.handleCreatedWidget = function(page) {
    if (page instanceof tuna.ui.nav.NavigationPage) {
        page.setNavigation(this);

        if (page.isSelected()) {
            this._currentPage = page;
            this._currentPage.open();
        }
    }
};



tuna.ui.nav.Navigation.prototype.back = function() {
    if (this.isRoot()) {
        if (this._history.length > 0) {
            this._currentState = this._history.pop();

            this._navigatePath
                (this._currentState.getPath(), this._currentState.getData());
        }
    } else {
        this.getRoot().back();
    }

};


/**
 * @param {string|!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.Navigation.prototype.navigate = function(path, opt_data) {
    if (path instanceof Array) {
        if (this.isRoot()) {
            if (this._currentState === null) {
                this._currentState = 
                    new tuna.ui.nav.NavigationState(this.getPath());
            }

            this._navigatePath(path, opt_data);

            this._history.push(this._currentState);

            this._currentState = 
                new tuna.ui.nav.NavigationState(this.getPath(), opt_data);

        } else {
            this._navigatePath(path, opt_data);
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
 * @param {string} index
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.Navigation.prototype.openPage = function(index, opt_data) {
    if (this._selectionState.isEnabled(index) &&
       !this._selectionState.isSelected(index)) {

        if (this._currentPage === null ||
            this._currentPage.canClose(index)) {

            var page = this._collection.getItemAt(index);
            if (page instanceof tuna.ui.nav.NavigationPage) {
                page.open(opt_data);

                this._currentPage = page;

                this._selectionRule.selectIndex(index);

                var i = this._handlers.length - 1;
                while (i >= 0) {
                    this._handlers[i].handlePage(index, opt_data);

                    i--;
                }

                this.dispatch('open-page', index);

                this._currentPage = page;
            }
        }
    }
};


/**
 * @protected
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.Navigation.prototype._navigatePath = function(path, opt_data) {
    var i = this._handlers.length - 1;
    while (i >= 0) {
        this._handlers[i].handlePath(path, opt_data);

        i--;
    }

    var index = path.shift();
    while (index === '' && path.length > 0) {
        index = path.shift();
    }

    if (index !== undefined) {
        this.openPage(index, opt_data);

        if (this._children[index] !== undefined) {
            this._children[index]._navigatePath(path, opt_data);
        }
    }
};


/**
 * @param {!tuna.ui.nav.Navigation} navigation
 */
tuna.ui.nav.Navigation.prototype.addChild = function(navigation) {
    var name = navigation.getName();
    if (name !== null) {
        this._children[name] = navigation;
        this._children[name]._parent = this;
    }
};


/**
 * @param {!tuna.ui.nav.Navigation} navigation
 */
tuna.ui.nav.Navigation.prototype.removeChild = function(navigation) {
    var name = navigation.getName();
    if (name !== null && this._children[name] === navigation &&
        navigation._parent === this) {

        navigation._parent = null;
        delete this._children[name];
    }
};

/**
 * @return {!tuna.ui.nav.Navigation}
 */
tuna.ui.nav.Navigation.prototype.getRoot = function() {
    return this.isRoot() ? this : this._parent.getRoot();
};


/**
 * @return {boolean}
 */
tuna.ui.nav.Navigation.prototype.isRoot = function() {
    return this._parent === null;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.nav.Navigation.prototype.getPath = function() {
    var result = [];

    if (this._currentPage !== null) {
        var index = this._currentPage.getName();
        if (index !== null) {
            result.push(index);

            if (this._children[index] !== undefined) {
                result = result.concat(this._children[index].getPath());
            }
        }
    }

    return result;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.nav.Navigation.prototype.getRelatedPath = function() {
    var result = [];

    if (this._parent !== null) {
        var index = this.getName();
        if (index !== null) {
            result.push(index);
            result = this._parent.getRelatedPath().concat(result);
        }
    }

    return result;
};


/**
 * @param {!tuna.ui.nav.INavigationHandler} handler
 */
tuna.ui.nav.Navigation.prototype.addHandler = function(handler) {
    if (tuna.utils.indexOf(handler, this._handlers) === -1) {
        this._handlers.push(handler);

        var index = this._selectionState.getLastSelectedIndex();
        if (index !== null) {
            handler.handlePage(index);
        }
    }
};



/**
 * @param {!tuna.ui.nav.INavigationHandler} handler
 */
tuna.ui.nav.Navigation.prototype.removeHandler = function(handler) {
    var index = tuna.utils.indexOf(handler, this._handlers)
    if (index !== -1) {
        this._handlers.splice(index, 1);
    }
};