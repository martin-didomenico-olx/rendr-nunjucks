'use strict';

var nunjucks = require('nunjucks');
var isServer = typeof window === 'undefined';
var serverOnlyLayoutFinderPath = './server/layoutFinder';
var localExports = {};

if (!isServer) {
    nunjucks = window.nunjucks;
}
nunjucks = nunjucks.configure('app/templates', {
    watch: false
});

localExports.nunjucks = nunjucks;

localExports.getTemplate = require('./shared/templateFinder')(nunjucks).getTemplate;

if (isServer) {
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

module.exports = function() {
    return localExports;
};
