const { neon } = require('@neondatabase/serverless');

async function updateStats() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      UPDATE cms_stats 
      SET label = 'Senior automation team members' 
      WHERE label = 'Expert Engineers'
    `;
    
    await sql`
      UPDATE cms_stats 
      SET value = 9, label = 'experience' 
      WHERE label = 'Years Experience'
    `;
    console.log("Stats updated successfully.");
  } catch(e) {
    console.error("Failed to update stats:", e);
  }
}

updateStats();
