'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

/**
 * Template-Based Email Service
 */
module.exports = ({ models, config }) => {
  const { EmailTemplate } = models;
  
  // Load the layout file once (could be cached better in production)
  const layoutPath = path.join(__dirname, '../templates/template.txt');
  let layout = '<%= body %>';
  try {
    layout = fs.readFileSync(layoutPath, 'utf8');
  } catch (err) {
    console.error('[stb-email] Layout file template.txt not found, using raw body.');
  }

  return {
    /**
     * Send email using a stored template slug
     */
    async sendTemplate(slug, data = {}) {
      try {
        const template = await EmailTemplate.findOne({ where: { slug } });
        if (!template) {
          throw new Error(`Email template with slug "${slug}" not found.`);
        }

        // 1. Compile Subject
        const compiledSubject = _.template(template.subject)(data);

        // 2. Compile Body
        const compiledBody = _.template(template.body)(data);

        // 3. Wrap in Layout
        const finalContent = _.template(layout)({ body: compiledBody });

        // 4. Send (Log for POC)
        console.log('==================================================');
        console.log(`[stb-email] Rendering Template: ${slug}`);
        console.log(`Recipient: ${data.to || template.to || 'No recipient'}`);
        console.log(`Subject: ${compiledSubject}`);
        console.log('--- CONTENT START ---');
        console.log(finalContent);
        console.log('--- CONTENT END ---');
        console.log('==================================================');

        return { success: true, content: finalContent };
      } catch (err) {
        console.error(`[stb-email] Failed to send template ${slug}:`, err.message);
        throw err;
      }
    }
  };
};
