


/**
 * @constructor
 * @extends {tuna.ui.selection.view.AbstractSelectionView}
 * @param {!Node} target
 * @param {string} widgetType
 */
tuna.ui.selection.view.WidgetSelectionView = function(target, widgetType) {
    tuna.ui.selection.view.AbstractSelectionView.call(this);

    /**
     * @type {!Node}
     * @protected
     */
    this._target = target;

    /**
     * @type {tuna.ui.Container}
     * @protected
     */
    this._container = null;

    /**
     * @type {string}
     * @protected
     */
    this._widgetType = widgetType;
};


tuna.utils.extend(
    tuna.ui.selection.view.WidgetSelectionView,
    tuna.ui.selection.view.AbstractSelectionView
);


/**
 * @param {!tuna.ui.Container} container
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.setContainer =
    function(container) {
    this._container = container;
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.applySelectionAt =
    function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.select();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.destroySelectionAt =
    function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.deselect();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.disableItemAt
    = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.disable();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.enableItemAt =
    function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.enable();
    }
};


/**
 * @override
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.update = function() {
    this._selectionRule.clearSelection();
    this._itemsCollection.clear();

    var targets =
        tuna.ui.findWidgetsTargets(this._widgetType, this._target, true);

    var widgets = tuna.ui.createWidgets
        (this._widgetType, targets, false, this._container);

    var i = 0,
        l = widgets.length;

    var index = null;
    var widget = null;
    while (i < l) {
        widget = widgets[i];
        index = this._itemsCollection.addItem(widget);

        if (index !== null && widget.isSelected()) {
            this._selectionRule.selectIndex(index);
        }

        i++;
    }
};
