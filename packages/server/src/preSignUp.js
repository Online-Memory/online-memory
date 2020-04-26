const { findUsername } = require('./helpers/db-operations');
const { doesItemExist } = require('./helpers/does-item-exists');

exports.handler = async (event, _context, callback) => {
  const { name } = event.request.userAttributes;
  const data = await findUsername(name);
  const userData = await doesItemExist(data);

  // Return to Amazon Cognito
  if (!userData) {
    return callback(null, event);
  }

  return callback(`A user ${name} already exists. Please, choose another name`);
};
