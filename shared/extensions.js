'use strict';

var _ = require('underscore');

module.exports = function(nunjucks) {
    function getProperty(key, context) {
        return context[key] || context['ctx'][key];
    }

    return {
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
