const { getUser, createUser, putRandomAvatar } = require('../helpers/db-operations');

const whoAmI = async userId => {
  let userData;
  try {
    userData = await getUser(userId);

    // Create a new user in the database if doesn't exist
    if (!userData || !userData.Item) {
      await createUser(userId);
      userData = await getUser(userId);
    }
    if (!userData.Item.avatar) {
      await putRandomAvatar(userId);
      userData = await getUser(userId);
    }
  } catch (err) {
    console.log(err);
    return null;
  }

  return userData.Item;
};

module.exports = {
  whoAmI,
};
