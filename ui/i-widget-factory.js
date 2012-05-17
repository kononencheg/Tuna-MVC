


/**
 * @interface
 */
tuna.ui.IWidgetFactory = function() {};


/**
 * @param {!Node} target Целевой элемент виджета
 * @param {tuna.ui.Container=} opt_container Контейнер в котором
 *        инициализируется виджет.
 * @return {!tuna.ui.Widget} Созданный виджет.
 */
tuna.ui.IWidgetFactory.prototype
    .createWidget = function(target, opt_container) {};

