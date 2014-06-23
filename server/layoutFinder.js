'use strict';

module.exports = function(nunjucks) {
    return {
        getLayout: function(name, entryPath, callback) {
            callback(null, function(data) {
                return nunjucks.render(name + '.html', data);
            });
        }
    };
}
