import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// 🧠 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "CoreFit backend running successfully!" });
});

// 🧍 Registration
app.post("/api/register", async (req, res) => {
  const { name, email, phone, age, gender, weight, goal, domain, program, password } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, age, gender, weight, goal, domain, program, password)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, email, phone, age, gender, weight, goal, domain, program, password]
    );
    res.json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔑 Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1 AND password=$2`,
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ user: result.rows[0] });
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🌍 Export for Vercel
export default app;
