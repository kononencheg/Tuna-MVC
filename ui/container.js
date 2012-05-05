


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
 * @param {!tuna.ui.Container=} opt_container Родительский контейнер.
 */
tuna.ui.Container = function(target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @type {!Array.<string>}
     * @private
     */
    this.__widgetTypes = [];

    /**
     * @type {!Object.<string, !Object.<string, !Array.<!tuna.ui.Widget>>>}
     * @private
     */
    this.__idWidgets = {};
};


tuna.utils.extend(tuna.ui.Container, tuna.ui.Widget);


/**
 * @inheritDoc
 */
tuna.ui.Container.prototype.init = function() {
    this.__widgetTypes = this.getArrayOption('widgets');

    this.initWidgets(this._target);
    this.dispatch('init');
};


/**
 * @inheritDoc
 */
tuna.ui.Container.prototype.destroy = function() {
    this.dispatch('destroy');

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
 */
tuna.ui.Container.prototype.initWidgets = function(target) {
    if (target.id === null) {
        target.id = 'container_' + tuna.ui.__lastId++;
    }

    var id = target.id;
    if (this.__idWidgets[id] === undefined) {
        this.__idWidgets[id] = {};
    }

    var i = 0,
        l = this.__widgetTypes.length;

    var type = null;
    var targets = null;
    while (i < l) {
        type = this.__widgetTypes[i];
        targets = tuna.ui.findWidgetsTargets(type, target, false);

        this.__idWidgets[id][type] =
            tuna.ui.createWidgets(type, targets, true, this);
        
        i++;
    }
};


/**
 * @param {!Node} target 
 */
tuna.ui.Container.prototype.destroyWidgets = function(target) {
    var id = target.id;
    if (id !== null && this.__idWidgets[id] !== undefined) {
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