const mongoose = require("mongoose");
const { orgConnection } = require("../mongoConnections");

const NeedSchema = new mongoose.Schema(
    {
        Status: Number,
    },
    { collection: "Needs" }
);

module.exports = orgConnection.model("Needs", NeedSchema);
