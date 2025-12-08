const mongoose = require("mongoose");
const { orgConnection } = require("../mongoConnections");

const RoleSchema = new mongoose.Schema({
  _id: Buffer,
  Name: String,
}, { _id: false });

const NeedSchema = new mongoose.Schema(
  {
    _id: Buffer,
    Role: RoleSchema,
    JobTitle: String,
    Status: Number,
    CreationDate: Date,
  },
  { collection: "Needs" },
);

module.exports = orgConnection.model("Needs", NeedSchema);
