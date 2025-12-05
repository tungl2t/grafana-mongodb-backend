require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { getAverageDurations, getTotalFromPlatformToFirstColumn } = require("./services/statusAnaLytics");
const { getNumberOfCandidatesByStage } = require("./services/candidateByStage");
const { countRegisteredUsers } = require("./services/countRegisteredUsers");
const { countCV } = require("./services/entityDocumentService");
const { getAllRecruiters } = require("./services/organizationService");
const { getMatchListByRecruiter } = require("./services/matchListService");
const Candidate = require("./models/candidate");
const Need = require("./models/need");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.use(cors({
  origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(express.json());
app.get("/", (req, res) => {
  console.log("GET /: Connection test successful.");
  res.status(200).send("OK");
});

app.post("/query", async (req, res) => {
  try {
    console.log(req.body);
    const { targets, from, to } = req.body;
    let results = [];
    for (const t of targets) {
      switch (t.target) {
        case "avg_status_duration":
          const durations = await getAverageDurations(from, to);
          results.push(...durations);
          break;
        case "candidate_from_platform":
          const count = await Candidate.countDocuments({
            Platform: { $exists: true, $eq: "jobs.matchguru.it" },
            RegistrationDate: { $gte: new Date(from), $lte: new Date(to) },
          });
          results.push({
            value: count,
          });
          break;
        case "need_count":
          const needCount = await Need.countDocuments({
            Active: true, Status: { $in: [1, 2] },
            CreationDate: { $gte: new Date(from), $lte: new Date(to) },
          });
          results.push({
            value: needCount,
          });
          break;
        case "total_candidates":
          const totalCandidates = await Candidate.countDocuments({
            RegistrationDate: { $gte: new Date(from), $lte: new Date(to) },
          });
          results.push({
            value: totalCandidates,
          });
          break;
        case "candidates_by_stage":
          const numberOfCandidatesByStage = await getNumberOfCandidatesByStage(from, to);
          results.push(...numberOfCandidatesByStage);
          break;
        case "time_to_first_shortlist":
          const totalTime = await getTotalFromPlatformToFirstColumn(from, to);
          results.push(totalTime);
          break;
        case "number_of_registered_user":
          const totalRegisteredUsers = await countRegisteredUsers(from, to);
          results.push({
            value: totalRegisteredUsers,
          });
          break;

        case "number_of_uploaded_cv":
          const totalCV = await countCV(from, to);
          results.push({
            value: totalCV,
          });
          break;
        case "candidates_by_recruiter":
          const cbr = await getMatchListByRecruiter(req.body.recruiters, from, to);
          results.push(...cbr);
          break;
      }
    }
    res.json(results);

  } catch (error) {
    console.error("Error running aggregation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/recruiters", async (req, res) => {
  const result = await getAllRecruiters();
  res.json(result);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});