


/**
 * @param {!tuna.ui.selection.WidgetGroup} widgetGroup
 * @constructor
 */
tuna.ui.selection.collection.WidgetCollection = function(widgetGroup) {

    /**
     * @type {!tuna.ui.selection.WidgetGroup}
     * @protected
     */
    this._widgetGroup = widgetGroup;
};


tuna.ui.selection.collection.WidgetCollection.prototype.clear = function() {};


/**
 * @param {!tuna.ui.IWidget} item
 * @return {?(string|number)}
 */
tuna.ui.selection.collection.WidgetCollection.prototype
    .addItem = function(item) {};


/**
 * @param {!tuna.ui.IWidget} item
 * @return {?(string|number)}
 */
tuna.ui.selection.collection.WidgetCollection.prototype
    .getItemIndex = function(item) {};


/**
 * @param {string|number} index
 * @return {tuna.ui.IWidget}
 */
tuna.ui.selection.collection.WidgetCollection.prototype
    .getItemAt = function(index) {};


/**
 * @param {function((string|number), !tuna.ui.IWidget)} callback
 */
tuna.ui.selection.collection.WidgetCollection.prototype
    .mapItems = function(callback) {};


/**
 * @return {number}
 */
tuna.ui.selection.collection.WidgetCollection.prototype
    .getItemsCount = function() {};
