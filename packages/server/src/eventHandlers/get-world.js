const { updateTTL } = require('../helpers/db-operations');

const getWorld = async userId => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 60;

  // Expire user TimeToLive in 1 minute
  await updateTTL(userId, expiresAt, now);
};

module.exports = {
  getWorld,
};
