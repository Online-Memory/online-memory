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

const createUser = async userId => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: userId,
      __typename: 'User',
      username: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  return docClient.put(params).promise();
};

const putRandomAvatar = async userId => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: userId,
      __typename: 'User',
    },
    UpdateExpression: 'set #avatar = :userId',
    ExpressionAttributeNames: { '#avatar': 'avatar' },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  return docClient.update(params).promise();
};

module.exports = {
  findItem,
  getUser,
  createUser,
  putRandomAvatar,
};
