const mongoose = require("mongoose");
const { documentConnection } = require("../mongoConnections");

const EntityDocumentSchema = new mongoose.Schema(
  {
    EntityType: Number,
    DocumentType: Number,
    LastModified: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    }
  },
  { collection: "EntityDocuments" }
);

module.exports = documentConnection.model("EntityDocuments", EntityDocumentSchema);
