




/**
 * @constructor
 * @extends {tuna.ui.selection.rule.SelectionRule}
 * @param {!tuna.ui.selection.SelectionState} selectionState
 */
tuna.ui.selection.rule.SingleSelectionRule = function(selectionState) {
    tuna.ui.selection.rule.SelectionRule.call(this, selectionState);
};


tuna.utils.extend(
    tuna.ui.selection.rule.SingleSelectionRule,
    tuna.ui.selection.rule.SelectionRule
);


/**
 * @override
 */
tuna.ui.selection.rule.SingleSelectionRule.prototype
    .selectIndex = function(index) {

    var needSelection = true;

    var selectedIndexes = this._selectionState.getSelectedIndexes();
    var selectedIndex = null;
    while (selectedIndexes.length) {
        selectedIndex = selectedIndexes.shift();

        if (selectedIndex === index) {
            needSelection = false;
        } else {
            this._selectionState.setIndexSelected(selectedIndex, false);
        }
    }

    if (needSelection) {
        this._selectionState.setIndexSelected(index, true);
    }
};