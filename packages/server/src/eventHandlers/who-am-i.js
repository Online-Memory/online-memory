const AWS = require('aws-sdk');
const { getUser, createUser, updateUsername } = require('../helpers/db-operations');

const REGION = process.env.REGION || 'us-east-1';
const USER_POOL_ID = process.env.USER_POOL_ID || '';

AWS.config.update({ region: REGION });

const whoAmI = async userId => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  const getUserParams = {
    UserPoolId: USER_POOL_ID,
    Username: userId,
  };

  const cognitoUserData = await cognitoidentityserviceprovider.adminGetUser(getUserParams).promise();

  const { UserAttributes } = cognitoUserData;
  const username = UserAttributes.find(attribute => attribute.Name === 'name').Value;
  const email = UserAttributes.find(attribute => attribute.Name === 'email').Value;
  const emailVerified = UserAttributes.find(attribute => attribute.Name === 'email_verified').Value;

  let userData;
  try {
    userData = await getUser(userId);

    // Create a new user in the database if doesn't exist
    if (!userData || !userData.Item) {
      await createUser(userId, username);
      userData = await getUser(userId);
    }

    if (userData.Item.username !== username) {
      await updateUsername(userId, username);
      userData = await getUser(userId);
    }
  } catch (err) {
    console.log(err);
    return null;
  }

  const friendsList = userData.Item.friends || [];

  return {
    ...userData.Item,
    email,
    emailVerified,
    friendsList,
  };
};

module.exports = {
  whoAmI,
};
