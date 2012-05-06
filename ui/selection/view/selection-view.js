/**
 * @constructor
 * @implements {tuna.ui.selection.view.ISelectionView}
 */
tuna.ui.selection.view.SelectionView = function() {

    /**
     * @protected
     * @type {tuna.ui.selection.SelectionState}
     */
    this._selectionState = null;
};


/**
 * @param {tuna.ui.selection.SelectionState} state
 */
tuna.ui.selection.view.SelectionView.prototype
    .setSelectionState = function(state) {

    this._selectionState = state;
};


/**
 * @override
 */
tuna.ui.selection.view.SelectionView.prototype.update = function() {};


/**
 * @override
 */
tuna.ui.selection.view.SelectionView.prototype
    .applySelectionAt = function(index) {};


/**
 * @override
 */
tuna.ui.selection.view.SelectionView.prototype
    .destroySelectionAt = function(index) {};


/**
 * @override
 */
tuna.ui.selection.view.SelectionView.prototype
    .disableItemAt = function(index) {};


/**
 * @override
 */
tuna.ui.selection.view.SelectionView.prototype
    .enableItemAt = function(index) {};
