/**
 * Plugin Configuration
 * 
 * To enable a plugin, add its directory name as a key with `enabled: true`.
 * Custom configuration for the plugin can be added in the `config` object.
 */
module.exports = {
  'my-plugin': {
    enabled: true,
    config: {
      message: 'Hello from my custom plugin!',
    },
  },
};
