


/**
 * @constructor
 * @extends {tuna.ui.selection.collection.WidgetCollection}
 * @param {!tuna.ui.selection.WidgetGroup} widgetGroup
 */
tuna.ui.selection.collection.NamedCollection = function(widgetGroup) {
    tuna.ui.selection.collection.WidgetCollection.call(this, widgetGroup);

    /**
     * @private
     * @type {!Object.<(string|number), !tuna.ui.Widget>}
     */
    this.__widgets = {};
};


tuna.utils.extend(
    tuna.ui.selection.collection.NamedCollection,
    tuna.ui.selection.collection.WidgetCollection
);


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype
    .addItem = function(item) {

    var name = item.getName();
    if (name !== null) {
        this.__widgets[name] = item;

        this._widgetGroup.handleCreatedWidget(item, name);
    }

    return name;
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype
    .removeItemAt = function(index) {

    if (this.__widgets[index] !== undefined) {
        this._widgetGroup.handleRemovedWidget(this.__widgets[index], index);
        delete this.__widgets[index];
    }
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype.getItemIndex =
    function(item) {

    var index = item.getName();
    if (index !== null && this.__widgets[index] !== undefined) {
        return index;
    }

    return null;
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype.getItemAt = function(index) {
    return this.__widgets[index] || null;
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype.clear = function() {
    for (var name in this.__widgets) {
        this._widgetGroup.handleRemovedWidget(this.__widgets[name], name);

        delete this.__widgets[name];
    }
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype.mapItems =
    function(callback) {

    for (var index in this.__widgets) {
        callback(index, this.__widgets[index]);
    }
};


/**
 * @override
 */
tuna.ui.selection.collection.NamedCollection.prototype.getItemsCount = function() {
    var i = 0;
    for (var _ in this.__widgets) {
        i++;
    }

    return i;
};