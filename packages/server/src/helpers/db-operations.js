const AWS = require('aws-sdk');

const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.TABLE_NAME || '';

AWS.config.update({ region: REGION });

const docClient = new AWS.DynamoDB.DocumentClient();

const findItem = async itemId => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': itemId,
    },
  };

  return docClient.query(params).promise();
};

const findUsername = async username => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: 'TypenameGSI',
    KeyConditionExpression: '#type = :typeValue',
    FilterExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#type': '__typename',
      '#username': 'username',
    },

    ExpressionAttributeValues: {
      ':typeValue': 'User',
      ':username': username,
    },
  };

  return docClient.query(params).promise();
};

const getUser = async userId => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: userId,
      __typename: 'User',
    },
  };

  return docClient.get(params).promise();
};

const createUser = async (userId, username) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      username,
      avatar: userId,
      id: userId,
      __typename: 'User',
      displayName: username,
      searchableUsername: `${username}`.toLocaleLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  return docClient.put(params).promise();
};

const updateUsername = async (userId, username) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: userId,
      __typename: 'User',
    },
    UpdateExpression: 'set #username = :username, #searchableUsername = :searchableUsername',
    ExpressionAttributeNames: {
      '#username': 'username',
      '#searchableUsername': 'searchableUsername',
    },
    ExpressionAttributeValues: {
      ':username': username,
      ':searchableUsername': `${username}`.toLocaleLowerCase(),
    },
  };

  return docClient.update(params).promise();
};

const updateTTL = async (userId, expiresAt, now) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: userId,
      __typename: 'UserTTL',
    },
    UpdateExpression: 'set #expiresAt = :expiresAt, #time = :time, #now = :now',
    ExpressionAttributeNames: {
      '#expiresAt': 'expiresAt',
      '#time': 'createdAt',
      '#now': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':expiresAt': expiresAt,
      ':now': now,
      ':time': new Date().toISOString(),
    },
  };

  return docClient.update(params).promise();
};

module.exports = {
  findItem,
  getUser,
  createUser,
  updateTTL,
  updateUsername,
  findUsername,
};
