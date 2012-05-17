


/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.buttons.ButtonGroup = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {string}
     * @protected
     */
    this.__buttonsSelector = '';

    /**
     * @type {!Object.<string, string>}
     * @protected
     */
    this.__selectorActions = {};

    /**
     * @type {tuna.ui.IWidgetFactory}
     * @protected
     */
    this._buttonFactory = null;

    /**
     * @type {!Array.<!tuna.ui.Widget>}
     * @protected
     */
    this.__buttons = [];

    var self = this;

    /**
     * @type {function(Event)}
     * @private
     */
    this.__clickHandler = function(event) {
        tuna.dom.preventDefault(event);

        var button = tuna.ui.buttons.getButton(this);
        if (button === null) {
            button = self._buttonFactory.createWidget(this, self._container);
            button.init();

            self.__buttons.push(button);
            
            tuna.ui.buttons.registerButton(button);
        }

        for (var selector in self.__selectorActions) {
            if (tuna.dom.matchesSelector(this, selector)) {
                if (!self.dispatch(self.__selectorActions[selector], button)) {
                    tuna.dom.stopPropagation(event);
                }
            }
        }
    };
};


tuna.utils.extend(tuna.ui.buttons.ButtonGroup, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.buttons.ButtonGroup.prototype.init = function() {
    this._buttonFactory = this._createFactory();

    var actionSelectors =
        tuna.dom.getAttributesData(this._target, 'data-action-');

    var selectors = [];
    var selector = null;
    for (var action in actionSelectors) {
        selector = actionSelectors[action];
        this.__selectorActions[selector] = action;
        selectors.push(selector);
    }

    this.__buttonsSelector = selectors.join(',');

    tuna.dom.addChildEventListener
        (this._target, this.__buttonsSelector, 'click', this.__clickHandler);
};


/**
 * @override
 */
tuna.ui.buttons.ButtonGroup.prototype.destroy = function() {
    tuna.dom.removeChildEventListener
        (this._target, this.__buttonsSelector, 'click', this.__clickHandler);

    this.__buttonsSelector = '';
    this.__classActions = {};
    
    while (this.__buttons.length > 0) {
        this.__buttons.shift().destroy();
    }

    this._destroyFactory();

    tuna.ui.Widget.prototype.destroy.call(this);
};


/**
 * @return {tuna.ui.IWidgetFactory}
 * @protected
 */
tuna.ui.buttons.ButtonGroup.prototype._createFactory = function() {
    return new tuna.ui.WidgetFactory
        (new tuna.ui.buttons.Button(tuna.ui.DUMMY_NODE));
};


/**
 * @protected
 */
tuna.ui.buttons.ButtonGroup.prototype._destroyFactory = function() {
    this._buttonFactory = null;
};
