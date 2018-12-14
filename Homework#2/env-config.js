/*
 * Create and export configuration variables
 *
*/

// Container for all environments
let environments = { };

// Production environment
environments.production = {
  'httpPort' : 5080,
  'httpsPort' : 5443,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret'
 };

// Development environment
environments.development = {
  'httpPort' : 3080,
  'httpsPort' : 3443,
  'envName' : 'development',
  'hashingSecret' : 'thisIsASecret'
};

// Determine which environment was passed as a command-line argument
const currentEnv = ( typeof(process.env.NODE_ENV) == 'string' )
  ? process.env.NODE_ENV.toLowerCase()
  : '';

// Check that the current environment is one of the environments above,
// if not default to staging
const expEnv = ( typeof(environments[currentEnv]) == 'object' )
  ? environments[currentEnv]
  : environments.development;

module.exports = expEnv;
