


/**
 * Интерфейс хранилища модели данных приложения.
 *
 * @event <code>update</code> - При изменении хранимого набора данных.
 *
 * @interface
 * @extends {tuna.events.IEventDispatcher}
 */
tuna.model.IResource = function() {};


/**
 * Очищение хранимого набора данных.
 */
tuna.model.IResource.prototype.clear = function() {};
