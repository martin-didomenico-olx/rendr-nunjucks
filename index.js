'use strict';

module.exports = function(options) {
    var localExports = {};
    var nunjucks = (function(nunjucks) {
        if (typeof window !== 'undefined') {
            nunjucks = window.nunjucks;
            require('app/templates/compiledTemplates');
        }
        return nunjucks.configure('app/templates');
    })(require('nunjucks'));

    localExports.nunjucks = nunjucks;
    localExports.getTemplate = require('./shared/templateFinder')(nunjucks).getTemplate;
    if (typeof window === 'undefined') {
        var serverOnlyLayoutFinderPath = './server/layoutFinder';

        // server only, "hide" it from r.js compiler by having require statement with variable
        localExports.getLayout = require(serverOnlyLayoutFinderPath)(nunjucks).getLayout;
    }
    else {
        localExports.getLayout = function() {
            throw new Error('getLayout is only available on the server.');
        };
    }
    localExports.registerHelpers = function(helpers) {
        helpers = helpers(nunjucks);
        for (var helper in helpers) {
            nunjucks.addFilter(helper, helpers[helper]);
        }
    };
    return localExports;
}
