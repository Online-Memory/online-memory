const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { findItem } = require('./db-operations');
const { doesItemExist } = require('./does-item-exists');

const randomNameConfig = {
  dictionaries: [adjectives, colors, animals],
  length: 3,
  separator: '_',
  style: 'lowerCase',
};

exports.generateUniqueName = async () => {
  const randomName = async (fileName, iteration = 1) => {
    if (iteration > 3) {
      return null;
    }

    let itemData;
    try {
      itemData = await findItem(fileName);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (doesItemExist(itemData)) {
      const newFileName = uniqueNamesGenerator(randomNameConfig);
      return randomName(newFileName, iteration + 1);
    }
    return fileName;
  };

  return randomName(uniqueNamesGenerator(randomNameConfig));
};
