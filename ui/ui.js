


/**
 * Область имен классов компонентов отображения.
 * @namespace
 */
tuna.ui = {};


/**
 * Область имен компонентов типа кнопка.
 * @namespace
 */
tuna.ui.buttons = {};


/**
 * Область имен компонентов связанных с Flash.
 * @namespace
 */
tuna.ui.flash = {};


/**
 * Область имен компонентов связанных с формами.
 * @namespace
 */
tuna.ui.forms = {};


/**
 * Область имен компонентов связанных с всплывающими окнами.
 * @namespace
 */
tuna.ui.popups = {};


/**
 * Область имен компонентов связанных с выделением, например, списки
 * и навигация.
 * @namespace
 */
tuna.ui.selection = {};


/**
 * Область имен классов-наборов элементов в списках выделения.
 * @namespace
 */
tuna.ui.selection.items = {};


/**
 * Область имен классов-правил выделения элементов.
 * @namespace
 */
tuna.ui.selection.rule = {};


/**
 * Область имен классов управления отображением выделенных элементов.
 * @namespace
 */
tuna.ui.selection.view = {};


/**
 * Область имен компонентов связанных с трансформацией DOM-дерева.
 * @namespace
 */
tuna.ui.transformers = {};


/**
 * @private
 * @type {number}
 */
tuna.ui.__lastId = 0;


/**
 * @private
 * @type {!Object.<string, !tuna.ui.MarkupWidgetFactory>}
 */
tuna.ui.__typeTable = {};


/**
 * @private
 * @type {!Array.<string>}
 */
tuna.ui.__isolators = [];


/**
 * Регистрация фабрики создания виджетов из разметки.
 *
 * @see tuna.ui.Container
 * @see tuna.ui.MarkupWidgetFactory
 * @param {string} type Тип создаваемого фабрикой виджета.
 * @param {!tuna.ui.MarkupWidgetFactory} widgetFactory Фабрика виджетов.
 */
tuna.ui.registerFactory = function(type, widgetFactory) {
    tuna.ui.__typeTable[type] = widgetFactory;
};


/**
 * Получение фабрики по типу создаваемого ею виджета.
 *
 * @param {string} type Тип виджета.
 * @return {tuna.ui.MarkupWidgetFactory} Фабрика виджетов.
 */
tuna.ui.getFactory = function(type) {
    if (tuna.ui.__typeTable[type] !== undefined) {
        return tuna.ui.__typeTable[type];
    }

    return null;
};


/**
 * Регистрация CSS-класса изолирующего поиск виджетов во вложенных контейнерах.
 *
 * @see tuna.ui.MarkupWidgetFactory#_isInContext
 * @param {string} className Изолирующий CSS-класс.
 */
tuna.ui.registerIsolator = function(className) {
    if (tuna.utils.indexOf(className, tuna.ui.__isolators) === -1) {
        tuna.ui.__isolators.push(className);
    }
};


/**
 * Получение всех изолирующих CSS-классов.
 *
 * @return {!Array.<string>} Массив CSS-классов.
 */
tuna.ui.getIsolators = function() {
    return tuna.ui.__isolators;
};

