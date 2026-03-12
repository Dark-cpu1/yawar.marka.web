import { useState } from "react"
import { apiService } from "../services/api"
import { useNavigate } from "react-router-dom" 

function Register() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate() 

  const handleRegister = async () => {
    const emailLimpio = email.trim()
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/

    if (!regex.test(emailLimpio)) {
      alert("Error de registro: usa un correo válido (ejemplo: usuario@gmail.com)")
      return
    }

    if (!nombre || !password) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const data = await apiService.register(nombre, emailLimpio, password)

      if (data && (data.id || data.user)) {
        alert("¡Cuenta creada con éxito! Entrando...")

        const datosUsuario = data.user ? data.user : data
        localStorage.setItem("user", JSON.stringify(datosUsuario))

        navigate("/")

        window.location.reload()
      } else {
        alert(data.message || "No se pudo crear la cuenta")
      }

    } catch (error) {
      console.error("Error en registro:", error)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-80 shadow-2xl">
        <h2 className="text-white text-xl mb-6 text-center font-bold">Registro</h2>

        <input
          placeholder="Nombre"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white outline-none border border-transparent focus:border-green-500"
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white outline-none border border-transparent focus:border-green-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 rounded bg-gray-700 text-white outline-none border border-transparent focus:border-green-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 transition-colors p-2 rounded text-white font-bold"
        >
          Crear cuenta
        </button>
        
        <p className="text-gray-400 text-xs mt-4 text-center">
          Al registrarte, entrarás automáticamente a tu nueva cuenta.
        </p>
      </div>
    </div>
  )
}

export default Register