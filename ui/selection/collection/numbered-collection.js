


/**
 * @constructor
 * @extends {tuna.ui.selection.collection.WidgetCollection}
 * @param {!tuna.ui.selection.WidgetGroup} widgetGroup
 */
tuna.ui.selection.collection.NumberedCollection = function(widgetGroup) {
    tuna.ui.selection.collection.WidgetCollection.call(this, widgetGroup);

    /**
     * @private
     * @type {!Array.<!tuna.ui.Widget>}
     */
    this.__widgets = [];
};


tuna.utils.extend(
    tuna.ui.selection.collection.NumberedCollection,
    tuna.ui.selection.collection.WidgetCollection
);


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype
    .addItem = function(item) {

    var index = this.__widgets.push(item) - 1;

    this._widgetGroup.handleCreatedWidget(item, index);

    return index;
};


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype
    .removeItemAt = function(index) {

    if (this.__widgets[index] !== undefined) {
        this._widgetGroup.handleRemovedWidget(this.__widgets[index], index);
        this.__widgets.splice(index, 1);
    }
};

/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype.getItemIndex
    = function(item) {

    return tuna.utils.indexOf(item, this.__widgets);
};


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype.getItemAt
    = function(index) {

    return this.__widgets[index] || null;
};


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype.clear = function() {
    while (this.__widgets.length) {
        this._widgetGroup.handleRemovedWidget
            (this.__widgets.pop(), this.__widgets.length);
    }
};


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype.mapItems
    = function(callback) {

    var i = 0,
        l = this.__widgets.length;

    while (i < l) {
        callback(i, this.__widgets[i]);

        i++;
    }
};


/**
 * @override
 */
tuna.ui.selection.collection.NumberedCollection.prototype.getItemsCount
    = function() {

    return this.__widgets.length;
};
