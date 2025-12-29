import postgres from "postgres";

const url = "postgresql://postgres:Messe2552!!@db.rjqygtuntijzwnwsxzjk.supabase.co:5432/postgres?sslmode=require";

const sql = postgres(url, { ssl: "require" });

try {
  const result = await sql`SELECT 1 as ok`;
  console.log("OK:", result);
} catch (e) {
  console.error("FEHLER:", e.message);
} finally {
  await sql.end();
}