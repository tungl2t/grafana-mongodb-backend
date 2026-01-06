const pool = require("../postgresConnection");

async function getUsersByRoles() {
  const query = `
    SELECT 
      u."Id" AS id,
      CONCAT('[', r."Name", '] ', u."Name", ' ', u."Surname") AS name
    FROM "AspNetUsers" u
    INNER JOIN "AspNetUserRoles" ur ON u."Id" = ur."UserId"
    INNER JOIN "AspNetRoles" r ON ur."RoleId" = r."Id"
    WHERE r."Name" IN ('COMPANY', 'RECRUITER', 'ACCOUNTMANAGER')
      AND u."Name" IS NOT NULL 
      AND u."Name" != ''
    ORDER BY r."Name", u."Name", u."Surname"
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = { getUsersByRoles };

