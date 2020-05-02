const { getUser, createUser, updateUsername } = require('../helpers/db-operations');

const whoAmI = async (userId, username, email, emailVerified) => {
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

  return {
    ...userData.Item,
    email,
    emailVerified,
  };
};

module.exports = {
  whoAmI,
};
