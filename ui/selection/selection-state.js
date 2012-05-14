


/**
 * @constructor
 */
tuna.ui.selection.SelectionState = function() {

    /**
     * @type {tuna.ui.selection.view.ISelectionView}
     * @private
     */
    this.__selectionView = null;

    /**
     * @type {!Object.<string|number, boolean>}
     * @private
     */
    this.__selectedIndexes = {};

    /**
     * @type {!Object.<string|number, boolean>}
     * @private
     */
    this.__disabledIndexes = {};
};


/**
 * @param {tuna.ui.selection.view.ISelectionView} view
 */
tuna.ui.selection.SelectionState.prototype.setSelectionView = function(view) {
    this.__selectionView = view;
};


/**
 * @return {!Array.<string|number>}
 */
tuna.ui.selection.SelectionState.prototype.getSelectedIndexes = function() {
    var result = [];

    for (var index in this.__selectedIndexes) {
        result.push(index);
    }

    return result;
};

/**
 * @return {?(string|number)}
 */
tuna.ui.selection.SelectionState.prototype.getLastSelectedIndex = function() {
    return this.getSelectedIndexes().pop() || null;
};


/**
 *
 * @param {string|number} index
 * @param {boolean} isSelected
 */
tuna.ui.selection.SelectionState.prototype
    .setIndexSelected = function(index, isSelected) {

    if (isSelected) {
        this.__selectedIndexes[index] = true;
        this.__selectionView && this.__selectionView.applySelectionAt(index);
    } else {
        delete this.__selectedIndexes[index];
        this.__selectionView && this.__selectionView.destroySelectionAt(index);
    }
};


/**
 * @param {string|number} index
 * @return {boolean}
 */
tuna.ui.selection.SelectionState.prototype.isSelected  = function(index) {
    return this.__selectedIndexes[index] === true;
};



tuna.ui.selection.SelectionState.prototype.clearSelection  = function() {
    for (var index in this.__selectedIndexes) {
        this.__selectionView && this.__selectionView.destroySelectionAt(index);
        delete this.__selectedIndexes[index];
    }
};


/**
 * @param {string|number} index
 * @param {boolean} isEnabled
 */
tuna.ui.selection.SelectionState.prototype
    .setIndexEnabled = function(index, isEnabled) {

    if (isEnabled) {
        delete this.__disabledIndexes[index];
        this.__selectionView && this.__selectionView.enableItemAt(index);
    } else {
        this.__disabledIndexes[index] = true;
        this.__selectionView && this.__selectionView.disableItemAt(index);
    }
};


/**
 * @param {string|number} index
 * @return {boolean}
 */
tuna.ui.selection.SelectionState.prototype.isEnabled = function(index) {
    return this.__disabledIndexes[index] !== true;
};
