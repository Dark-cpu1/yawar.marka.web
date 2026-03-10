const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://yawar-marka-web-61jx.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend funcionando ")
})

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}


app.use("/uploads", express.static("uploads"))


require("dotenv").config()


const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
})

db.connect((err) => {
  if (err) {
    console.log("Error MySQL:", err)
  } else {
    console.log("Conectado a MySQL")
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT)
})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true)
  } else {
    cb(new Error("Solo imágenes o videos"), false)
  }
}

const upload = multer({ storage, fileFilter })


app.post("/api/register", (req, res) => {
  const { nombre, email, password } = req.body

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Error del servidor" })
      }

      if (result.length > 0) {
        return res.json({ message: "Este correo ya está registrado" })
      }

      db.query(
        "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, 'integrante')",
        [nombre, email, password],
        (err2) => {
          if (err2) {
            return res.status(500).json({ message: "Error al registrar" })
          }

          res.json({ message: "Usuario registrado" })

          //fetch('https://yawarmarkaweb-production-78a9.up.railway.app')
            //.then(response => console.log('Respuesta de Vercel en register:', response.status))
            //.catch(error => console.log('Error llamando a Vercel en register:', error))
        }
      )
    }
  )
})


app.post("/api/login", (req, res) => {
  const { email, password } = req.body

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err)
      if (result.length === 0)
        return res.status(401).json({ message: "Usuario no existe" })

      const user = result[0]

      if (user.password !== password)
        return res.status(401).json({ message: "Contraseña incorrecta" })

      res.json({
        message: "Login correcto ",
        user: {
          id: user.id,
          nombre: user.nombre,
          rol: user.rol
        }
      })
    }
  )
})


app.get("/api/users", (req, res) => {
  db.query("SELECT id, nombre, rol FROM users", (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})


app.post("/api/users", async (req, res) => {

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

      //fetch('https://yawarmarkaweb-production-78a9.up.railway.app')
        //.then(response => console.log('Respuesta de Vercel en users:', response.status))
        //.catch(error => console.log('Error llamando a Vercel en users:', error))
    }
  )
})


app.post("/api/informes", upload.single("archivo"), (req, res) => {

  const { titulo, contenido } = req.body
  const archivo = req.file ? req.file.filename : null

  if (!titulo || !contenido)
    return res.status(400).json({ message: "Faltan datos" })

  db.query(
    "INSERT INTO informes (titulo, contenido, archivo) VALUES (?, ?, ?)",
    [titulo, contenido, archivo],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ message: "Informe publicado " })

      //fetch('https://yawarmarkaweb-production-78a9.up.railway.app')
        //.then(response => console.log('Respuesta de Vercel en informes:', response.status))
        //.catch(error => console.log('Error llamando a Vercel en informes:', error))
    }
  )
})


app.get("/api/informes", (req, res) => {
  db.query(
    "SELECT * FROM informes ORDER BY fecha DESC",
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json(result)
    }
  )
})




app.post("/api/comentarios", (req, res) => {
  const { informe_id, usuario_id, comentario } = req.body

  if (!informe_id || !usuario_id || !comentario) {
    return res.status(400).json({ message: "Datos incompletos" })
  }

  const sql = `
    INSERT INTO comentarios (informe_id, usuario_id, comentario)
    VALUES (?, ?, ?)
  `

  db.query(sql, [informe_id, usuario_id, comentario], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: "Comentario guardado 💬" })
  })
})


app.get("/api/comentarios/:informe_id", (req, res) => {

  const sql = `
    SELECT comentarios.*, users.nombre
    FROM comentarios
    JOIN users ON comentarios.usuario_id = users.id
    WHERE informe_id = ?
    ORDER BY fecha DESC
  `

  db.query(sql, [req.params.informe_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }
    res.json(results)
  })
})

app.post("/api/reaccion", (req, res) => {

  const { informe_id, tipo } = req.body

  if (!informe_id || !tipo) {
    return res.status(400).json({ message: "Datos incompletos" })
  }

  const sql = `
    INSERT INTO reacciones (informe_id, tipo)
    VALUES (?, ?)
  `

  db.query(sql, [informe_id, tipo], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: "reacción guardada" })
  })
})



app.get("/api/reacciones/:informe_id", (req, res) => {

  const sql = `
    SELECT tipo, COUNT(*) as total
    FROM reacciones
    WHERE informe_id = ?
    GROUP BY tipo
  `

  db.query(sql, [req.params.informe_id], (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})

app.put("/api/informes/cerrar/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE informes SET estado = 'cerrado' WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Informe cerrado " });
    }
  );
});

app.delete("/api/informes/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM informes WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Informe eliminado" });
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err)

    res.json({ message: "Usuario eliminado" })
  })
})

app.put("/api/users/:id/rol", (req, res) => {

  const { id } = req.params
  const { rol } = req.body

  db.query(
    "UPDATE users SET rol = ? WHERE id = ?",
    [rol, id],
    (err) => {

      if (err) return res.status(500).json(err)

      res.json({ message: "Rol actualizado" })
    }
  )
})