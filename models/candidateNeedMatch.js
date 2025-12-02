const mongoose = require("mongoose");
const {orgConnection} = require("../mongoConnections");

const StatusChangeSchema = new mongoose.Schema(
  {
    From: Number,
    To: Number,
    ChangedAt: Date,
    ChangedBy: String,
  },
  {_id: false}
);

const CandidateNeedMatchSchema = new mongoose.Schema(
  {
    StatusHistory: [StatusChangeSchema],
  },
  {collection: "CandidateNeedMatches"}
);

module.exports = orgConnection.model("CandidateNeedMatches", CandidateNeedMatchSchema);
