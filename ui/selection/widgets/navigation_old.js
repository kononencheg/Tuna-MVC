/**
 * @constructor
 * @extends tuna.ui.Widget
 * @param {!Node} target
 */
tuna.ui.selection.Navigation = function(target) {
    tuna.ui.Widget.call(this, target);

    /**
     * @type {tuna.ui.selection.rule.SingleSelectionRule}
     * @private
     */
    this.__navigationRule = null;

    /**
     * @private
     * @type {Object.<string|number, Array.<tuna.ui.buttons.Button>>}
     */
    this.__menuLinks = {};

    /**
     * @type {tuna.ui.selection.Navigation}
     * @private
     */
    this.__parent = null;


    this._setDefaultOption('selection-class', 'active');
    this._setDefaultOption('item-selector', '.j-navigation-page');
    this._setDefaultOption('menu-selector', '.j-navigation-menu');
};

tuna.utils.extend(tuna.ui.selection.Navigation, tuna.ui.Widget);

/**
 * @override
 */
tuna.ui.selection.Navigation.prototype.init = function() {
    this.__initNavigation();
    this.__initControls();
    this.__initMenu();
};

/**
 * @private
 */
tuna.ui.selection.Navigation.prototype.__initNavigation = function() {
    this.__navigationRule
        = new tuna.ui.selection.rule.SingleSelectionRule();

    var pagesCollection = new tuna.ui.selection.collection.NamedCollection();

    var selectionView
        = new tuna.ui.selection.view.ClassSelectionView(this._target);

    selectionView.setSelectionRule(this.__navigationRule);
    selectionView.setItemsCollection(pagesCollection);

    this.__navigationRule.setEventDispatcher(this);
    this.__navigationRule.setSelectionView(selectionView);
    this.__navigationRule.setItemsCollection(pagesCollection);

    selectionView.update();
};

/**
 * @private
 */
tuna.ui.selection.Navigation.prototype.__initControls = function() {
    var self = this;

    var controls = new tuna.ui.buttons.ButtonGroup(this._target);
    controls.setOption('button-selector', '.j-navigation-link');
    controls.setDefaultAction('navigate');

    controls.addEventListener('navigate', function(event, button) {
        event.preventDefault();

        var index = button.getStringOption('href');
        if (index !== null) {
            var data = button.getOptions();
            delete data['href'];

            self.navigate(index, data);
        }
    });

    controls.addEventListener('back', function(event, button) {
        event.preventDefault();

        self.back();
    });

    controls.init();
};

/**
 * @private
 */
tuna.ui.selection.Navigation.prototype.__initMenu = function() {
    var menuSelector = this.getStringOption('menu-selector');
    var buttonSelector = this.getStringOption('button-selector');

    if (menuSelector !== null && buttonSelector !== null) {
        var menu = tuna.dom.selectOne(menuSelector, this._target);
        if (menu !== null) {
            var buttons = tuna.dom.select(buttonSelector, menu);

            var i = 0,
                l = buttons.length;

            var href = null;
            var index = null;
            var button = null;
            while (i < l) {
                button = tuna.ui.buttons.create(buttons[i]);
                href = button.getStringOption('href');
                if (href !== null) {
                    index = href.split('/').shift();

                    if (this.__menuLinks[index] === undefined) {
                        this.__menuLinks[index] = [];
                    }

                    this.__menuLinks[index].push(button);
                }

                i++;
            }
        }
    }

    var currentIndex = this.__navigationRule.getCurrentIndex();
    if (currentIndex !== null) {
        this.__updateMenu(currentIndex, true);
    }};

/**
 *
 * @param {?(string|number)} path
 * @param {boolean} isSelected
 */
tuna.ui.selection.Navigation.prototype.__updateMenu = function(path, isSelected) {
    if (path !== null) {
        var buttons = this.__menuLinks[path];
        if (buttons !== undefined) {
            var i = 0,
                l = buttons.length;

            while (i < l) {
                buttons[i].setActive(isSelected);

                i++;
            }
        }
    }
};
