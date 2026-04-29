module.exports = {
  default: {
    hasOffer: true,
    propertyStatus: ['for sale'],
    params: {
      initialParam: 'default',
    },
  },
  validator(config) {
    if (typeof config.hasOffer !== 'boolean') {
      throw new Error('Property "hasOffer" must be a boolean');
    }
    if (!Array.isArray(config.propertyStatus)) {
      throw new Error('Property "propertyStatus" must be an array');
    }
  },
};
