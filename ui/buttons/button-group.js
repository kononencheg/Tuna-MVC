


/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.buttons.ButtonGroup = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @private
     * @type {?string}
     */
    this.__defaultAction = null;

    /**
     * @private
     * @type {boolean}
     */
    this.__isPreventDefault = true;

    this._setDefaultOption('button-selector', '.j-button');
};


tuna.utils.extend(tuna.ui.buttons.ButtonGroup, tuna.ui.Widget);


/**
 * @param {string} action
 */
tuna.ui.buttons.ButtonGroup.prototype.setDefaultAction = function(action) {
    this.__defaultAction = action;
};


/**
 * @param {boolean} isPreventDefault
 */
tuna.ui.buttons.ButtonGroup.prototype.setPreventDefault
    = function(isPreventDefault) {

    this.__isPreventDefault = isPreventDefault;
};


/**
 * @override
 */
tuna.ui.buttons.ButtonGroup.prototype.init = function() {
    var self = this;

    var buttonSelector = this.getStringOption('button-selector');
    if (buttonSelector !== null) {
        tuna.dom.addChildEventListener(
            this._target, buttonSelector, 'click', function(event) {
                if (self.__isPreventDefault) {
                    tuna.dom.preventDefault(event);
                }

                var button = tuna.ui.buttons.create(this);
                var action = button.getStringOption('action');
                if (action === null) {
                    action = self.__defaultAction;
                }

                if (action !== null) {
                    if (!self.dispatch(action, button)) {
                        tuna.dom.stopPropagation(event);
                    }
                }
            }
        );
    }
};