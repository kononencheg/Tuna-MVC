


/**
 * Базовый класс динамического элемента интерфейса - виджета.
 *
 * Виджетом отображения может быть всплывающее окно, кнопка, список
 * отображения и тд.
 *
 * @see tuna.ui.MarkupWidgetFactory
 * @see tuna.ui.Container
 * @constructor
 * @extends tuna.events.EventDispatcher
 * @param {!Node} target Целевой DOM-элемент.
 * @param {!tuna.ui.Container=} opt_container Контейнер, к которому
 *        относится виджет.
 */
tuna.ui.Widget = function(target, opt_container) {
    tuna.events.EventDispatcher.call(this, opt_container);

    /**
     * Контейнер к которому относится виджет.
     *
     * @protected
     * @type {tuna.ui.Container}
     */
    this._container = opt_container || null;

    /**
     * Целевой DOM-элемент экземпляра модуля отображения.
     *
     * @protected
     * @type {!Node}
     */
    this._target = target;

    /**
     * Настройки экземпляра по-умолчанию.
     *
     * @private
     * @type Object.<string, string|boolean|number>
     */
    this.__defaultOptions = {};
};


tuna.utils.extend(tuna.ui.Widget, tuna.events.EventDispatcher);


/**
 * Инициализация виджета.
 */
tuna.ui.Widget.prototype.init = function() {};


/**
 * Уничтожение виджета.
 */
tuna.ui.Widget.prototype.destroy = function() {};


/**
 * Получение целевого DOM-элемента виджета.
 *
 * @return {!Node} Целевой DOM-элемент.
 */
tuna.ui.Widget.prototype.getTarget = function() {
    return this._target;
};


/**
 * Получение контейнера к которому относится виджет.
 *
 * @return {tuna.ui.Container} Контейнер к которому относится виджет.
 */
tuna.ui.Widget.prototype.getContainer = function() {
    return this._container;
};


/**
 * Получение имени виджета.
 *
 * Имя виджета устанавливается в аттрибуте целевого DOM-элемента
 * <code>data-name</code>.
 *
 * @return {?string} Имя экземпляра.
 */
tuna.ui.Widget.prototype.getName = function() {
    return this._target.getAttribute('data-name');
};


/**
 * Установка работоспособности виджета.
 *
 * Работоспособность виджета отключается добавлением CSS-класса
 * <code>disabled</code> у целевого DOM-элемента.
 *
 * @param {boolean} isEnabled Флаг работоспособности.
 */
tuna.ui.Widget.prototype.setEnabled = function(isEnabled) {
    tuna.dom.setClassExist(this._target, 'disabled', !isEnabled);
};

/**
 * Проверка работоспособности виджета.
 *
 * @return {boolean} Результат проверки.
 */
tuna.ui.Widget.prototype.isEnabled = function() {
    return !tuna.dom.hasClass(this._target, 'disabled');
};


/**
 * Устанока параметра настроек виджета по умолчанию.
 *
 * @protected
 * @param {string} name Имя параметра настроек.
 * @param {null|string|boolean|number} value Значение параметра.
 */
tuna.ui.Widget.prototype._setDefaultOption = function(name, value) {
    if (value === null) {
        delete this.__defaultOptions[name];
    } else {
        this.__defaultOptions[name] = value;
    }
};


/**
 * Установка параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @param {null|string|boolean|number} value Значение параметра.
 */
tuna.ui.Widget.prototype.setOption = function(name, value) {
    if (value) {
        this._target.setAttribute('data-' + name, value);
    } else {
        this._target.removeAttribute('data-' + value);
    }
};


/**
 * Получение параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {null|string|boolean|number} Значение параметра.
 */
tuna.ui.Widget.prototype.getOption = function(name) {
    var option = this._target.getAttribute('data-' + name);
    if (option === null && this.__defaultOptions[name] !== undefined) {
        option = this.__defaultOptions[name];
    }

    return option;
};


/**
 * Получение строкового параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {?string} Строковое значение параметра.
 */
tuna.ui.Widget.prototype.getStringOption = function(name) {
    var option = this._target.getAttribute('data-' + name);
    if (option === null && this.__defaultOptions[name] !== undefined) {
        option = this.__defaultOptions[name] || '';
    }

    return option;
};


/**
 * Получение числового параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {number} Строковое значение параметра.
 */
tuna.ui.Widget.prototype.getNumberOption = function(name) {
    var option = this._target.getAttribute('data-' + name);
    if (option === null && this.__defaultOptions[name] !== undefined) {
        option = this.__defaultOptions[name];
    }

    return option * 1 || 0;
};


/**
 * Получение булева параметра настроек виджета.
 *
 * @param {string} name Имя параметра настроек.
 * @return {boolean} Булево значение параметра.
 */
tuna.ui.Widget.prototype.getBooleanOption = function(name) {
    var option = this._target.getAttribute('data-' + name);
    if (option === null && this.__defaultOptions[name] !== undefined) {
        option = this.__defaultOptions[name];
    }

    return !!option;
};


/**
 * Получение параметра настроек виджета в виде массива.
 *
 * Для получения массива строка значения аттрибута параметра разбивается
 * указанным разделителем. По-умолчанию разделителем является регулярное
 * выражение вида: <code>\s*\,\s*</code>.
 *
 * @param {string} name Имя параметра настроек.
 * @param {(string|RegExp)=} opt_separator Разделитель строки.
 * @return {!Array.<string>} Массив разбитого значения параметра.
 */
tuna.ui.Widget.prototype.getArrayOption = function(name, opt_separator) {
    var option = this.getStringOption(name);
    if (option !== null) {
        if (opt_separator === undefined) {
            return option.split(/\s*\,\s*/);
        }

        return option.split(opt_separator);
    }

    return [];
};


/**
 * Получение таблицы настроек виджета.
 *
 * @return {!Object.<string, string>} Таблица настроек.
 */
tuna.ui.Widget.prototype.getOptions = function() {
    return tuna.dom.getAttributesData(this._target);
};
