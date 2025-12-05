const CandidateNeedMatch = require("../models/candidateNeedMatch");

async function getNumberOfCandidatesByStage() {
  const statuses = [0, 2, 4, 5];

  const result = await CandidateNeedMatch.aggregate([
    { $match: { MatchStatus: { $in: statuses }, ListId: { $ne: null } } },
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

module.exports = { getNumberOfCandidatesByStage };