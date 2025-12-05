const Organization = require("../models/organization");
const { convertLegacyUUID } = require("./helpers");

async function getAllRecruiters() {
  const orgs = await Organization.find({}, { Recruiters: 1 });
  const map = new Map();
  for (const org of orgs) {
    if (!org.Recruiters) continue;

    for (const r of org.Recruiters) {
      if (!r.Name || String(r.Name).trim() === "") {
        continue;
      }
      const id = convertLegacyUUID(r._id.toString("base64"));
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: r.Name,
        });
      }
    }
  }
  return Array.from(map.values());
}

module.exports = { getAllRecruiters };