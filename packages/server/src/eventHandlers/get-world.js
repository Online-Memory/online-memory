const { updateTTL } = require('../helpers/db-operations');

const getWorld = async userId => {
  const now = Math.floor(Date.now() / 1000);
  const ttl = now + 60 * 2;

  // Expire user TimeToLive in 2 minutes
  await updateTTL(userId, ttl, now);
};

module.exports = {
  getWorld,
};
