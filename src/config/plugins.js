/**
 * Plugin Configuration
 * 
 * To enable a plugin, add its directory name as a key with `enabled: true`.
 */
module.exports = {
  'stb-auth': {
    enabled: true,
    config: {
      jwtSecret: process.env.JWT_SECRET || 'very-secure-jwt-secret-key',
    },
  },
  'stb-myaccount': {
    enabled: true,
    config: {
      message: 'Business Domain Plugin',
    },
  },
  'my-plugin': {
    enabled: true,
    config: {
      message: 'Account Extensions Plugin',
    },
  },
};
