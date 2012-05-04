


/**
 * Базовый класс управления логикой приложения.
 *
 * Экземпляры данного класса являются основными сущностями приложения - каждый
 * экземпляр привязывается к определенному идентификатору с помощью
 * статических методов {@link tuna.control.registerController} и
 * {@link tuna.control.setApplicationController}.
 *
 * @constructor
 */
tuna.control.Controller = function() {

    /**
     * Контейнер упраления виджетами.
     *
     * @protected
     * @type {tuna.ui.Container}
     */
    this._container = null;

    /**
     * @type {function()}
     * @private
     */
    this.__initActions = tuna.utils.bind(this.initActions, this);

    /**
     * @type {function()}
     * @private
     */
    this.__destroyActions = tuna.utils.bind(this.destroyActions, this);
};


/**
 * Установка контейнера упраления виджетами.
 *
 * При установки контейнера добавляются слушатели его инициализации и
 * уничтожения обработчиками которых устанавливаются методы
 * {@link tuna.control.Controller#initActions} и
 * {@link tuna.control.Controller#destroyActions} соотвественно.
 *
 * @param {!tuna.ui.Container} container Контейнер упраления виджетами.
 */
tuna.control.Controller.prototype.setContainer = function(container) {
    if (this._container !== null) {
        this._container.removeEventListener('init', this.__initActions);
        this._container.removeEventListener('destroy', this.__destroyActions);
    }

    this._container = container;

    this._container.addEventListener('init', this.__initActions);
    this._container.addEventListener('destroy', this.__destroyActions);
};


/**
 * Инициализация поведения конкретного контроллера.
 *
 * Основная логика работы приложения приложения определяется реализацией именно
 * данного метода в наследниках класса.
 *
 * Задачей данного метода является организация логики управления отображением
 * и данными того контейнера приложения, к которому относиться контроллер.
 */
tuna.control.Controller.prototype.initActions = function() {};


/**
 * Уничтожение поведения конкретного контроллера.
 *
 * В зависимости от реализации метода
 * {@link tuna.control.Controller#initActions} конкретного контроллера,
 * данный метод должен уничтожать проинициализированное ранее поведение.
 *
 * @see tuna.control.Controller#initActions
 */
tuna.control.Controller.prototype.destroyActions = function() {};
