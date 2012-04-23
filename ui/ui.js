


/**
 * @namespace Область имен классов компонентов отображения.
 */
tuna.ui = {};


/**
 * @namespace Область имен компонентов типа кнопка.
 */
tuna.ui.buttons = {};


/**
 * @namespace Область имен компонентов связанных с Flash.
 */
tuna.ui.flash = {};


/**
 * @namespace Область имен компонентов связанных с формами.
 */
tuna.ui.forms = {};


/**
 * @namespace Область имен компонентов связанных с всплывающими окнами.
 */
tuna.ui.popups = {};


/**
 * @namespace Область имен компонентов связанных с выделением, например, списки
 * и навигация.
 */
tuna.ui.selection = {};


/**
 * @namespace Область имен классов-наборов элементов в списках выделения.
 */
tuna.ui.selection.items = {};


/**
 * @namespace Область имен классов-правил выделения элементов.
 */
tuna.ui.selection.rule = {};


/**
 * @namespace Область имен классов управления отображением выделенных элементов.
 */
tuna.ui.selection.view = {};


/**
 * @namespace Область имен компонентов связанных с трансформацией DOM-дерева.
 */
tuna.ui.transformers = {};


/**
 * @private
 * @type {number}
 */
tuna.ui.__lastId = 0;


/**
 * @private
 * @type {!Object.<string, !tuna.ui.Module>}
 */
tuna.ui.__typeTable = {};


/**
 * @private
 * @type {!Array.<string>}
 */
tuna.ui.__isolators = [];


/**
 * @param {string} type
 * @param {!tuna.ui.Module} module
 */
tuna.ui.registerModule = function(type, module) {
    tuna.ui.__typeTable[type] = module;
};


/**
 * @param {string} type
 * @return {tuna.ui.Module}
 */
tuna.ui.getModule = function(type) {
    if (tuna.ui.__typeTable[type] !== undefined) {
        return tuna.ui.__typeTable[type];
    }

    return null;
};


/**
 * @return {!Array.<string>}
 */
tuna.ui.getIsolators = function() {
    return tuna.ui.__isolators;
};


/**
 * @param {string} className
 */
tuna.ui.addIsolator = function(className) {
    if (tuna.utils.indexOf(className, tuna.ui.__isolators) === -1) {
        tuna.ui.__isolators.push(className);
    }
};
