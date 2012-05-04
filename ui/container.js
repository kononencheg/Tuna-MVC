


/**
 * Класс контейнера с виждетами.
 *
 * Контейнер с виджетами сам является виджетом, тем самым вложенные контейнеры
 * образовывают композитную структуру.
 *
 * @event <code>init</code> - При инициализации виджетов целевого DOM-элемента.
 * @event <code>destroy</code> - При уничтожении всех проинициализорованных
 *        виджетов.
 * @see tuna.ui.MarkupWidgetFactory
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
    this.__instances = {};
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
    for (var targetId in this.__instances) {
        this.__destroyWidgetsByTargetId(targetId);
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
 * @see tuna.ui.MarkupWidgetFactory#initWidgets
 * @param {!Node} target DOM-элемент в котором требуется проинициализировать
 *        виджеты.
 */
tuna.ui.Container.prototype.initWidgets = function(target) {
    if (target.id === null) {
        target.id = 'container_' + tuna.ui.__lastId++;
    }

    var targetId = target.id;
    if (this.__instances[targetId] === undefined) {
        this.__instances[targetId] = {};
    }

    var instances = this.__instances[targetId];

    var i = 0,
        l = this.__widgetTypes.length;

    var type = null;
    var factory = null;
    while (i < l) {
        type = this.__widgetTypes[i];
        factory = tuna.ui.getFactory(type);

        if (factory !== null) {
            if (instances[type] === undefined) {
                instances[type] = [];
            }

            instances[type] =
                instances[type].concat(factory.initWidgets(target, this));

        } else {
            throw 'Unknown widget type "' + type + '"';
        }

        i++;
    }
};


/**
 * Уничтожение всех виджетов проинициализированных в выбранном DOM-элементе
 * контейнера.
 *
 * @param {!Node} target DOM-элемент в контейнере, виджеты которого необходимо
 *        уничтожить.
 */
tuna.ui.Container.prototype.destroyWidgets = function(target) {
    if (target.id !== null) {
        this.__destroyWidgetsByTargetId(target.id);
    }
};


/**
 * Получение всех виджетов определенного типа. В случе если выбран DOM-элемент,
 * будут выданы виджеты ранее в нем проинициализированные.
 *
 * @param {string} type Тип модуля отображения.
 * @param {!Node=} opt_target DOM-элемент модули которого н еобходимо вренуть.
 * @return {!Array.<!tuna.ui.Widget>} Массив модулей отображения.
 */
tuna.ui.Container.prototype.getWidgets = function(type, opt_target) {
    var result = [];

    var targetId = null;
    if (opt_target !== undefined) {
        targetId = opt_target.id;
        if (this.__instances[targetId] !== undefined &&
            this.__instances[targetId][type] !== undefined) {
            result = this.__instances[targetId][type];
        }
    } else {
        for (targetId in this.__instances) {
            if (this.__instances[targetId][type] !== undefined) {
                result = result.concat(this.__instances[targetId][type]);
            }
        }
    }


    return result;
};


/**
 * Получение виждета по типу и имени.
 *
 * @see tuna.ui.Widget#getName
 * @param {string} type Тип виждета.
 * @param {string} name Имя экземпляра виждета.
 * @return {tuna.ui.Widget} Виджет.
 */
tuna.ui.Container.prototype.getWidget = function(type, name) {

    for (var targetId in this.__instances) {
        if (this.__instances[targetId][type] !== undefined) {
            var instances = this.__instances[targetId][type];

            var i = 0,
                l = instances.length;

            while (i < l) {
                if (instances[i].getName() === name) {
                    return instances[i];
                }

                i++;
            }
        }
    }

    return null;
};


/**
 * @param {string} targetId
 * @private
 */
tuna.ui.Container.prototype.__destroyWidgetsByTargetId = function(targetId) {
    var factory = null;
    for (var name in this.__instances[targetId]) {
        factory = tuna.ui.getFactory(name);
        if (factory !== null) {
            factory.destroyWidgets(this.__instances[targetId][name]);
        }

        this.__instances[targetId][name].length = 0;
    }

    delete this.__instances[targetId];
};
