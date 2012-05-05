


/**
 * @implements {tuna.ui.selection.items.IWidgetCollection}
 * @constructor
 */
tuna.ui.selection.items.AbstractWidgetCollection = function() {

    /**
     * @type {tuna.ui.selection.AbstractSelectionGroup}
     * @protected
     */
    this._selectionGroup = null;
};


/**
 * @param {!tuna.ui.selection.AbstractSelectionGroup} group
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.setSelectionGroup
    = function(group) {

    this._selectionGroup = group;
};


/**
 * @override
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.addItem =
    function(item) {};


/**
 * @override
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.getItemIndex
    = function(item) {};


/**
 * @override
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.getItemAt
    = function(index) {};


/**
 * @override
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.mapItems
    = function(callback) {};


tuna.ui.selection.items.AbstractWidgetCollection.prototype.clear =
    function() {};


/**
 * @override
 */
tuna.ui.selection.items.AbstractWidgetCollection.prototype.getItemsCount
    = function() {};
