export const mailchimp = `
import mailchimp from '@mailchimp/mailchimp_marketing';

// Configure Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX // e.g., 'us1'
});

/**
 * Add a subscriber to a Mailchimp list
 * @param {Object} options - Subscriber options
 * @param {string} options.email - Subscriber's email address
 * @param {string} options.firstName - Subscriber's first name (optional)
 * @param {string} options.lastName - Subscriber's last name (optional)
 * @param {Array} options.tags - Tags to associate with the subscriber (optional)
 * @returns {Promise} - Promise that resolves with Mailchimp response
 */
export async function addSubscriber({ email, firstName, lastName, tags = [] }) {
  const listId = process.env.MAILCHIMP_LIST_ID;

  const subscriberData = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    },
    tags: tags
  };

  try {
    const response = await mailchimp.lists.addListMember(listId, subscriberData);
    console.log('Successfully added contact as an audience member');
    return response;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    if (error.response && error.response.body) {
      console.error(error.response.body);
    }
    throw error;
  }
}

/**
 * Update a subscriber in a Mailchimp list
 * @param {Object} options - Subscriber options
 * @param {string} options.email - Subscriber's email address
 * @param {string} options.firstName - Subscriber's first name (optional)
 * @param {string} options.lastName - Subscriber's last name (optional)
 * @param {Array} options.tags - Tags to associate with the subscriber (optional)
 * @returns {Promise} - Promise that resolves with Mailchimp response
 */
export async function updateSubscriber({ email, firstName, lastName, tags }) {
  const listId = process.env.MAILCHIMP_LIST_ID;
  const subscriberHash = mailchimp.md5(email.toLowerCase());

  const subscriberData = {
    email_address: email,
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    },
    tags: tags
  };

  try {
    const response = await mailchimp.lists.updateListMember(listId, subscriberHash, subscriberData);
    console.log('Successfully updated the contact');
    return response;
  } catch (error) {
    console.error('Error updating subscriber:', error);
    if (error.response && error.response.body) {
      console.error(error.response.body);
    }
    throw error;
  }
}

// Example usage:
/*
import { addSubscriber, updateSubscriber } from './services/mailchimp.js';

try {
  await addSubscriber({
    email: 'newsubscriber@example.com',
    firstName: 'John',
    lastName: 'Doe',
    tags: ['new customer']
  });
  console.log('Subscriber added successfully');

  await updateSubscriber({
    email: 'existingsubscriber@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    tags: ['updated profile']
  });
  console.log('Subscriber updated successfully');
} catch (error) {
  console.error('Failed to manage subscriber:', error);
}
*/
`;
