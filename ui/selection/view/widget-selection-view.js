


/**
 * @constructor
 * @extends {tuna.ui.selection.view.SelectionView}
 * @param {!Node} target
 * @param {string} widgetType
 */
tuna.ui.selection.view.WidgetSelectionView = function(target, widgetType) {
    tuna.ui.selection.view.SelectionView.call(this);

    /**
     * @protected
     * @type {tuna.ui.selection.collection.WidgetCollection}
     */
    this._itemsCollection = null;

    /**
     * @type {tuna.ui.Container}
     * @protected
     */
    this._container = null;

    /**
     * @type {!Node}
     * @protected
     */
    this._target = target;

    /**
     * @type {string}
     * @protected
     */
    this._widgetType = widgetType;
};


tuna.utils.extend(
    tuna.ui.selection.view.WidgetSelectionView,
    tuna.ui.selection.view.SelectionView
);


/**
 * @param {tuna.ui.selection.collection.WidgetCollection} collection
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .setItemsCollection = function(collection) {

    this._itemsCollection = collection;
};


/**
 * @param {!tuna.ui.Container} container
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .setContainer = function(container) {

    this._container = container;
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.update = function() {
    this._selectionState.clearSelection();
    this._itemsCollection.clear();

    var targets =
        tuna.ui.findWidgetsTargets(this._widgetType, this._target, false, true);

    var widgets = tuna.ui.createWidgets
        (this._widgetType, targets, false, this._container);

    var i = 0,
        l = widgets.length;

    var index = null;
    var widget = null;
    while (i < l) {
        widget = widgets[i];
        index = this._itemsCollection.addItem(widget);

        if (index !== null) {
            if (widget.isSelected()) {
                this._selectionState.setIndexSelected(index, true);
            }

            if (widget.isEnabled()) {
                this._selectionState.setIndexEnabled(index, true);
            }
        }

        i++;
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .applySelectionAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.select();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .destroySelectionAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.deselect();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .disableItemAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.disable();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .enableItemAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.enable();
    }
};
