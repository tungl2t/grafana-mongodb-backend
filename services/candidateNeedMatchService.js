const CandidateNeedMatch = require("../models/candidateNeedMatch");
const { getAllOpenNeeds } = require("./needService");
const { convertLegacyUUID } = require("./helpers");

async function getNumberOfCandidatesByStage(from, to) {
  const statuses = [0, 2, 4, 5];

  const result = await CandidateNeedMatch.aggregate([
    {
      $match: {
        MatchStatus: { $in: statuses },
        ListId: { $ne: null },
        CandidateLikeDate: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    },
    { $group: { _id: "$MatchStatus", count: { $sum: 1 } } },
  ]);

  const labelMap = {
    0: "1st Column",
    2: "2nd Column",
    4: "3rd Column",
    5: "4th Column",
  };

  return statuses.map(s => ({
    label: labelMap[s],
    value: result.find(r => r._id === s)?.count || 0,
  }));
}

async function getNumberOfCandidatesByNeed(needs) {
  const allNeeds = await getAllOpenNeeds();
  let needList = allNeeds.map(n => n._id);
  if (needs && needs !== "*") {
    const selectedUUIDs = needs
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map(s => s.trim());

    needList = allNeeds.filter(n => selectedUUIDs.includes(n.id)).map(n => n._id);
  }
  const results = await CandidateNeedMatch.aggregate([
    { $match: { NeedId: { $in: needList } } },
    { $group: { _id: "$NeedId", count: { $sum: 1 } } },
  ]);
  const resultMap = new Map();
  for (const r of results) {
    const uuid = convertLegacyUUID(r._id.toString("base64"));
    resultMap.set(uuid, r.count);
  }
  const output = needList.map(n => {
    const id = convertLegacyUUID(n.toString("base64"));
    const needInfo = allNeeds.find(a => a.id === id);
    return {
      label: needInfo ? needInfo.name : "",
      value: resultMap.get(id) ?? 0,
    };
  });
  return output.sort((a, b) => b.value - a.value);
}

module.exports = { getNumberOfCandidatesByStage, getNumberOfCandidatesByNeed };