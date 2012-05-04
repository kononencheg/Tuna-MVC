


/**
 * Базовый класс фабрики, создающей и инициализирующей виджеты из HTML разметки.
 *
 * Наследники данного класса служат для инициализации конкретных виджетов
 * в выбранном контейнере.
 *
 * @see tuna.ui.Widget
 * @see tuna.ui.Container
 * @see tuna.ui.MarkupWidgetFactory#init
 * @constructor
 * @param {string} triggerSelector CSS-селектор элементов целевых для
 *        инициализации виджета.
 */
tuna.ui.MarkupWidgetFactory = function(triggerSelector) {

    /**
     * CSS-селектор целевых элементов виджета.
     *
     * @protected
     * @type {string}
     */
    this._triggerSelector = triggerSelector;
};


/**
 * Создание и инициализация всех виджетов контейнера в указанном контексте.
 *
 * @see tuna.ui.Container
 * @param {!Node} context Контекст инициализации - DOM-элемент в котром
 *        необходимо проинициализировать виджеты.
 * @param {!tuna.ui.Container} container Контейнер управления виджетами.
 * @return {!Array.<!tuna.ui.Widget>} Массив созданных виджетов.
 */
tuna.ui.MarkupWidgetFactory.prototype.initWidgets =
    function(context, container) {

    var instances = [];

    var targets = this._findTargets(context);

    var i = 0,
        l = targets.length;

    var instance = null;
    while (i < l) {
        if (this._isInContext(targets[i], context)) {
            instance = this.createWidget(targets[i], container);
            if (instance !== null) {
                instances.push(instance);

                if (!instance.getBooleanOption('not-init')) {
                    instance.init();
                }
            }
        }

        i++;
    }

    return instances;
};


/**
 * Уничтожение виждетов всех в выбранном массиве.
 *
 * @param {!Array.<!tuna.ui.Widget>} instances Массив виджетов.
 */
tuna.ui.MarkupWidgetFactory.prototype.destroyWidgets = function(instances) {
    var i = 0,
        l = instances.length;

    while (i < l) {
        this.destroyWidget(instances[i]);

        i++;
    }
};


/**
 * Создание экземпляра для целевого DOM-элемента виджета.
 *
 * Данный метод переопределяется в конкретных реализациях наследников данного
 * класса. В случае, если созданный виждет не соотвествует интерфейсу класса
 * {@link tuna.ui.Widget}, данный метод должен возвращать <code>null</code>.
 *
 * @param {!Node} target Целевой элемент виджета
 * @param {!tuna.ui.Container} container Контейнер в котором
 *        инициализируется виджет.
 * @return {tuna.ui.Widget} Созданный виджет.
 */
tuna.ui.MarkupWidgetFactory.prototype.createWidget =
    function(target, container) {};


/**
 * Уничтожение экземпляра виджета.
 *
 * @param {!tuna.ui.Widget} instance Экземпляр виджета.
 */
tuna.ui.MarkupWidgetFactory.prototype.destroyWidget = function(instance) {};


/**
 * Поиск элементов соответсвующих CSS-селектору
 * {@link tuna.ui.MarkupWidgetFactory#_triggerSelector} в выбранном контексте,
 * включая указанный элемент.
 *
 * @protected
 * @param {!Node} context DOM-элемент для поиска элементов.
 * @return {!Array.<!Node>} Массив найденных элементов.
 */
tuna.ui.MarkupWidgetFactory.prototype._findTargets = function(context) {
    var targets = tuna.dom.select(this._triggerSelector, context);
    targets = targets.concat(tuna.dom.matches(this._triggerSelector, [context]));

    return targets;
};


/**
 * Проверка наличия найденного целевого DOM-элемента виджета именно в выбранном
 * контексте.
 *
 * Отрицательный результат проверки может наступать в случае если элемент
 * найден во вложенном контейнере. Вложенные контейнеры изолируются с помощью
 * метода {@link tuna.ui.registerIsolator}.
 *
 * @see tuna.ui.registerIsolator
 * @protected
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!Node} context Контекcт поиска.
 * @return {boolean} Результат проверки.
 */
tuna.ui.MarkupWidgetFactory.prototype._isInContext = function(target, context) {
    var result = true;

    var isolators = tuna.ui.getIsolators();

    var i = 0,
        l = isolators.length;
    while (i < l) {
        if (target !== context) {
            result = result && !tuna.dom.hasClass(target, isolators[i]) &&
                                tuna.dom.getParentWithClass
                                    (target, isolators[i], context) === null;
            if (!result) {
                break;
            }
        }

        i++;
    }

    return result;
};
