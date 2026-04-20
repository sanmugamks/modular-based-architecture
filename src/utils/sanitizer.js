'use strict';

const _ = require('lodash');

/**
 * Sanitizer Utility (Strapi-inspired)
 */
const sanitize = {
  /**
   * sanitize.output
   * Removes fields marked as 'hidden' in the model's rawAttributes.
   * 
   * @param {Object|Array} data - The data to sanitize (instance or plain object)
   * @param {Object} model - The Sequelize model
   */
  output(data, model) {
    if (!data || !model) return data;

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.output(item, model));
    }

    // Convert Sequelize instance to plain object if needed
    const plainData = data.toJSON ? data.toJSON() : _.cloneDeep(data);

    // Identify hidden fields from the model
    const hiddenFields = Object.keys(model.rawAttributes || {}).filter(
      key => model.rawAttributes[key].hidden === true
    );

    // Remove hidden fields
    hiddenFields.forEach(field => {
      delete plainData[field];
    });

    return plainData;
  },

  /**
   * sanitize.input
   * Removes fields from the input that are not defined in the model schema.
   * 
   * @param {Object} data - The input data to sanitize
   * @param {Object} model - The Sequelize model
   */
  input(data, model) {
    if (!data || !model || typeof data !== 'object') return data;

    // Get all valid attribute keys for this model
    const validKeys = Object.keys(model.rawAttributes || {});

    // Pick only the fields that exist in the schema
    return _.pick(data, validKeys);
  }
};

module.exports = sanitize;
