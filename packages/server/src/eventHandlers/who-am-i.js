const { getUser, createUser, updateUsername, updateTTL } = require('../helpers/db-operations');

const whoAmI = async (userId, username) => {
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

    // Expire user TimeToLive in 30 minutes after last interaction
    const ttl = Math.floor(Date.now() / 1000 + 30 * 60);
    await updateTTL(userId, ttl);
  } catch (err) {
    console.log(err);
    return null;
  }

  return userData.Item;
};

module.exports = {
  whoAmI,
};
