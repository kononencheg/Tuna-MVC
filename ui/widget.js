


/**
 * Базовый класс динамического элемента интерфейса - виджета.
 *
 * @see tuna.ui.Container
 * @constructor
 * @implements {tuna.ui.IWidget}
 * @extends {tuna.events.EventDispatcher}
 * @param {!Node} target Целевой DOM-элемент.
 * @param {tuna.ui.Container=} opt_container Контейнер, к которому
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
 * @inheritDoc
 */
tuna.ui.Widget.prototype.getTarget = function() {
    return this._target;
};


/**
 * @return {tuna.ui.Container}
 */
tuna.ui.Widget.prototype.getContainer = function() {
    return this._container;
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.getName = function() {
    return this._target.getAttribute('data-name');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.init = function() {};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.destroy = function() {};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.disable = function() {
    tuna.dom.addClass(this._target, 'disabled');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.enable = function() {
    tuna.dom.removeClass(this._target, 'disabled');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.isEnabled = function() {
    return !tuna.dom.hasClass(this._target, 'disabled');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.select = function() {
    tuna.dom.addClass(this._target, 'active');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.deselect = function() {
    tuna.dom.removeClass(this._target, 'active');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.isSelected = function() {
    return tuna.dom.hasClass(this._target, 'active');
};


/**
 * @inheritDoc
 */
tuna.ui.Widget.prototype.clone = function(target, opt_container) {
    return new this.constructor(target, opt_container);
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

