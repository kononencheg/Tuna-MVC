

/**
 * @private
 * @type {!Object.<string, !tuna.ui.buttons.Button>}
 */
tuna.ui.buttons.__idTable = {};


/**
 * @private
 * @type {number}
 */
tuna.ui.buttons.__lastId = 0;


/**
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 * @return {!tuna.ui.buttons.Button}
 */
tuna.ui.buttons.create = function(target, opt_container) {
    if (target.id === '') {
        target.id = 'button_' + tuna.ui.buttons.__lastId++;
    }

    if (tuna.ui.buttons.__idTable[target.id] === undefined) {
        var button = new tuna.ui.buttons.Button(target, opt_container);
        button.init();

        tuna.ui.buttons.__idTable[target.id] = button;
    }

    return tuna.ui.buttons.__idTable[target.id];
};
