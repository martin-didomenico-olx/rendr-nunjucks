'use strict';

module.exports = function(nunjucks) {
    return {
        getTemplate: function(name) {
            return function(data) {
                return nunjucks.render(name + '.html', data);
            };
        }
    };
};
