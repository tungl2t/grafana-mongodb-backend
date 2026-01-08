const mongoose = require("mongoose");
const { candidateConnection } = require("../mongoConnections");

const CandidateSchema = new mongoose.Schema(
  {
    _id: String,
    Platform: String,
    RegistrationDate: Date,
  },
  { collection: "Candidates" },
);

module.exports = candidateConnection.model("Candidates", CandidateSchema);
