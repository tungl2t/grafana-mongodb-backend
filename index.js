require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const {getAverageDurations} = require("./services/statusAnaLytics");
const Candidate = require("./models/candidate");
const Need = require("./models/need");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());
app.get('/', (req, res) => {
  console.log('GET /: Connection test successful.');
  res.status(200).send('OK');
});


app.post('/query', async (req, res) => {

  try {
    const {targets} = req.body;
    const now = Date.now();
    let results = [];
    for (const t of targets) {
      switch (t.target) {
        case "avg_status_duration":
          const durations = await getAverageDurations();
          results.push(...durations.map(d => ({
            label: d.label,
            value: d.avgHours,
          })));
          break;
        case "candidate_from_platform":
          const count = await Candidate.countDocuments({
            Platform: {$exists: true, $eq: "jobs.matchguru.it"}
          });
          results.push({
            value: count
          });
          break;
        case "need_count":
          const needCount = await Need.countDocuments({
            Active: true, Status: {$in: [1, 2]}
          });
          results.push({
            value: needCount
          });
          break;
        case "total_candidates":
          const totalCandidates = await Candidate.countDocuments({});
          results.push({
            value: totalCandidates
          });
          break;
      }
    }
    res.json(results);

  } catch (error) {
    console.error("Error running aggregation:", error);
    res.status(500).json({error: error.message});
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});