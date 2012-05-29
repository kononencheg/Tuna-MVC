


/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.popups.Popup = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {!tuna.ui.buttons.ButtonGroup}
     * @protected
     */
    this._controls = new tuna.ui.buttons.ButtonGroup(target, opt_container);

    /**
     * @type {function()}
     * @private
     */
    this.__close = tuna.utils.bind(this.close, this);

    /**
     * @type {function()}
     * @private
     */
    this.__apply = tuna.utils.bind(this.apply, this);


    this._setDefaultOption('close-button-selector', '.j-popup-close');
    this._setDefaultOption('apply-button-selector', '.j-popup-apply');
};


tuna.utils.extend(tuna.ui.popups.Popup, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.popups.Popup.prototype.init = function() {
    this._controls.addAction
        ('close', this.getStringOption('close-button-selector'));

    this._controls.addAction
        ('apply', this.getStringOption('apply-button-selector'));

    this._controls.init();

    this._controls.addEventListener('close', this.__close);
    this._controls.addEventListener('apply', this.__apply);
};


/**
 * @override
 */
tuna.ui.popups.Popup.prototype.destroy = function() {
    this._controls.removeEventListener('close', this.__close);
    this._controls.removeEventListener('apply', this.__apply);
    this._controls.destroy();

    tuna.ui.Widget.prototype.destroy.call(this);
};


/**
 * @return {boolean}
 */
tuna.ui.popups.Popup.prototype.isOpen = function() {
    return !tuna.dom.hasClass(this._target, 'hide');
};


tuna.ui.popups.Popup.prototype.open = function() {
    if (this.dispatch('open')) {
        this.__show();
    }
};


tuna.ui.popups.Popup.prototype.close = function() {
    if (this.dispatch('close')) {
        this.__hide();
    }
};


tuna.ui.popups.Popup.prototype.apply = function() {
    if (this.dispatch('apply')) {
        this.__hide();
    }
};


/**
 * @private
 */
tuna.ui.popups.Popup.prototype.__hide = function() {
    tuna.dom.addClass(this._target, 'hide');
};


/**
 * @private
 */
tuna.ui.popups.Popup.prototype.__show = function() {
    tuna.dom.removeClass(this._target, 'hide');
};
