


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
    this._buttonsSelector = '';

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
     * @type {!Object.<string, !tuna.ui.Widget>}
     * @protected
     */
    this._buttons = {};


    var self = this;

    /**
     * @type {function(Event)}
     * @private
     */
    this.__clickHandler = function(event) {
        tuna.dom.preventDefault(event);

        var button = self._getButton(this);
        if (button === null) {
            button = self._buttonFactory.createWidget(this, self._container);
            button.init();

            self._saveButton(button);
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
 *
 * @param {string} action
 * @param {?string} selector
 */
tuna.ui.buttons.ButtonGroup.prototype.addAction = function(action, selector) {
    if (selector !== null && selector.length > 0) {
        this.__selectorActions[selector] = action;
    }
};


/**
 * @override
 */
tuna.ui.buttons.ButtonGroup.prototype.init = function() {
    this._buttonFactory = this._createFactory();

    var actionSelectors =
        tuna.dom.getAttributesData(this._target, 'data-action-');

    for (var action in actionSelectors) {
        this.__selectorActions[actionSelectors[action]] = action;
    }

    var selectors = [];
    for (var selector in this.__selectorActions) {
        selectors.push(selector);
    }

    this._buttonsSelector = selectors.join(',');

    tuna.dom.addChildEventListener
        (this._target, this._buttonsSelector, 'click', this.__clickHandler);
};


/**
 * @override
 */
tuna.ui.buttons.ButtonGroup.prototype.destroy = function() {
    tuna.dom.removeChildEventListener
        (this._target, this._buttonsSelector, 'click', this.__clickHandler);

    for (var id in this._buttons) {
        this._buttons[id].destroy();
    }

    this._buttonsSelector = '';
    this._buttons = {};

    this.__selectorActions = {};

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


/**
 * @param {!tuna.ui.Widget} button
 * @protected
 */
tuna.ui.buttons.ButtonGroup.prototype._saveButton = function(button) {
    var target = button.getTarget();
    if (target.id === '') {
        target.id = 'button_' + tuna.ui.__lastId++;
    }

    this._buttons[target.id] = button;
};


/**
 * @param {!Node} target
 * @return {tuna.ui.Widget}
 * @protected
 */
tuna.ui.buttons.ButtonGroup.prototype._getButton = function(target) {
    if (target.id !== '') {
        return this._buttons[target.id] || null;
    }

    return null;
};