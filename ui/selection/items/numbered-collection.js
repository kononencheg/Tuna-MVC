


/**
 * @constructor
 * @extends {tuna.ui.selection.items.AbstractWidgetCollection}
 */
tuna.ui.selection.items.NumberedCollection = function() {
    tuna.ui.selection.items.AbstractWidgetCollection.call(this);

    /**
     * @private
     * @type {!Array.<!tuna.ui.IWidget>}
     */
    this.__items = [];
};


tuna.utils.extend(
    tuna.ui.selection.items.NumberedCollection,
    tuna.ui.selection.items.AbstractWidgetCollection
);


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.addItem = function(item) {
    var index = this.__items.push(item) - 1;

    this._selectionGroup.handleCreatedItem(item, index);

    return index;
};


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.getItemIndex
    = function(item) {

    return tuna.utils.indexOf(item, this.__items);
};


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.getItemAt
    = function(index) {

    return this.__items[index] || null;
};


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.clear = function() {
    while (this.__items.length) {
        this._selectionGroup.handleRemovedItem
            (this.__items.pop(), this.__items.length);
    }
};


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.mapItems
    = function(callback) {

    var i = 0,
        l = this.__items.length;

    while (i < l) {
        callback(i, this.__items[i]);

        i++;
    }
};


/**
 * @override
 */
tuna.ui.selection.items.NumberedCollection.prototype.getItemsCount
    = function() {

    return this.__items.length;
};
