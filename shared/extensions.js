'use strict';

var _ = require('underscore');
var BaseView = require('rendr/shared/base/view');

module.exports = function(nunjucks) {
    function getProperty(key, context) {
        return context[key] || context['ctx'][key];
    }

    return {
        View: function() {
            this.tags = ['view'];
            this.parse = function(parser, nodes, lexer) {
                var tok = parser.nextToken();
                var args = parser.parseSignature(null, true);

                parser.advanceAfterBlockEnd(tok.value);
                return new nodes.CallExtension(this, 'run', args);
            }
            this.run = function(context, id) {
                var app = getProperty('_app', context);
                var parentView = getProperty('_view', context);
                var options = {};
                var ViewClass;
                var view;

                if (app) {
                    options.app = app;
                    id = app.modelUtils.underscorize(id);
                }
                else{
                    throw new Error("An App instance is required when rendering a view, it could not be extracted from the options.")
                }
                if (parentView) {
                    options.parentView = parentView;
                }
                ViewClass = BaseView.getView(id, app.options.entryPath);
                view = new ViewClass(options);
                return view.getHtml();
            }
        },
        JSON: function() {
            this.tags = ['json'];
            this.parse = function(parser, nodes, lexer) {
                var tok = parser.nextToken();
                var args = parser.parseSignature(null, true);

                parser.advanceAfterBlockEnd(tok.value);
                return new nodes.CallExtension(this, 'run', args);
            }
            this.run = function(context, json) {
                return JSON.stringify(json);
            }
        }
    };
};
