


/**
 * @constructor
 * @extends {tuna.ui.Widget}
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
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
    this._collection = null;

    /**
     * @type {tuna.ui.selection.view.WidgetSelectionView}
     * @protected
     */
    this._selectionView = null;

    /**
     * @type {tuna.ui.selection.rule.SelectionRule}
     * @protected
     */
    this._selectionRule = null;

    /**
     * @type {tuna.ui.IWidgetFactory}
     * @protected
     */
    this._widgetFactory = null;
};


tuna.utils.extend(tuna.ui.selection.WidgetGroup, tuna.ui.Widget);


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype.init = function() {
    this._collection = this._createCollection();
    this._widgetFactory = this._createFactory();
    this._selectionRule = this._createRule();
    this._selectionView = this._createView();

    this._selectionState.setSelectionView(this._selectionView);

    this.update();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.WidgetGroup.prototype.destroy = function() {
    this._destroyView();
    this._destroyFactory();
    this._destroyRule();
    this._destroyCollection();

    this._selectionState.setSelectionView(null);

    tuna.ui.Widget.prototype.destroy.call(this);
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
tuna.ui.selection.WidgetGroup.prototype._createRule = function() {};


/**
 * @return {tuna.ui.IWidgetFactory}
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._createFactory = function() {};


/**
 * @return {tuna.ui.selection.view.WidgetSelectionView}
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._createView = function() {
    var itemSelector = this.getStringOption('item-selector');

    if (this._widgetFactory !== null && this._collection !== null &&
        itemSelector !== null) {

        return new tuna.ui.selection.view.WidgetSelectionView(
            this._target, itemSelector,
            this._widgetFactory,
            this._selectionState,
            this._collection,
            this._container
        );
    }

    return null;
};


/**
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._destroyCollection = function() {
    if (this._collection !== null) {
        this._collection.clear();
        this._collection = null;
    }
};


/**
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._destroyRule = function() {
    this._selectionRule = null;
};


/**
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._destroyView = function() {
    this._selectionView = null;
};


/**
 * @protected
 */
tuna.ui.selection.WidgetGroup.prototype._destroyFactory = function() {
    this._widgetFactory = null;
};



tuna.ui.selection.WidgetGroup.prototype.update = function() {
    if (this._selectionView !== null) {
        this._selectionView.update();
    }
};


/**
 * @param {!tuna.ui.Widget} widget
 * @param {string|number} index
 */
tuna.ui.selection.WidgetGroup.prototype
    .handleCreatedWidget = function(widget, index) {

    widget.init();
};


/**
 * @param {!tuna.ui.Widget} widget
 * @param {string|number} index
 */
tuna.ui.selection.WidgetGroup.prototype
    .handleRemovedWidget = function(widget, index) {

    widget.destroy();
};
