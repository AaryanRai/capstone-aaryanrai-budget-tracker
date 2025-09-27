const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
console.log("✅ Backend starting...");
app.use(cors());
app.use(express.json());

// Connect DB
const db = new sqlite3.Database("./budget.db", (err) => {
  if (err) console.error(err.message);
  console.log("✅ Connected to SQLite DB.");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    category TEXT,
    amount REAL,
    date TEXT,
    note TEXT
  )
`, () => {
  console.log("✅ Table ready (transactions).");
});

// Routes
app.get("/transactions", (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/transactions", (req, res) => {
  const { type, category, amount, date, note } = req.body;
  db.run(
    `INSERT INTO transactions (type, category, amount, date, note) VALUES (?,?,?,?,?)`,
    [type, category, amount, date, note],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/transactions/:id", (req, res) => {
  db.run(`DELETE FROM transactions WHERE id=?`, req.params.id, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

// Start server
const PORT = 4000;
app.get("/", (req, res) => {
    res.send("Hello from Budget Tracker API 🚀");
  });
  
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
