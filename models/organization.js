const mongoose = require("mongoose");
const { orgConnection } = require("../mongoConnections");

const RecruiterSchema = new mongoose.Schema({
  _id: Buffer,
  Name: String,
  Email: String,
}, { _id: false });

const OrganizationSchema = new mongoose.Schema(
  {
    Recruiters: [RecruiterSchema],
  },
  { collection: "Organizations" },
);

module.exports = orgConnection.model("Organizations", OrganizationSchema);
