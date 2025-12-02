const mongoose = require('mongoose');

const orgConnection = mongoose.createConnection(process.env.MONGO_URI, {dbName: 'organization-service'});

const candidateConnection = mongoose.createConnection(process.env.MONGO_URI, {dbName: 'candidate-service'});

module.exports = {
  orgConnection,
  candidateConnection,
};
