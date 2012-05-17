

/**
 * @private
 * @type {!Object.<string, !tuna.ui.Widget>}
 */
tuna.ui.buttons.__idTable = {};


/**
 * @private
 * @type {number}
 */
tuna.ui.buttons.__lastId = 0;


/**
 * @param {!Node} target
 * @return {tuna.ui.Widget}
 */
tuna.ui.buttons.getButton = function(target) {
    if (target.id !== '') {
        return tuna.ui.buttons.__idTable[target.id] || null;
    }

    return null;
};


/**
 * @param {!tuna.ui.Widget} button
 */
tuna.ui.buttons.registerButton = function(button) {
    var target = button.getTarget();
    if (target.id === '') {
        target.id = 'button_' + tuna.ui.buttons.__lastId++;
    }

    tuna.ui.buttons.__idTable[target.id] = button;
};

