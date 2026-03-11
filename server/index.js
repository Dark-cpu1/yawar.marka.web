const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://yawar-marka-web-61jx.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Error MySQL:", err.message);
  } else {
    console.log("✅ Conectado a MySQL exitosamente");
    connection.release(); 
  }
});

app.get("/", (req, res) => {
  res.send("API running");
});

app.post("/api/users", (req, res) => {
  console.log("body recibido:", req.body);
  const { nombre, email, password, role } = req.body;

  db.query(
    "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role],
    (err, result) => {
      if (err) {
        console.log("Error insertando:", err);
        return res.status(500).json(err);
      }
      console.log("Usuario insertado correctamente");
      res.json({ message: "Usuario creado" });
    }
  );
});

const PORT = process.env.PORT || 8080; 

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});