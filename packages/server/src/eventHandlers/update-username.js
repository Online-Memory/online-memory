const AWS = require('aws-sdk');
const { updateUsername: updateUsernameDb } = require('../helpers/db-operations');

const REGION = process.env.REGION || 'us-east-1';
const USER_POOL_ID = process.env.USER_POOL_ID || '';

AWS.config.update({ region: REGION });

const updateUsername = async (userId, username) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  const updateUserParams = {
    UserAttributes: [
      {
        Name: 'name',
        Value: `${username}`,
      },
    ],
    UserPoolId: USER_POOL_ID,
    Username: userId,
  };

  await cognitoidentityserviceprovider.adminUpdateUserAttributes(updateUserParams).promise();
  await updateUsernameDb(userId, username);

  return userId;
};

module.exports = {
  updateUsername,
};
