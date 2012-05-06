


/**
 * @constructor
 * @extends {tuna.ui.selection.rule.SelectionRule}
 * @param {!tuna.ui.selection.SelectionState} selectionState
 */
tuna.ui.selection.rule.MultipleSelectionRule = function(selectionState) {
    tuna.ui.selection.rule.SelectionRule.call(this, selectionState);
};


tuna.utils.extend(
    tuna.ui.selection.rule.MultipleSelectionRule,
    tuna.ui.selection.rule.SelectionRule
);


/**
 * @override
 */
tuna.ui.selection.rule.MultipleSelectionRule.prototype.selectIndex
    = function(index) {

    this._selectionState.setIndexSelected
        (index, !this._selectionState.isSelected(index))
};
