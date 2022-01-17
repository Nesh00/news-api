const testData = require('../data/test-data/index');
const seed = require('./seed');
const db = require('../connection');

const runTestSeed = () => {
  return seed(testData).then(() => db.end());
};

runTestSeed();
