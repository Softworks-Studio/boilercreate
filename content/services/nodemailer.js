export const nodemailer = `
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Error with email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Function to send an email
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your Name" <from@example.com>',
      to: to,
      subject: subject,
      text: text,
      html: html
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Example usage:
/*
import { sendEmail } from './services/nodemailer.js';

try {
  await sendEmail({
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent from Nodemailer.',
    html: '<p>This is a test email sent from <strong>Nodemailer</strong>.</p>'
  });
  console.log('Email sent successfully');
} catch (error) {
  console.error('Failed to send email:', error);
}
*/
`;
