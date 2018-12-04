/*
 * Exports environment configuration
 *
*/

// environments container
var environments = { };

// development (default) environment
environments.development = {
    'httpPort': 3080,
    'httpsPort': 3443,
    'envName': 'development'
};

// production environment
environments.production = {
    'httpPort': 5080,
    'httpsPort': 5443,
    'envName': 'production'
};

// Determine which environment was passed as a command-line argument
const optedEnv = typeof(process.env.NODE_ENV) == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check that the current environment is one of the environments above,
// if not, defaults to development
const checkedEnv = typeof environments[optedEnv] == 'object'
    ? environments[optedEnv]
    : environments.development;

module.exports = checkedEnv;
