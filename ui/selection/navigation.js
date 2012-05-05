


/**
 * @constructor
 * @extends {tuna.ui.selection.AbstractSelectionGroup}
 * @param {!Node} target
 * @param {!tuna.ui.Container=} opt_container  контейнер.
 */
tuna.ui.selection.Navigation = function(target, opt_container) {
    tuna.ui.selection.WidgetGroup.call(this, target, opt_container);
};


tuna.utils.extend(tuna.ui.selection.Navigation, tuna.ui.selection.WidgetGroup);


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype.init = function() {
    tuna.ui.selection.WidgetGroup.prototype.init.call(this);

    var self = this;

    this.addEventListener('select', function(event, newIndex) {
        var page = self._itemsCollection.getItemAt(newIndex);
        if (page !== null) {
            page.dispatch('open');
        }
    });

    this.addEventListener('deselect', function(event, oldIndex) {
        var page = self._itemsCollection.getItemAt(oldIndex);
        if (page !== null) {
            if (!page.dispatch('close')) {
                event.preventDefault();
            }
        }
    });

    this.addEventListener('selected', function(event, newIndex) {
        var page = self._itemsCollection.getItemAt(newIndex);
        if (page !== null) {
            page.dispatch('opened');
        }
    });

    this.addEventListener('deselected', function(event, oldIndex) {
        var page = self._itemsCollection.getItemAt(oldIndex);
        if (page !== null) {
            page.dispatch('closed');
        }
    });
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createItemsCollection = function() {
    return new tuna.ui.selection.items.NamedCollection();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype._createSelectionRule = function() {
    return new tuna.ui.selection.rule.SingleSelectionRule();
};


/**
 * @inheritDoc
 */
tuna.ui.selection.Navigation.prototype.handleCreatedItem =
    function(widget, index) {

    if (widget instanceof tuna.ui.selection.NavigationPage) {
        widget.setNavigation(this);
    }

    widget.init();
};
