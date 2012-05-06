


/**
 * @constructor
 * @extends {tuna.ui.selection.WidgetGroup}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.selection.Navigation = function(target, opt_container) {
    tuna.ui.selection.WidgetGroup.call(this, target, opt_container);

    /**
     *
     * @type {tuna.ui.selection.NavigationPage}
     * @private
     */
    this.__currentPage = null;
};


tuna.utils.extend(tuna.ui.selection.Navigation, tuna.ui.selection.WidgetGroup);


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createCollection = function() {
    return new tuna.ui.selection.collection.NamedCollection(this);
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createSelectionRule = function() {
    return new tuna.ui.selection.rule.SingleSelectionRule(this._selectionState);
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype.handleCreatedWidget =
    function(widget, index) {

    if (widget instanceof tuna.ui.selection.NavigationPage) {
        widget.setNavigation(this);
    }

    widget.init();
};


/**
 * @param {string} index
 */
tuna.ui.selection.Navigation.prototype.navigate = function(index) {
    if (this._selectionState.isEnabled(index) &&
       !this._selectionState.isSelected(index)) {

        /*if (this.__currentPage !== null) {
            this.__currentPage.dispatch()
        }*/

        this._selectionRule.selectIndex(index);
    }
};
