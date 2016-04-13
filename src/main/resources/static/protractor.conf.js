exports.config = {
    directConnect: true,

    framework: 'mocha',

    mochaOpts: {
        reporter: 'spec',
        slow: 3000,
        enableTimeouts: false
    },

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['e2e/**/*.js'],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    }
};
