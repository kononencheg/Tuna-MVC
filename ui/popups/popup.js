/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 */
tuna.ui.popups.Popup = function(target) {
    tuna.ui.Widget.call(this, target);

    /**
     * @private
     * @type boolean
     */
    this.__isInit = false;

};

tuna.utils.extend(tuna.ui.popups.Popup, tuna.ui.Widget);

/**
 * @override
 */
tuna.ui.popups.Popup.prototype.init = function() {
    if (!this.__isInit) {
        var self = this;

        tuna.dom.addChildEventListener(
            this._target, '.j-popup-close', 'click',
            function(event) {
                tuna.dom.preventDefault(event);
                self.close();
            }
        );

        tuna.dom.addChildEventListener(
            this._target, '.j-popup-apply', 'click',
            function(event) {
                tuna.dom.preventDefault(event);
                self.apply();
            }
        );
    }
};

/**
 * @return {boolean}
 */
tuna.ui.popups.Popup.prototype.isOpen = function() {
    return tuna.dom.hasClass(this._target, 'show');
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
    if (this.dispatch('apply', this.__collectData())) {
        this.__hide();
    }
};

/**
 * @private
 */
tuna.ui.popups.Popup.prototype.__hide = function() {
    tuna.dom.removeClass(this._target, 'show');
};

/**
 * @private
 */
tuna.ui.popups.Popup.prototype.__show = function() {
    tuna.dom.addClass(this._target, 'show');
};

/**
 * @private
 * @return {Object.<string, string>}
 */
tuna.ui.popups.Popup.prototype.__collectData = function() {
    var form = tuna.dom.selectOne('form.j-popup-form', this._target);

    if (form !== null) {
        return tuna.ui.forms.serialize(form);
    }

    return null;
};
