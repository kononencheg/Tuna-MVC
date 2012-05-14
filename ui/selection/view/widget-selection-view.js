


/**
 * @implements {tuna.ui.selection.view.ISelectionView}
 * @constructor
 * @param {!Node} target
 * @param {string} itemSelector
 * @param {!tuna.ui.IWidgetFactory} widgetFactory
 * @param {!tuna.ui.selection.SelectionState} selectionState
 * @param {!tuna.ui.selection.collection.WidgetCollection} itemCollection
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.selection.view.WidgetSelectionView = function(target,
                                                      itemSelector,
                                                      widgetFactory,
                                                      selectionState,
                                                      itemCollection,
                                                      opt_container) {

    /**
     * @type {!Node}
     * @protected
     */
    this._target = target;

    /**
     * @type {string}
     * @protected
     */
    this._itemSelector = itemSelector;

    /**
     * @protected
     * @type {!tuna.ui.selection.SelectionState}
     */
    this._selectionState = selectionState;

    /**
     * @type {!tuna.ui.IWidgetFactory}
     * @protected
     */
    this._widgetFactory = widgetFactory;

    /**
     * @protected
     * @type {!tuna.ui.selection.collection.WidgetCollection}
     */
    this._itemsCollection = itemCollection;

    /**
     * @type {tuna.ui.Container}
     * @protected
     */
    this._container = opt_container || null;
};


/**
 * @inheritDoc
 */
tuna.ui.selection.view.WidgetSelectionView.prototype.update = function() {
    var self = this;

    var targets = tuna.ui.findTargets
        (this._itemSelector, this._target, false, true);

    this._itemsCollection.mapItems(function(index, widget) {
        var target = widget.getTarget();

        var targetIndex = tuna.utils.indexOf(target, targets);
        if (targetIndex === -1) {
            self._itemsCollection.removeItemAt(index);
        } else {
            targets.splice(targetIndex, 1);
        }
    });

    var widget = null;
    var index = null;
    while (targets.length > 0) {
        widget = this._widgetFactory.createWidget
                        (targets.shift(), this._container);

        index = this._itemsCollection.addItem(widget);
        if (index !== null) {
            this._selectionState.setIndexSelected
                (index, widget.isSelected());

            this._selectionState.setIndexEnabled
                (index, widget.isEnabled());
        }
    }

};


/**
 * @inheritDoc
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .applySelectionAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.select();
    }
};


/**
 * @inheritDoc
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .destroySelectionAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.deselect();
    }
};


/**
 * @inheritDoc
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .disableItemAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.disable();
    }
};


/**
 * @inheritDoc
 */
tuna.ui.selection.view.WidgetSelectionView.prototype
    .enableItemAt = function(index) {

    var widget = this._itemsCollection.getItemAt(index);
    if (widget !== null) {
        widget.enable();
    }
};
