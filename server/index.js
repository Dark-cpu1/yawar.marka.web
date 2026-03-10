const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json()) 


app.post("/api/users", async (req, res) => {

  console.log("body recibido:", req.body)

  const { nombre, email, password, role } = req.body

  db.query(
    "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role],
    async (err, result) => {

      if (err) {
        console.log("Error insertando:", err)
        return res.status(500).json(err)
      }

      console.log(" Usuario insertado correctamente")
      res.json({ message: "Usuario creado" })

      // Llamar a la URL de Vercel
      try {
        const response = await fetch('https://yawarmarkaweb-production-78a9.up.railway.app');
        console.log('Respuesta de Vercel:', response.status);
      } catch (error) {
        console.log('Error llamando a Vercel:', error);
      }
    }
  )
})


require("dotenv").config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

db.connect((err) => {
  if (err) {
    console.log("Error MySQL:", err)
  } else {
    console.log("Conectado a MySQL")
  }
})

app.listen(5000, () => {
  console.log("Servidor corriendo en puerto 5000")
})