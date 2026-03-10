import { useState } from "react"
import { apiService } from "../services/api"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const data = await apiService.login(email, password)
    if (data.user) {

    localStorage.setItem("user", JSON.stringify(data.user))

    alert("Bienvenido ")

    window.location.href = "/"

  } else {
    alert(data.message)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-80">

        <h2 className="text-white text-xl mb-4 text-center">Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 p-2 rounded text-white"
        >
          Entrar
        </button>

      </div>
    </div>
  )
}

export default Login
