const pool = require("../postgresConnection");

async function countRegisteredUsers(startDate, endDate) {
  let query = `
    SELECT COUNT(*) AS total_users
    FROM "AspNetUsers"
    WHERE "CreateData" IS NOT NULL
      AND "EmailConfirmed" = TRUE
  `;
  const params = [];
  if (startDate && endDate) {
    params.push(startDate, endDate);
    query += ` AND "CreateData" BETWEEN $${params.length - 1} AND $${params.length}`;
  }

  const result = await pool.query(query, params);
  return Number(result.rows[0].total_users);
}

module.exports = { countRegisteredUsers };