


/**
 * @interface
 */
tuna.ui.selection.items.IWidgetCollection = function() {};


/**
 * @param {!tuna.ui.IWidget} item
 * @return {?(string|number)}
 */
tuna.ui.selection.items.IWidgetCollection.prototype.addItem = function(item) {};


/**
 * @param {!tuna.ui.IWidget} item
 * @return {?(string|number)}
 */
tuna.ui.selection.items.IWidgetCollection.prototype.getItemIndex
    = function(item) {};


/**
 * @param {string|number} index
 * @return {tuna.ui.IWidget}
 */
tuna.ui.selection.items.IWidgetCollection.prototype.getItemAt
    = function(index) {};


/**
 * @param {function((string|number), !tuna.ui.IWidget)} callback
 */
tuna.ui.selection.items.IWidgetCollection.prototype.mapItems
    = function(callback) {};


tuna.ui.selection.items.IWidgetCollection.prototype.clear = function() {};


/**
 * @return {number}
 */
tuna.ui.selection.items.IWidgetCollection.prototype.getItemsCount
    = function() {};
