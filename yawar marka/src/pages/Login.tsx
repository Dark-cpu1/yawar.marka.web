import { useState } from "react"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

  const response = await fetch("yawarmarkaweb-production-78a9.up.railway.app/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (response.ok) {

    localStorage.setItem("user", JSON.stringify(data.user))

    alert("Bienvenido ")

    window.location.href = "/"

  } else {
    alert(data.message)
  }
}
const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)
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
