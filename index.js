'use strict';

var nunjucks;

module.exports = function() {
    var localExports = {
        init: init
    };

    function init(location) {
        nunjucks = nunjucks || (function(nunjucks) {
            var defaultTemplates = 'app/templates/compiled/default/html5/templates';

            if (typeof window !== 'undefined') {
                nunjucks = window.nunjucks;
                try {
                    require('app/templates/compiled/' + location + '/html5/templates');
                }
                catch(err) {
                    require(defaultTemplates);
                }
            }
            return nunjucks.configure('app/templates', {
                watch: false
            });
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
        localExports.registerExtensions = function(extensions) {
            extensions = extensions(nunjucks);
            for (var extension in extensions) {
                nunjucks.addExtension(extension, new extensions[extension]);
            }
        };
        localExports.registerExtensions(require('./shared/extensions'));
        localExports.registerHelpers = function(helpers) {
            helpers = helpers(nunjucks);
            for (var helper in helpers) {
                nunjucks.addFilter(helper, helpers[helper]);
            }
        };
        localExports.registerHelpers(require('./shared/helpers'));
    }

    return localExports;
}
