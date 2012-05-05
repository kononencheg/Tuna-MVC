


/**
 * Интерфейс динамического элемента интерфейса - виджета.
 *
 * Виджетом отображения может быть всплывающее окно, кнопка, список
 * отображения и тд.
 *
 * @see tuna.ui.Container
 * @see tuna.ui.Widget
 * @interface
 * @extends {tuna.events.IEventDispatcher}
 */
tuna.ui.IWidget = function() {};


/**
 * Получение целевого DOM-элемента виджета.
 *
 * @return {!Node} Целевой DOM-элемент.
 */
tuna.ui.IWidget.prototype.getTarget = function() {};


/**
 * Получение имени виджета.
 *
 * Имя виджета устанавливается в аттрибуте целевого DOM-элемента
 * <code>data-name</code>.
 *
 * @return {?string} Имя экземпляра.
 */
tuna.ui.IWidget.prototype.getName = function() {};


/**
 * Инициализация виджета.
 */
tuna.ui.IWidget.prototype.init = function() {};


/**
 * Уничтожение виджета.
 */
tuna.ui.IWidget.prototype.destroy = function() {};


/**
 * Отключение работоспособности виджета.
 */
tuna.ui.IWidget.prototype.disable = function() {};


/**
 * Включение работоспособности виджета.
 */
tuna.ui.IWidget.prototype.enable = function() {};


/**
 * Проверка работоспособности виджета.
 *
 * @return {boolean} Результат проверки.
 */
tuna.ui.IWidget.prototype.isEnabled = function() {};


/**
 *
 */
tuna.ui.IWidget.prototype.select = function() {};


/**
 *
 */
tuna.ui.IWidget.prototype.deselect = function() {};


/**
 *
 * @return {boolean} Результат проверки.
 */
tuna.ui.IWidget.prototype.isSelected = function() {};


/**
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 * @return {!tuna.ui.IWidget}
 */
tuna.ui.IWidget.prototype.clone = function(target, opt_container) {};
