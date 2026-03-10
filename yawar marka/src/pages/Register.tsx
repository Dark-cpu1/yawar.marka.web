import { useState } from "react"
const apiUrl = import.meta.env.VITE_API_URL

function Register() {

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

const handleRegister = async () => {

  const emailLimpio = email.trim()

  const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/

  if (!regex.test(emailLimpio)) {
    alert("error de registro = ejemplo: XXXXXXXXX@gmail.com")
    return
  }

  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, email: emailLimpio, password })
    })

    const data = await response.json()
    alert(data.message)

  } catch (error) {
    alert("Error de conexión con el servidor")
  }
}
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      
      <div className="bg-gray-800 p-8 rounded-xl w-80">

        <h2 className="text-white text-xl mb-4 text-center">Registro</h2>

        <input
          placeholder="Nombre"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          onChange={(e) => setNombre(e.target.value)}
        />

        <div className="flex mb-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 p-2 rounded text-white"
        >
          Crear cuenta
        </button>

      </div>
    </div>
  )
}

export default Register
