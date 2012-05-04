


/**
 * Класс управления страницей отображения. Страница отображения представляет
 * собой DOM-элемент, являющийся элементом выделения модуля управлением
 * навигацией {@link tuna.ui.selection.Navigation}.
 *
 * В данном классе к базовой логике работы класса управления отображением
 * добавлена логика обработки "открытия" и "закрытия" станицы отображения.
 *
 * @see tuna.ui.selection.Navigation
 * @see tuna.ui.selection.rule.NavigationSelectionRule
 * @constructor
 * @extends {tuna.control.Controller}
 */
tuna.control.PageController = function() {
    tuna.control.Controller.call(this);

    /**
     * Модуль упрaвления навигацией, страницей которого управляет данный
     * контроллер.
     *
     * @protected
     * @type {tuna.ui.selection.Navigation}
     */
    this._navigation = null;
};

tuna.utils.extend(tuna.control.PageController, tuna.control.Controller);


/**
 * Установка соответсующего модуля упарвления навигацией.
 *
 * @see tuna.ui.selection.rule.NavigationSelectionRule
 * @param {tuna.ui.selection.Navigation} navigation Модуль упарвления
 *        навигацией.
 */
tuna.control.PageController.prototype.setNavigation = function(navigation) {
    this._navigation = navigation;
};


/**
 * Проверка возможности "закрытия" соответсующей контроллеру страницы
 * отображения.
 *
 * Если возможность закрытия по каким-либо причинам отсутствует, переход к
 * следующей странице с индеком <code>index</code> не произойдет.
 *
 * Реализация проверки возможности закрытия переопределяется в наследниках
 * класса.
 *
 * @see tuna.ui.selection.rule.NavigationSelectionRule
 * @param {string|number} index Индекс открываемой страницы.
 * @return {boolean} Возможность закрытия.
 */
tuna.control.PageController.prototype.canClose = function(index) {
    return true;
};


/**
 * Обработка закрытия соответсующей страницы отображения.
 *
 * Реализация обработки закрытия переопределяется в наследниках класса.
 *
 * @see tuna.ui.selection.rule.NavigationSelectionRule
 */
tuna.control.PageController.prototype.close = function() {};


/**
 * Обработка открытия соответсующей страницы отображения.
 *
 * В качестве сопуствующих данных, можуг передаваться дополнительные аргументы
 * открытия страницы.
 *
 * Реализация обработки открытия и обработка сопутствующих данных
 * переопределяется в наследниках класса.
 *
 * @param {Object.<string, string>} args Данные сопуствующие открытию.
 */
tuna.control.PageController.prototype.open = function(args) {};

