/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 */
tuna.ui.forms.InputWrapper = function(target) {
    tuna.ui.Widget.call(this, target);

    /**
     * @private
     * @type {Node}
     */
    this.__message = null;

    /**
     * @private
     * @type {string}
     */
    this.__defaultMessage = '';
};

tuna.utils.extend(tuna.ui.forms.InputWrapper, tuna.ui.Widget);

/**
 * @override
 */
tuna.ui.forms.InputWrapper.prototype.init = function() {
    this.__message = tuna.dom.selectOne('.j-message', this._target);

    if (this.__message !== null) {
        this.__defaultMessage = this.__message.innerHTML;
    }
};

/**
 * @param {string} message
 */
tuna.ui.forms.InputWrapper.prototype.showErrorMessage = function(message) {
    tuna.dom.addClass(this._target, 'error');

    if (this.__message !== null) {
        this.__message.innerHTML = message;
    }
};


tuna.ui.forms.InputWrapper.prototype.cleanup = function() {
    tuna.dom.removeClass(this._target, 'error');
    if (this.__message !== null) {
        this.__message.innerHTML = this.__defaultMessage;
    }
};