const CandidateNeedMatch = require("../models/candidateNeedMatch");

async function getAverageDurations(from, to) {
  return CandidateNeedMatch.aggregate([
    {
      $match: {
        ListId: { $ne: null },
        CandidateLikeDate: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    },
    {
      $lookup: {
        from: "MatchLists",
        localField: "ListId",
        foreignField: "_id",
        as: "matchList",
      },
    },
    {
      $unwind: {
        path: "$matchList",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        CreationDate: "$matchList.CreationDate",
      },
    },
    {
      $match: {
        StatusHistory: { $exists: true, $ne: [] },
      },
    },
    {
      $project: {
        StatusHistory: 1,
        CandidateLikeDate: 1,
        CreationDate: 1,
      },
    },
    {
      $addFields: {
        firstColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$StatusHistory",
                cond: { $eq: ["$$this.From", 0] },
              },
            },
            0,
          ],
        },
      },
    },
    { $match: { firstColumn: { $exists: true, $ne: null } } },
    {
      $addFields: {
        lastSecondColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $reverseArray: "$StatusHistory" },
                cond: { $eq: ["$$this.To", 2] },
              },
            },
            0,
          ],
        },
        lastThirdColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $reverseArray: "$StatusHistory" },
                cond: { $eq: ["$$this.To", 4] },
              },
            },
            0,
          ],
        },
        lastFourthColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $reverseArray: "$StatusHistory" },
                cond: { $eq: ["$$this.To", 5] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        durations: {
          "From Platform to 1st Column": {
            $cond: [
              {
                $and: [
                  { $ne: ["$CandidateLikeDate", null] },
                  { $ne: ["$CreationDate", null] },
                ],
              },
              { $subtract: ["$CreationDate", "$CandidateLikeDate"] },
              null,
            ],
          },
          "1st to 2nd Column": {
            $cond: [
              { $ne: ["$lastSecondColumn", null] },
              { $subtract: ["$lastSecondColumn.ChangedAt", "$firstColumn.ChangedAt"] },
              null,
            ],
          },
          "1st to 3rd Column": {
            $cond: [
              { $ne: ["$lastThirdColumn", null] },
              { $subtract: ["$lastThirdColumn.ChangedAt", "$firstColumn.ChangedAt"] },
              null,
            ],
          },
          "1st to 4th Column": {
            $cond: [
              { $ne: ["$lastFourthColumn", null] },
              { $subtract: ["$lastFourthColumn.ChangedAt", "$firstColumn.ChangedAt"] },
              null,
            ],
          },
        },
      },
    },
    { $project: { durations: { $objectToArray: "$durations" } } },
    { $unwind: "$durations" },
    {
      $addFields: {
        "durations.v": {
          $cond: [{ $eq: ["$durations.v", null] }, 0, "$durations.v"],
        },
      },
    },
    {
      $group: {
        _id: "$durations.k",
        avgDurationMs: { $avg: "$durations.v" },
      },
    },
    {
      $project: {
        label: "$_id",
        value: {
          $round: [
            { $divide: ["$avgDurationMs", 1000 * 60 * 60] },
            2,
          ],
        },
        _id: 0,
      },
    },
    {
      $addFields: {
        sortIndex: {
          $switch: {
            branches: [
              { case: { $eq: ["$label", "From Platform to 1st Column"] }, then: 1 },
              { case: { $eq: ["$label", "1st to 2nd Column"] }, then: 2 },
              { case: { $eq: ["$label", "1st to 3rd Column"] }, then: 3 },
              { case: { $eq: ["$label", "1st to 4th Column"] }, then: 4 },
            ],
            default: 999,
          },
        },
      },
    },
    { $sort: { sortIndex: 1 } },
    { $project: { sortIndex: 0 } },
  ]);
}

async function getTotalFromPlatformToFirstColumn(from, to) {
  return CandidateNeedMatch.aggregate([
    {
      $match: {
        ListId: { $ne: null },
        CandidateLikeDate: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    },
    {
      $lookup: {
        from: "MatchLists",
        localField: "ListId",
        foreignField: "_id",
        as: "matchList",
      },
    },
    {
      $unwind: {
        path: "$matchList",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        CreationDate: "$matchList.CreationDate",
      },
    },
    {
      $match: {
        CandidateLikeDate: { $ne: null },
        CreationDate: { $ne: null },
      },
    },
    {
      $project: {
        durationMs: { $subtract: ["$CreationDate", "$CandidateLikeDate"] },
      },
    },
    {
      $group: {
        _id: null,
        totalDurationMs: { $sum: "$durationMs" },
      },
    },
    {
      $project: {
        _id: 0,
        value: {
          $round: [
            { $divide: ["$totalDurationMs", 1000 * 60 * 60] },
            2,
          ],

        },
      },
    },
  ]);
}


module.exports = { getAverageDurations, getTotalFromPlatformToFirstColumn };
