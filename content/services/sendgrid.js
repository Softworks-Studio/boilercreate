export const sendgrid = `
import sgMail from '@sendgrid/mail';

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.from - Sender email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content of the email
 * @param {string} options.html - HTML content of the email
 * @returns {Promise} - Promise that resolves with SendGrid response
 */
export async function sendEmail({ to, from, subject, text, html }) {
  const msg = {
    to,
    from: from || process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
    html
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}

// Example usage:
/*
import { sendEmail } from './services/sendgrid.js';

try {
  await sendEmail({
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent from SendGrid.',
    html: '<p>This is a test email sent from <strong>SendGrid</strong>.</p>'
  });
  console.log('Email sent successfully');
} catch (error) {
  console.error('Failed to send email:', error);
}
*/

// Template email function (optional)
export async function sendTemplateEmail({ to, templateId, dynamicTemplateData }) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId,
    dynamicTemplateData
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Template email sent successfully');
    return response;
  } catch (error) {
    console.error('Error sending template email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}

// Example usage of template email:
/*
import { sendTemplateEmail } from './services/sendgrid.js';

try {
  await sendTemplateEmail({
    to: 'recipient@example.com',
    templateId: 'd-your-template-id',
    dynamicTemplateData: {
      name: 'John Doe',
      verificationLink: 'https://yourdomain.com/verify?token=123456'
    }
  });
  console.log('Template email sent successfully');
} catch (error) {
  console.error('Failed to send template email:', error);
}
*/
`;
