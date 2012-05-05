/**
 * @constructor
 * @extends {tuna.ui.Widget}
 * @implements {tuna.ui.selection.ISelectionGroup}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container
 */
tuna.ui.selection.AbstractSelectionGroup = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {tuna.ui.selection.items.AbstractWidgetCollection}
     * @protected
     */
    this._itemsCollection = null;

    /**
     * @type {tuna.ui.selection.view.AbstractSelectionView}
     * @protected
     */
    this._selectionView = null;

    /**
     * @type {tuna.ui.selection.rule.AbstractSelectionRule}
     * @protected
     */
    this._selectionRule = null;
};


tuna.utils.extend
    (tuna.ui.selection.AbstractSelectionGroup, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.init = function() {
    this._itemsCollection = this._createItemsCollection();
    this._selectionView = this._createSelectionView();
    this._selectionRule = this._createSelectionRule();

    if (this._selectionRule !== null &&
        this._itemsCollection !== null &&
        this._selectionView !== null) {

        this._itemsCollection.setSelectionGroup(this);

        this._selectionView.setSelectionRule(this._selectionRule);
        this._selectionView.setItemsCollection(this._itemsCollection);

        this._selectionRule.setEventDispatcher(this);
        this._selectionRule.setItemsCollection(this._itemsCollection);
        this._selectionRule.setSelectionView(this._selectionView);

        this._selectionView.update();
    }
};


/**
 * @return {tuna.ui.selection.view.AbstractSelectionView}
 * @protected
 */
tuna.ui.selection.AbstractSelectionGroup.prototype._createSelectionView =
    function() {};


/**
 * @return {tuna.ui.selection.items.AbstractWidgetCollection}
 * @protected
 */
tuna.ui.selection.AbstractSelectionGroup.prototype._createItemsCollection =
    function() {};


/**
 * @return {tuna.ui.selection.rule.AbstractSelectionRule}
 * @protected
 */
tuna.ui.selection.AbstractSelectionGroup.prototype._createSelectionRule =
    function() {};


/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.setIndexEnabled
    = function(index, isEnabled) {

    this._selectionRule.setIndexEnabled(index, isEnabled);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.isIndexEnabled
    = function(index) {

    return this._selectionRule.isIndexEnabled(index);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.updateView = function() {
    this._selectionView.update();
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.getItemIndex
    = function(item) {

    return this._itemsCollection.getItemIndex(item);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.getItemAt
    = function(index) {

    return this._itemsCollection.getItemAt(index);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.mapItems
    = function(callback) {

    this._itemsCollection.mapItems(callback);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.getSelectedIndexes
    = function() {

    return this._selectionRule.getSelectedIndexes();
};

/**
 * @return {?(string|number)}
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.getLastSelectedIndex
    = function() {

    var indexes = this._selectionRule.getSelectedIndexes();
    if (indexes.length > 0) {
        return indexes.pop();
    }

    return null;
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.selectIndex
    = function(index) {

    return this._selectionRule.selectIndex(index);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.isSelected
    = function(index) {

    return this._selectionRule.isSelected(index);
};

/**
 * @override
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.clearSelection
    = function() {

    this._selectionRule.clearSelection();
};


/**
 * @param {!tuna.ui.IWidget} widget
 * @param {string|number} index
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.handleCreatedItem =
    function(widget, index) {};

/**
 * @param {!tuna.ui.IWidget} widget
 * @param {string|number} index
 */
tuna.ui.selection.AbstractSelectionGroup.prototype.handleRemovedItem =
    function(widget, index) {};