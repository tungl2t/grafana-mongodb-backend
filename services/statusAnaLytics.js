const CandidateNeedMatch = require("../models/candidateNeedMatch");

async function getAverageDurations() {
  return CandidateNeedMatch.aggregate([
    {$match: {StatusHistory: {$exists: true, $ne: []}}},

    {$project: {StatusHistory: 1}},
    {
      $addFields: {
        firstColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$StatusHistory",
                cond: {$eq: ["$$this.From", 0]},
              },
            },
            0,
          ],
        },
      },
    },
    {$match: {firstColumn: {$exists: true, $ne: null}}},
    {
      $addFields: {
        lastSecondColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: {$reverseArray: "$StatusHistory"},
                cond: {$eq: ["$$this.To", 2]},
              },
            },
            0,
          ],
        },
        lastThirdColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: {$reverseArray: "$StatusHistory"},
                cond: {$eq: ["$$this.To", 4]},
              },
            },
            0,
          ],
        },
        lastFourthColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: {$reverseArray: "$StatusHistory"},
                cond: {$eq: ["$$this.To", 5]},
              },
            },
            0,
          ],
        },
        lastFifthColumn: {
          $arrayElemAt: [
            {
              $filter: {
                input: {$reverseArray: "$StatusHistory"},
                cond: {$eq: ["$$this.To", 6]},
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
          "1st to 2nd Column": {
            $cond: [
              {$ne: ["$lastSecondColumn", null]},
              {
                $subtract: [
                  "$lastSecondColumn.ChangedAt",
                  "$firstColumn.ChangedAt",
                ],
              },
              null,
            ],
          },
          "1st to 3rd Column": {
            $cond: [
              {$ne: ["$lastThirdColumn", null]},
              {
                $subtract: [
                  "$lastThirdColumn.ChangedAt",
                  "$firstColumn.ChangedAt",
                ],
              },
              null,
            ],
          },
          "1st to 4th Column": {
            $cond: [
              {$ne: ["$lastFourthColumn", null]},
              {
                $subtract: [
                  "$lastFourthColumn.ChangedAt",
                  "$firstColumn.ChangedAt",
                ],
              },
              null,
            ],
          },
          "1st to 5th Column": {
            $cond: [
              {$ne: ["$lastFifthColumn", null]},
              {
                $subtract: [
                  "$lastFifthColumn.ChangedAt",
                  "$firstColumn.ChangedAt",
                ],
              },
              null,
            ],
          },
        },
      },
    },
    {
      $project: {
        durations: {$objectToArray: "$durations"},
      },
    },
    {$unwind: "$durations"},
    {$match: {"durations.v": {$ne: null}}},
    {
      $group: {
        _id: "$durations.k",
        avgDurationMs: {$avg: "$durations.v"},
      },
    },
    {
      $project: {
        label: "$_id",
        avgHours: {$divide: ["$avgDurationMs", 1000 * 60 * 60]},
        _id: 0,
      },
    },
  ]);
}

module.exports = {getAverageDurations};
