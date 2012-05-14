


/**
 * Класс контейнера с виждетами.
 *
 * Контейнер с виджетами сам является виджетом, тем самым вложенные контейнеры
 * образовывают композитную структуру.
 *
 * @event <code>init</code> - При инициализации виджетов целевого DOM-элемента.
 * @event <code>destroy</code> - При уничтожении всех проинициализорованных
 *        виджетов.
 * @see tuna.ui.Widget
 * @constructor
 * @extends {tuna.ui.Widget}
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container Родительский контейнер.
 */
tuna.ui.Container = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {!Object.<string, !Object.<string, !Array.<!tuna.ui.Widget>>>}
     * @private
     */
    this.__idWidgets = {};

    /**
     * @type {tuna.control.Controller}
     * @protected
     */
    this._controller = null;
};


tuna.utils.extend(tuna.ui.Container, tuna.ui.Widget);


/**
 * @inheritDoc
 */
tuna.ui.Container.prototype.init = function() {
    var controllerId = this.getStringOption('controller-id');
    if (controllerId !== null) {
        this._controller = tuna.control.getController(controllerId);
    } else if (this._target === document.body) {
        this._controller = tuna.control.getApplicationController();
    }

    this.initWidgets(this._target);

    if (this._controller !== null) {
        this._controller.setContainer(this);
        this._controller.initActions();
    }
};


/**
 * @inheritDoc
 */
tuna.ui.Container.prototype.destroy = function() {
    if (this._controller !== null) {
        this._controller.destroyActions();
    }

    for (var id in this.__idWidgets) {
        var typeWidgets = this.__idWidgets[id];

        for (var type in typeWidgets) {
            while (typeWidgets[type].length) {
                typeWidgets[type].shift().destroy();
            }
        }

        delete this.__idWidgets[id];
    }
};


/**
 * Инициализация виджетов в DOM-элементе.
 *
 * Данный метод стоит использовать в том случае, если внутри целевого
 * DOM-элемента появились дочерние элементы, в которых так же требуется
 * проинициализировать виджеты.
 *
 * TODO: Возвращать список виджетов контейнера.
 *
 * @param {!Node} target DOM-элемент в котором требуется проинициализировать
 *        виджеты.
 * @param {!Array.<string>=} opt_types
 */
tuna.ui.Container.prototype.initWidgets = function(target, opt_types) {
    var types = opt_types || this.getArrayOption('widgets');

    var i = types.length - 1;
    while (i >= 0) {
        this.initWidgetsByType(target, types[i]);

        i--;
    }
};


/**
 * @param {!Node} target
 * @param {string} type
 */
tuna.ui.Container.prototype.initWidgetsByType = function(target, type) {
    if (target.id === '') {
        target.id = 'container_' + tuna.ui.__lastId++;
    }

    var id = target.id;
    if (this.__idWidgets[id] === undefined) {
        this.__idWidgets[id] = {};
    }

    var selector = tuna.ui.getSelector(type);
    var factory = tuna.ui.getFactory(type);

    if (factory !== null && selector !== null) {
        var targets = tuna.ui.findTargets(selector, target, true, false);
        var widgets = [];

        var widget = null;
        while (targets.length > 0) {
            widget = factory.createWidget(targets.shift(), this);

            if (widget !== null) {
                widget.init();

                widgets.push(widget);
            }
        }

        this.__idWidgets[id][type] = widgets;
    }
};


/**
 * @param {!Node} target
 * @param {!Array.<string>=} opt_types
 */
tuna.ui.Container.prototype.destroyWidgets = function(target, opt_types) {
    var types = opt_types || this.getArrayOption('widgets');
    var i = types.length - 1;
    while (i >= 0) {
        this.destroyWidgetsByType(target, types[i]);

        i--;
    }
};


/**
 * @param {!Node} target
 * @param {string} type
 */
tuna.ui.Container.prototype.destroyWidgetsByType = function(target, type) {
    var id = target.id;
    if (id !== null && this.__idWidgets[id] !== undefined) {
        var typeWidgets = this.__idWidgets[id];

        if (typeWidgets[type] !== undefined) {
            while (typeWidgets[type].length) {
                typeWidgets[type].shift().destroy();
            }
        }

        delete this.__idWidgets[id];
    }
};


    /**
 * Получение виждета по типу и имени.
 *
 * @see tuna.ui.Widget#getName
 * @param {string} type Тип виждета.
 * @param {string} name Имя экземпляра виждета.
 * @param {!Node=} opt_target
 * @return {tuna.ui.Widget} Виджет.
 */
tuna.ui.Container.prototype.getWidget = function(type, name, opt_target) {
    var id = null;
    if (opt_target !== undefined) {
        id = opt_target.id;
        if (id !== null && this.__idWidgets[id] !== undefined) {
            return this.__findWidget(type, name, id);
        }
    } else {
        var widget = null;

        for (id in this.__idWidgets) {
            widget = this.__findWidget(type, name, id);
            if (widget !== null) {
                break;
            }
        }

        return widget;
    }

    return null;
};

/**
 *
 * @param {string} type
 * @param {string} name
 * @param {string} id
 * @private
 */
tuna.ui.Container.prototype.__findWidget = function(type, name, id) {
    var typeWidgets = this.__idWidgets[id][type];
    var i = typeWidgets.length - 1;
    while (i >= 0) {
        if (name === typeWidgets[i].getName()) {
            return typeWidgets[i];
        }

        i--
    }

    return null;
};