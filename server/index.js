const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json()) 

app.post("/api/users", (req, res) => {

  console.log("body recibido:", req.body)

  const { nombre, email, password, role } = req.body

  db.query(
    "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role],
    (err, result) => {

      if (err) {
        console.log("Error insertando:", err)
        return res.status(500).json(err)
      }

      console.log(" Usuario insertado correctamente")
      res.json({ message: "Usuario creado" })
    }
  )
})


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "yawar"
})

db.connect(err => {
  if (err) {
    console.log("error conectando a mysql:", err)
  } else {
    console.log("conectado a mysql correctamente")
  }
})
