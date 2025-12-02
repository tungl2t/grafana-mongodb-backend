const mongoose = require("mongoose");
const {candidateConnection} = require("../mongoConnections");

const CandidateSchema = new mongoose.Schema(
  {
    Platform: String,
  },
  {collection: "Candidates"}
);

module.exports = candidateConnection.model("Candidates", CandidateSchema);
