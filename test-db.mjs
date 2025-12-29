import postgres from "postgres";

const sql = postgres({
  host: "aws-1-us-east-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  username: "postgres.rjqygtuntijzwnwsxzjk",
  password: "Messe2552!!",
  ssl: "require",
});

try {
  const result = await sql`INSERT INTO orakel_users (email, password_hash) VALUES ('local-test@example.com', 'testhash') RETURNING id, email`;
  console.log("OK:", result);
} catch (e) {
  console.error("FEHLER:", e.message);
} finally {
  await sql.end();
}