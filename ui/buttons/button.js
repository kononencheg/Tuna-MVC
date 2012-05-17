


/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.buttons.Button = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    var self = this;

    /**
     * @type {function(Event)}
     * @private
     */
    this.__clickHandler = function(event) {
        if (self.isEnabled()) {
            self.dispatch('click');
        } else {
            tuna.dom.stopPropagation(event);
        }
    };
};


tuna.utils.extend(tuna.ui.buttons.Button, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.buttons.Button.prototype.init = function() {
    tuna.dom.addEventListener(this._target, 'click', this.__clickHandler);
};


tuna.ui.buttons.Button.prototype.destroy = function() {
    tuna.dom.removeEventListener(this._target, 'click', this.__clickHandler);

    tuna.ui.Widget.prototype.destroy.call(this);
};
