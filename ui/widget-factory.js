


/**
 * @implements {tuna.ui.IWidgetFactory}
 * @constructor
 * @param {!tuna.ui.IWidget} widgetPrototype
 */
tuna.ui.WidgetFactory = function(widgetPrototype) {

    /**
     * @type {!tuna.ui.IWidget}
     * @private
     */
    this.__widgetPrototype = widgetPrototype;
};


/**
 * @inheritDoc
 */
tuna.ui.WidgetFactory.prototype.createWidget = function(target, opt_container) {
    return this.__widgetPrototype.clone(target, opt_container);
};
