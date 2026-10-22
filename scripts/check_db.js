
const { neon } = require('@neondatabase/serverless');

async function checkDB() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const stats = await sql`SELECT * FROM cms_stats`;
    if (stats.length > 0) {
      console.log("SUCCESS! Found", stats.length, "stats in the live DB.");
    } else {
      console.log("DB is connected but empty. The live site hasn't been visited yet.");
    }
  } catch (e) {
    console.error("Database connection failed:", e.message);
  }
}

checkDB();
