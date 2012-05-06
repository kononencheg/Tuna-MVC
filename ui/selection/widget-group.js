


/**
 * @constructor
 * @extends {tuna.ui.Widget}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.selection.WidgetGroup = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {!tuna.ui.selection.SelectionState}
     * @protected
     */
    this._selectionState = new tuna.ui.selection.SelectionState();

    /**
     * @type {tuna.ui.selection.collection.WidgetCollection}
     * @protected
     */
    this._itemsCollection = null;

    /**
     * @type {tuna.ui.selection.view.SelectionView}
     * @protected
     */
    this._selectionView = null;

    /**
     * @type {tuna.ui.selection.rule.SelectionRule}
     * @protected
     */
    this._selectionRule = null;
};


tuna.utils.extend(tuna.ui.selection.WidgetGroup, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.selection.WidgetGroup.prototype.init = function() {
    this._itemsCollection = this._createCollection();
    this._selectionView = this._createSelectionView();
    this._selectionRule = this._createSelectionRule();

    if (this._itemsCollection !== null && this._selectionView !== null) {
        this._selectionState.setSelectionView(this._selectionView);

        this._selectionView.setSelectionState(this._selectionState);
        this._selectionView.setItemsCollection(this._itemsCollection);

        this._selectionView.update();
    }
};


/**
 * @return {tuna.ui.selection.collection.WidgetCollection}
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._createCollection = function() {};


/**
 * @return {tuna.ui.selection.rule.SelectionRule}
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._createSelectionRule = function() {};


/**
 * @return {tuna.ui.selection.view.WidgetSelectionView}
 * @protected
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
 * @param {!tuna.ui.IWidget} widget
 * @param {string|number} index
 */
tuna.ui.selection.WidgetGroup.prototype
    .handleCreatedWidget = function(widget, index) {

    widget.init();
};


/**
 * @param {!tuna.ui.IWidget} widget
 * @param {string|number} index
 */
tuna.ui.selection.WidgetGroup.prototype
    .handleRemovedWidget = function(widget, index) {

    widget.destroy();
};
