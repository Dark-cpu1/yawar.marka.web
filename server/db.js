const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db"); // Importamos la conexión desde db.js
require("dotenv").config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://yawar-marka-web-61jx.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Carpeta de archivos
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static("uploads"));

// Multer para imágenes/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- RUTAS ---

app.get("/", (req, res) => res.send("Backend de Yawar Marka funcionando 🚀"));

// Registro de usuarios
app.post("/api/register", (req, res) => {
  const { nombre, email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length > 0) return res.status(400).json({ message: "El correo ya existe" });

    db.query(
      "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, 'integrante')",
      [nombre, email, password],
      (err2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "Usuario registrado" });
      }
    );
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    const user = result[0];
    res.json({ message: "Login correcto", user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  });
});

// Informes con archivo
app.post("/api/informes", upload.single("archivo"), (req, res) => {
  const { titulo, contenido } = req.body;
  const archivo = req.file ? req.file.filename : null;
  db.query(
    "INSERT INTO informes (titulo, contenido, archivo) VALUES (?, ?, ?)",
    [titulo, contenido, archivo],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Informe publicado" });
    }
  );
});

app.get("/api/informes", (req, res) => {
  db.query("SELECT * FROM informes ORDER BY fecha DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});