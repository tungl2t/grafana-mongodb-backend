const MatchList = require("../models/matchList");
const { getAllRecruiters } = require("./organizationService");

async function getMatchListByRecruiter(recruiters) {
  const allRecruiters = await getAllRecruiters();
  let recruiterList = allRecruiters.map(r => r.id);
  if (recruiters && recruiters !== "*") {
    recruiterList = recruiters
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((s) => s.trim());
  }
  const aggregated = await MatchList.aggregate([
    { $match: { CreatedBy: { $in: recruiterList } } },
    {
      $group: {
        _id: "$CreatedBy",
        totalNProfile: { $sum: "$NProfile" },
      },
    },
  ]);

  const aggMap = new Map(
    aggregated.map(item => [item._id, item.totalNProfile]),
  );

  return recruiterList.map(rid => {
    const recruiter = allRecruiters.find(r => r.id === rid);
    return {
      label: recruiter ? recruiter.name : rid,
      value: aggMap.get(rid) ?? 0,
    };
  });
}

module.exports = { getMatchListByRecruiter };