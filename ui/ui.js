


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
 * @type {!Object.<string, !tuna.ui.IWidgetFactory>}
 */
tuna.ui.__factoryTable = {};



/**
 * @private
 * @type {!Object.<string, string>}
 */
tuna.ui.__selectorsTable = {};


/**
 * @private
 * @type {!Array.<string>}
 */
tuna.ui.__isolators = [];


/**
 * @type {!Node}
 */
tuna.ui.DUMMY_NODE = document.createElement('div');


/**
 * Регистрация фабрики создания виджетов.
 *
 * @see tuna.ui.Container
 * @see tuna.ui.IWidgetFactory
 * @param {string} type Тип создаваемого фабрикой виджета.
 * @param {!tuna.ui.IWidgetFactory} widgetFactory Фабрика виджетов.
 */
tuna.ui.registerTypeFactory = function(type, widgetFactory) {
    tuna.ui.__factoryTable[type] = widgetFactory;
};


/**
 * @param {string} type
 * @param {!tuna.ui.IWidget} widgetPrototype
 */
tuna.ui.registerTypePrototype = function(type, widgetPrototype) {
    tuna.ui.__factoryTable[type] = new tuna.ui.WidgetFactory(widgetPrototype);
};


/**
 * @param {string} type
 * @param {string} selector
 */
tuna.ui.registerTypeSelector = function(type, selector) {
    tuna.ui.__selectorsTable[type] = selector;
};


/**
 * Регистрация CSS-класса изолирующего поиск виджетов во вложенных контейнерах.
 *
 * @param {string} className Изолирующий CSS-класс.
 */
tuna.ui.registerIsolator = function(className) {
    if (tuna.utils.indexOf(className, tuna.ui.__isolators) === -1) {
        tuna.ui.__isolators.push(className);
    }
};


/**
 * @param {string} type
 * @param {!Node} context
 * @param {boolean} useIsolators
 * @return {!Array.<!Node>}
 */
tuna.ui.findWidgetsTargets = function(type, context, useIsolators) {
    var targets = [];

    var selector = tuna.ui.__selectorsTable[type];
    if (selector !== undefined) {

        var applicants = tuna.ui.__findApplicants(context, selector);
        var i = 0,
            l = applicants.length;

        while (i < l) {
            if (tuna.ui.__isInContext(applicants[i], context, useIsolators)) {
                targets.push(applicants[i]);
            }

            i++;
        }

        return targets;
    }

    return targets;
};


/**
 * @param {string} type
 * @param {!Array.<!Node>} targets
 * @param {boolean} autoInit
 * @param {tuna.ui.Container=} opt_container
 * @return {!Array.<!tuna.ui.IWidget>}
 */
tuna.ui.createWidgets = function(type, targets, autoInit, opt_container) {
    var result = [];

    var factory = tuna.ui.__factoryTable[type];
    if (factory !== undefined) {
        var i = 0,
            l = targets.length;

        var widget = null;
        while (i < l) {
            widget = factory.createWidget(targets[i], opt_container);

            if (widget !== null) {
                if (autoInit) {
                    widget.init();
                }

                result.push(widget);
            }

            i++
        }
    }

    return result;
};



/**
 * @private
 * @param {!Node} context
 * @param {string} selector
 * @return {!Array.<!Node>}
 */
tuna.ui.__findApplicants = function(context, selector) {
    var result = tuna.dom.select(selector, context);

    if (tuna.dom.matchesSelector(context, selector)) {
        result.push(context);
    }

    return result;
};


/**
 * @private
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!Node} context Контекcт поиска.
 * @param {boolean} useIsolators
 * @return {boolean} Результат проверки.
 */
tuna.ui.__isInContext = function(target, context, useIsolators) {
    var result = true;

    var i = 0,
        l = tuna.ui.__isolators.length;

    while (i < l) {
        if (target !== context) {
            result = result &&
                    !(!useIsolators && tuna.dom.hasClass(target, tuna.ui.__isolators[i])) &&
                     tuna.dom.getParentWithClass
                         (target, tuna.ui.__isolators[i], context) === null;

            if (!result) {
                break;
            }
        }

        i++;
    }

    return result;
};
