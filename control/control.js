


/**
 * Область имен классов управления логикой приложения.
 *
 * @namespace
 */
tuna.control = {};


/**
 * @private
 * @type {!Object.<string, !tuna.control.Controller>}
 */
tuna.control.__controllerTable = {};


/**
 * @private
 * @type {tuna.control.Controller}
 */
tuna.control.__applicationController = null;


/**
 * Установка основного контроллера логики.
 *
 * Инициализация основного контроллера отображения вызывается функцией
 * {@link tuna.control.init}.
 *
 * Иициализация логики приложения реализуется в методе
 * {@link tuna.control.Controller#initActions} контроллера установленного как
 * основной.
 *
 * @see tuna.control.init
 * @see tuna.control.Controller#initActions
 * @param {!tuna.control.Controller} controller Контроллер отображения,
 *        устанавливаемый как основной.
 */
tuna.control.setApplicationController = function(controller) {
    tuna.control.__applicationController = controller;
};


/**
 * Регистрация контроллера управелния с идентификатором, обычно соответсвующим
 * идентификатору DOM-элемента логикой отображения которого нужно управлять.
 *
 * @see tuna.control.getController
 * @param {string} id Идентификатор контроллера.
 * @param {!tuna.control.Controller} controller Соответсвующиq контроллер.
 */
tuna.control.registerController = function(id, controller) {
    tuna.control.__controllerTable[id] = controller;
};


/**
 * Взятие соответсвующего контроллера по идентификатору.
 *
 * @see tuna.control.registerController
 * @param {string} id Идентификатор контроллера.
 * @return {tuna.control.Controller} Соответсвующиq контроллер.
 */
tuna.control.getController = function(id) {
    if (tuna.control.__controllerTable[id] !== undefined) {
        return tuna.control.__controllerTable[id];
    }

    return null;
};


/**
 * Инициализация основного контроллера.
 *
 * @see tuna.control.setApplicationController
 * @param {!Node} target Корневой для приложения DOM-элемент, обычно в качестве
 *        корневого элемента выбирается <code>document.body</code>.
 */
tuna.control.init = function(target) {
    var container = new tuna.ui.Container(target);

    if (tuna.control.__applicationController !== null) {
        tuna.control.__applicationController.setContainer(container);
    }

    container.init();
};
