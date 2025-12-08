const Need = require("../models/need");
const { convertLegacyUUID } = require("./helpers");

async function countOpenNeeds(from, to) {
  return Need.countDocuments({
    Active: true, Status: { $in: [1, 2] },
    CreationDate: { $gte: new Date(from), $lte: new Date(to) },
  });
}

async function getAllOpenNeeds(from, to) {
  const results = await Need.find({
    Active: true, Status: { $in: [1, 2] },
  });
  return results.map(result => ({
    id: convertLegacyUUID(result._id.toString("base64")),
    name: result.JobTitle || result.Role.Name,
  }));
}

module.exports = { countOpenNeeds, getAllOpenNeeds };