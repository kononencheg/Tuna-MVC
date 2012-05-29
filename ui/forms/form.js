


/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.forms.Form = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @private
     * @type {Node}
     */
    this.__formMessage = null;

    /**
     * @private
     * @type {!Object.<string, !tuna.ui.forms.InputWrapper>}
     */
    this.__inputTable = {};

};


tuna.utils.extend(tuna.ui.forms.Form, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.forms.Form.prototype.init = function() {
    this.__formMessage = tuna.dom.selectOne('.j-form-message', this._target);

    var callbackInput = document.createElement('input');
    callbackInput.type = 'hidden';
    callbackInput.name = '__callback';

    this._target.appendChild(callbackInput);

    var self = this;

    tuna.dom.addEventListener(this._target, 'submit', function(event) {
        if (self.isEnabled()) {
            callbackInput.value
                = 'form_callback' + (Math.random() + '').substr(2);

            window[callbackInput.value] = function(response) {
                self.__handleResponse(tuna.utils.clone(response));
                window[callbackInput.value] = undefined;
            };

            self.__prepareTo(event.type, event);
        } else {
            tuna.dom.preventDefault(event);
        }
    });

    tuna.dom.addEventListener(this._target, 'reset', function(event) {
        if (self.isEnabled()) {
            self.__prepareTo(event.type, event);
        } else {
            tuna.dom.preventDefault(event);
        }
    });
};


/**
 * @override
 */
tuna.ui.forms.Form.prototype.disable = function() {
    // ...
};


/**
 * @param {string} name
 * @return {*}
 */
tuna.ui.forms.Form.prototype.getValue = function(name) {
    var result = new tuna.utils.SafeObject({});

    var elements = tuna.utils.toArray(this._target.elements);
    var i = 0,
        l = elements.length;

    var element = null;
    var value = null;
    while (i < l) {
        element = elements[i];

        if (element.name !== undefined && element.name.length > 0 &&
           (element.name === name || element.name.indexOf(name + '[') === 0)) {

            value = this.__getInputValue(element);

            if (value !== null) {
                result.setByPath(value, tuna.utils.parseUrlToken(element.name));
            }
        }

        i++;
    }

    return result.get(name);
};


/**
 * @param {string} name
 * @param {*} value
 */
tuna.ui.forms.Form.prototype.setValue = function(name, value) {
    var data = new tuna.utils.SafeObject({});
    data.set(value, name);

    var elements = tuna.utils.toArray(this._target.elements);
    var i = 0,
        l = elements.length;

    var element = null;
    while (i < l) {
        element = elements[i];

        if (element.name !== undefined && element.name.length > 0 &&
           (element.name === name || element.name.indexOf(name + '[') === 0)) {

            this.__setInputValue
              (element, data.getByPath(tuna.utils.parseUrlToken(element.name)));
        }

        i++;
    }
};


/**
 * @param {!Node} input
 * @return {?string}
 * @private
 */
tuna.ui.forms.Form.prototype.__getInputValue = function(input) {
    if (input.value !== undefined && !input.disabled) {
        if (input.type !== 'checkbox' &&
            input.type !== 'radio' || input.checked) {
            return input.value
        }
    }

    return null;
};


/**
 * @param {!Node} input
 * @param {*} value
 */
tuna.ui.forms.Form.prototype.__setInputValue = function(input, value) {
    if (input.value !== undefined && !input.disabled) {
        if (value === null) {
            value = '';
        }

        if (input.type !== 'checkbox' &&
            input.type !== 'radio') {
            input.value = value.toString();
        } else {
            if (value instanceof Array) {
                var checked = false;

                var i = 0,
                    l = value.length;

                while (i < l) {
                    if (input.value === value[i].toString()) {
                        checked = true;

                        break;
                    }

                    i++;
                }

                input.checked = checked;
            } else {
                input.checked = input.value === value.toString();
            }
        }
    }
};

/**
 *
 * @param {string} name
 * @param {boolean} isEnabled
 */
tuna.ui.forms.Form.prototype.setInputEnabled = function(name, isEnabled) {
    var element = this._target.elements[name];
    if (element !== undefined) {
        if (element.value === undefined) {
            var i = 0,
                l = element.length;

            while (i < l) {
                if (isEnabled) {
                    element[i].removeAttribute('disabled');
                } else {
                    element[i].setAttribute('disabled', true);
                }

                i++;
            }
        } else {
            if (isEnabled) {
                element.removeAttribute('disabled');
            } else {
                element.setAttribute('disabled', true);
            }
        }
    }
};


tuna.ui.forms.Form.prototype.submit = function() {
    this.__prepareTo('submit');
    this._target.submit();
};


tuna.ui.forms.Form.prototype.reset = function() {
    this.__prepareTo('reset');
    this._target.reset();
};

/**
 * @return {Object}
 */
tuna.ui.forms.Form.prototype.serialize = function() {
    return tuna.ui.forms.serialize(this._target);
};

/**
 * @param {string} type
 * @param {!Event=} event
 */
tuna.ui.forms.Form.prototype.__prepareTo = function(type, event) {
    if (this.dispatch(type)) {
        this.__clearMessage();
        this.__clearInputs();
    } else if (event !== undefined) {
        tuna.dom.preventDefault(event);
    }
};

/**
 * @private
 * @param {Object} data
 */
tuna.ui.forms.Form.prototype.__handleResponse = function(data) {
    var response = data['response'];
    var errors = data['errors'];

    if (response !== undefined) {
        var recordName = this.getStringOption('record-type');
        if (recordName !== null) {
            response = tuna.rest.populateRecords(response, recordName);
        }

        this.dispatch('result', response);
    } else if (errors !== undefined) {
        this.__showErrors(errors);
        this.dispatch('error', errors);
    }
};

/**
 * @private
 * @param {Array.<Object>} errors
 */
tuna.ui.forms.Form.prototype.__showErrors = function(errors) {
    var i = 0,
        l = errors.length;

    var error = null;
    while (i < l) {
        error = errors[i];
        if (error['param'] !== undefined) {
            this.__showInputError(error['param'], error['message']);
        } else {
            this.__showErrorMessage(error['message']);
        }

        i++;
    }
};

/**
 * @private
 * @param {string} name
 * @return {tuna.ui.forms.InputWrapper}
 */
tuna.ui.forms.Form.prototype.__getFormInput = function(name) {
    var result = null;

    if (this.__inputTable[name] === undefined) {
        var inputWrapper
            = tuna.dom.selectOne('.j-' + name + '-input', this._target);

        if (inputWrapper !== null) {
            var input = new tuna.ui.forms.InputWrapper(inputWrapper);
            input.init();

            this.__inputTable[name] = input;
        }
    }

    if (this.__inputTable[name] !== undefined) {
        result = this.__inputTable[name];
    }

    return result;
};

/**
 * @private
 */
tuna.ui.forms.Form.prototype.__clearMessage = function() {
    if (this.__formMessage !== null) {
        this.__formMessage.innerHTML = '';
        tuna.dom.addClass(this.__formMessage, 'hide');
    }
};

/**
 * @private
 * @param {string} message
 */
tuna.ui.forms.Form.prototype.__showErrorMessage = function(message) {
    if (this.__formMessage !== null) {
        this.__formMessage.innerHTML += message + '<br />';
        tuna.dom.removeClass(this.__formMessage, 'hide');
    }
};

/**
 * @private
 * @param {string} name
 * @param {string} message
 */
tuna.ui.forms.Form.prototype.__showInputError = function(name, message) {
    var formInput = this.__getFormInput(name);
    if (formInput !== null) {
        formInput.showErrorMessage(message);
    } else {
        this.__showErrorMessage(message);
    }
};

/**
 * @private
 */
tuna.ui.forms.Form.prototype.__clearInputs = function() {
    for (var name in this.__inputTable) {
        this.__inputTable[name].cleanup();
    }
};
