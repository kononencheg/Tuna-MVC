/**
 * @constructor
 * @extends tuna.ui.Widget
 * @implements tuna.ui.transformers.ITransformer
 * @param {!Node} target
 * @param {tuna.ui.Container=} opt_container
 */
tuna.ui.transformers.TemplateTransformer = function (target, opt_container) {
    tuna.ui.Widget.call(this, target, opt_container);

    /**
     * @private
     * @type {tuna.tmpl.units.Template}
     */
    this.__template = null;


    /**
     * @private
     * @type {tuna.ui.transformers.ITransformHandler}
     */
    this.__transformHandler = null;
};

tuna.utils.extend
    (tuna.ui.transformers.TemplateTransformer, tuna.ui.Widget);


/**
 * @override
 */
tuna.ui.transformers.TemplateTransformer.prototype.init = function() {
    var templateId = this.getStringOption('template-id');

    if (templateId !== null) {
        var settings = tuna.tmpl.getTemplateSettingsById(templateId);
        if (settings !== null) {
            this.__template = tuna.tmpl.compile(this._target, settings);
        } else {
            throw 'Unknown template with id "' + templateId + '"';
        }
    }
};

/**
 * @override
 */
tuna.ui.transformers.TemplateTransformer.prototype.setTransformHandler
    = function(handler) {

    this.__transformHandler = handler;
};

/**
 * @override
 */
tuna.ui.transformers.TemplateTransformer.prototype.applyTransform
    = function(data) {

    if (this.__transformHandler !== null) {
        this.__transformHandler.handleTransformStart(this);
    }

    this.__template.applyData(new tuna.tmpl.data.DataNode(data));

    if (this.__transformHandler !== null) {
        var createdChildren = this.__template.fetchCreatedChildren();
        var removedChildren = this.__template.fetchRemovedChildren();

        if (this._container !== null) {
            var i = createdChildren.length - 1;
            while (i >= 0) {
                this._container.initWidgets(createdChildren[i]);
                i--;
            }

            i = removedChildren.length - 1;
            while (i >= 0) {
                this._container.destroyWidgets(removedChildren[i]);
                i--;
            }
        }

        this.__transformHandler.handleTransformComplete
            (this, createdChildren, removedChildren);
    }
};

/**
 * @override
 */
tuna.ui.transformers.TemplateTransformer.prototype.destroy = function() {
    this.__template.destroy();
    this.__template = null;
    this.__transformHandler = null;
};


tuna.ui.transformers.TemplateTransformer.prototype.reset = function() {
    var transformHandler = this.__transformHandler;

    this.destroy();
    this.init();

    this.__transformHandler = transformHandler;
};
