const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

app.use(cors({
  origin: "https://yawar-marka-web-61jx.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}))
app.use(express.json())

app.post("/api/users", (req, res) => {
  const { nombre, email, password, role } = req.body

  db.query(
    "INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ message: "usuario creado" })
    }
  )
})

app.listen(3000, () => {
  console.log("servidor en puerto 3000")
})
