


/**
 * Область имен классов предназначенных для работы с REST
 * интерфейсом.
 * @namespace
 */
tuna.rest = {};


/**
 * Вызов удаленного метода по имени, зарегистриррованному в основной фабрике
 * методов.
 *
 * @see tuna.rest.methodFactory
 * @see tuna.rest.MethodFactory
 * @param {string} name Имя метода.
 * @param {Object} args Аргументы вызова метода.
 * @param {function(Object)=} opt_callback Слушатель результата метода.
 * @param {string=} opt_recordName Имя экземпляра модели данных, которому
 *        соответствует результат метода.
 */
tuna.rest.call = function(name, args, opt_callback, opt_recordName) {
    var method = tuna.rest.getMethodFactory().createMethod(name);

    var listener = null;
    if (opt_callback !== undefined) {
        if (opt_recordName === undefined) {
            listener = function(event, data) {
                opt_callback(data);
                method.removeEventListener('result', listener);
            };
        } else {
            listener = function(event, data) {
                if (opt_recordName !== undefined) {
                    opt_callback
                        (tuna.rest.populateRecords(data, opt_recordName));
                }

                method.removeEventListener('result', listener);
            };
        }
    }

    if (listener !== null) {
        method.addEventListener('result', listener);
    }

    method.call(args);
};


/**
 * Создание единственного или набора экземпляров модели даннных соответственно
 * типу передаваемых данных.
 *
 * @param {!(Object|Array.<Object>)} data Данные которые необходимо
 *        преобразовать в экземпляры наборов данных.
 * @param {string} name Имя экземпляра набора данных.
 * @return {tuna.model.Record|Array.<tuna.model.Record>} Массив либо
 *         единственный экземпляр данных.
 */
tuna.rest.populateRecords = function(data, name) {
    var recordPrototype = tuna.model.getRecordFactory()
                                    .getRecordPrototype(name);

    if (recordPrototype !== null && data !== null) {

        var record = null;
        if (data instanceof Array) {
            var result = [];

            var i = 0,
                l = data.length;

            while (i < l) {
                record = recordPrototype.clone();
                if (data[i] !== null) {
                    record.populate(data[i]);
                }

                result.push(record);

                i++;
            }

            return result;
        } else {
            record = recordPrototype.clone();
            record.populate(data);

            return record;
        }
    }

    return null;
};


/**
 * Основная фабрика методов приложения.
 *
 * @see tuna.rest.MethodFactory
 * @type {tuna.rest.MethodFactory}
 */
tuna.rest.__methodFactory = null;


/**
 * Получение основной фабрики методов приложения.
 *
 * @return {!tuna.rest.MethodFactory} Фабрика.
 */
tuna.rest.getMethodFactory = function() {
    if (tuna.rest.__methodFactory === null) {
        tuna.rest.__methodFactory =  new tuna.rest.MethodFactory();
    }

    return tuna.rest.__methodFactory;
};
