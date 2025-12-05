const mongoose = require("mongoose");
const { orgConnection } = require("../mongoConnections");

const MatchListSchema = new mongoose.Schema(
  {
    _id: Buffer,
    CreationDate: Date,
    NProfile: Number,
    CreatedBy: String,
  },
  { collection: "MatchLists" },
);

module.exports = orgConnection.model("MatchLists", MatchListSchema);
