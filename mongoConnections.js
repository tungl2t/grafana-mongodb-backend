const mongoose = require("mongoose");

const orgConnection = mongoose.createConnection(process.env.MONGO_URI, { dbName: "organization-service" });

const candidateConnection = mongoose.createConnection(process.env.MONGO_URI, { dbName: "candidate-service" });

const documentConnection = mongoose.createConnection(process.env.MONGO_URI, { dbName: "document-mng" });

module.exports = {
  orgConnection, candidateConnection, documentConnection,
};
