'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

/**
 * Enhanced Email Service
 * Supports both raw sending and template-based sending.
 */
class EmailService {
  constructor() {
    this.layout = '<%= body %>';
    const layoutPath = path.join(__dirname, '../plugins/stb-email/server/templates/template.txt');
    try {
      if (fs.existsSync(layoutPath)) {
        this.layout = fs.readFileSync(layoutPath, 'utf8');
      }
    } catch (err) {
      console.warn('[Email Service] Layout not found yet, will use raw body.');
    }
  }

  /**
   * Send a compiled template using its slug
   */
  async sendTemplate(slug, data = {}, models) {
    if (!models || !models.EmailTemplate) {
      console.warn(`[Email Service] EmailTemplate model not registered. Falling back to raw send.`);
      return this.sendEmail({
        to: data.email,
        subject: `Fallback: ${slug}`,
        text: JSON.stringify(data),
      });
    }

    const template = await models.EmailTemplate.findOne({ where: { slug } });
    if (!template) {
      throw new Error(`Email template with slug "${slug}" not found.`);
    }

    const compiledSubject = _.template(template.subject)(data);
    const compiledBody = _.template(template.body)(data);
    const finalContent = _.template(this.layout)({ body: compiledBody });

    console.log('==================================================');
    console.log(`[Email Service] Template Sent: ${slug}`);
    console.log(`To: ${data.to || template.to || 'No recipient'}`);
    console.log(`Subject: ${compiledSubject}`);
    console.log('--- CONTENT ---');
    console.log(finalContent);
    console.log('==================================================');

    return { success: true, content: finalContent };
  }

  /**
   * Basic raw email send
   */
  async sendEmail({ to, subject, text }) {
    console.log('--------------------------------------------------');
    console.log(`[Email Service] Raw Sending:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('--------------------------------------------------');
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

module.exports = new EmailService();
