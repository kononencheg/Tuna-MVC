


/**
 * @constructor
 * @extends {tuna.ui.selection.AbstractSelectionGroup}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.selection.WidgetGroup = function(target, opt_container) {
    tuna.ui.selection.AbstractSelectionGroup.call(this, target, opt_container);
};


tuna.utils.extend
    (tuna.ui.selection.WidgetGroup, tuna.ui.selection.AbstractSelectionGroup);


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype._createSelectionView = function() {
    var widgetType = this.getStringOption('widget');
    if (widgetType !== null) {

        var selectionView =  new tuna.ui.selection.view.WidgetSelectionView
            (this._target, widgetType);

        if (this._container !== null) {
            selectionView.setContainer(this._container);
        }

        return selectionView;
    }

    return null;
};


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype._createItemsCollection = function() {
    return new tuna.ui.selection.items.NamedCollection();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype._createSelectionRule = function() {
    return new tuna.ui.selection.rule.SingleSelectionRule();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype.handleCreatedItem = function(widget) {
    widget.init();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype.handleRemovedItem = function(widget) {
    widget.destroy();
};