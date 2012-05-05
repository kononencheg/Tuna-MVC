


/**
 * @constructor
 * @extends {tuna.ui.selection.items.AbstractWidgetCollection}
 */
tuna.ui.selection.items.NamedCollection = function() {
    tuna.ui.selection.items.AbstractWidgetCollection.call(this);

    /**
     * @private
     * @type {!Object.<(string|number), !tuna.ui.IWidget>}
     */
    this.__items = {};
};


tuna.utils.extend(
    tuna.ui.selection.items.NamedCollection,
    tuna.ui.selection.items.AbstractWidgetCollection
);


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.addItem = function(item) {
    var name = item.getName();
    if (name !== null) {
        this.__items[name] = item;

        this._selectionGroup.handleCreatedItem(item, name);
    }

    return name;
};


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.getItemIndex =
    function(item) {

    var index = item.getName();
    if (index !== null && this.__items[index] !== undefined) {
        return index;
    }

    return null;
};


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.getItemAt = function(index) {
    return this.__items[index] || null;
};


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.clear = function() {
    for (var name in this.__items) {
        this._selectionGroup.handleRemovedItem(this.__items[name], name);

        delete this.__items[name];
    }
};


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.mapItems =
    function(callback) {

    for (var index in this.__items) {
        callback(index, this.__items[index]);
    }
};


/**
 * @override
 */
tuna.ui.selection.items.NamedCollection.prototype.getItemsCount = function() {
    var i = 0;
    for (var _ in this.__items) {
        i++;
    }

    return i;
};