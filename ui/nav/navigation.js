


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

    /**
     * @type {!tuna.ui.buttons.ButtonGroup}
     * @protected
     */
    this._controls = new tuna.ui.buttons.ButtonGroup(target, opt_container);


    var self = this;

    /**
     * @type {function()}
     * @private
     */
     this.__navigateHandler = function(event, button) {
         var path = button.getTarget().getAttribute('href');
         if (path !== null) {
            self.navigate(path, button.getOptions());
         }
     };

    /**
     * @type {function()}
     * @private
     */
    this.__backHandler = function(event) {
        self.back();
    };

    this._setDefaultOption('item-selector', '.j-navigation-page');

    this._controls.setOption('action-navigate', 'a.j-link');
    this._controls.setOption('action-back', '.j-history-back');
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

    this._controls.init();
    this._controls.addEventListener('navigate', this.__navigateHandler);
    this._controls.addEventListener('back', this.__backHandler);

    if (this._target === document.body) {
        tuna.dom.addEventListener(window, 'popstate', this.__backHandler);

        this.navigate
           (location.pathname, tuna.utils.urlDecode(location.search.substr(1)));
    }
};


/**
 * @inheritDoc
 */
tuna.ui.nav.Navigation.prototype.destroy = function() {
    this._controls.removeEventListener('navigate', this.__navigateHandler);
    this._controls.removeEventListener('back', this.__backHandler);

    this._controls.destroy();

    if (this._target === document.body) {
        tuna.dom.removeEventListener(window, 'popstate', this.__backHandler);
    }

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
        var fullPath = path.split('/');

        if (path.indexOf('/') !== 0) {
            fullPath = this.getAbsolutePath().concat(fullPath);
        }

        this.getRoot().navigate(fullPath, opt_data);
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
 * @protected
 * @param {!Array.<string>} path
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.Navigation.prototype._navigatePath = function(path, opt_data) {
    var index = path.shift();
    while (index === '' && path.length > 0) {
        index = path.shift();
    }

    if (index !== undefined) {
        this._handlePath(index, path, opt_data);
        this._openPage(index, opt_data);

        if (this._children[index] !== undefined) {
            this._children[index]._navigatePath(path, opt_data);
        }
    }
};


/**
 * @protected
 * @param {string} index
 * @param {Object.<string, string>=} opt_data
 */
tuna.ui.nav.Navigation.prototype._openPage = function(index, opt_data) {
    if (this._selectionState.isEnabled(index) &&
        !this._selectionState.isSelected(index)) {

        if (this._currentPage === null ||
            this._currentPage.canClose(index)) {

            var page = this._collection.getItemAt(index);
            if (page instanceof tuna.ui.nav.NavigationPage) {
                this._currentPage = page;
                this._currentPage.open(opt_data);

                this._selectionRule.selectIndex(index);
            }
        }
    }
};


tuna.ui.nav.Navigation.prototype
    ._handlePath = function(pageIndex, restPath, opt_data) {

    if (this._target === document.body &&
        window.history.pushState !== undefined) {

        var location = '/' + pageIndex + '/' + restPath.join('/');

        if (opt_data !== undefined) {
            var encodedData = tuna.utils.urlEncode(opt_data);
            if (encodedData.length > 0) {
                location += '?' + encodedData;
            }
        }

        window.history.pushState(null, '', location);
    }

    var i = this._handlers.length - 1;

    while (i >= 0) {
        this._handlers[i].handlePath(pageIndex, restPath, opt_data);
        i--;
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
tuna.ui.nav.Navigation.prototype.getAbsolutePath = function() {
    var result = [];

    if (this._parent !== null) {
        var index = this.getName();
        if (index !== null) {
            result.push(index);
            result = this._parent.getAbsolutePath().concat(result);
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

        var path = this.getPath();
        var index = path.shift();

        handler.handlePath(index, path);
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