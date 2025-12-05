const EntityDocuments = require("../models/entityDocument");

async function countCV(from, to) {
  const pipeline = [
    {
      $match: { DocumentType: 0 }
    },
    {
      $addFields: {
        rawTicks: { $arrayElemAt: ["$LastModified", 0] }
      }
    },
    {
      $addFields: {
        lastModifiedTicks: {
          $cond: [
            { $isNumber: "$rawTicks" },
            { $toLong: "$rawTicks" },
            null
          ]
        }
      }
    },
    {
      $addFields: {
        lastModifiedDate: {
          $cond: [
            { $ne: ["$lastModifiedTicks", null] },
            {
              $toDate: {
                $divide: [
                  { $subtract: ["$lastModifiedTicks", 621355968000000000] },
                  10000
                ]
              }
            },
            null
          ]
        }
      }
    }
  ];

  if (from && to) {
    pipeline.push({
      $match: {
        lastModifiedDate: {
          $gte: new Date(from),
          $lte: new Date(to)
        }
      }
    });
  }

  pipeline.push({ $count: "total" });

  const result = await EntityDocuments.aggregate(pipeline);
  return result.length ? result[0].total : 0;
}





module.exports = { countCV };