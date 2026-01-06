const MatchList = require("../models/matchList");
const { getUsersByRoles } = require("./userRoleService");

async function getMatchListByUser(users) {
  const usersByRoles = await getUsersByRoles();
  let userIds = usersByRoles.map((r) => r.id);
  if (users && users !== "*") {
    userIds = users
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((s) => s.trim());
  }
  const aggregated = await MatchList.aggregate([
    { $match: { CreatedBy: { $in: userIds } } },
    {
      $group: {
        _id: "$CreatedBy",
        totalNProfile: { $sum: "$NProfile" },
      },
    },
  ]);

  const aggMap = new Map(aggregated.map((item) => [item._id, item.totalNProfile]));

  return userIds.map((rid) => {
    const recruiter = usersByRoles.find((r) => r.id === rid);
    return {
      label: recruiter ? recruiter.name : rid,
      value: aggMap.get(rid) ?? 0,
    };
  });
}

module.exports = { getMatchListByUser };