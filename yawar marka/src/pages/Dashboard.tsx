import { useEffect, useState } from "react"

function Dashboard() {

  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(data => {
        console.log("Usuarios:", data)
        setUsuarios(data)
      })
      .catch(error => console.error("Error:", error))
  }, [])
  const apiUrl = import.meta.env.VITE_API_URL
  console.log(apiUrl)
  return (
    <div className="flex min-h-screen bg-gray-900">

      <div className="w-64 bg-gray-800 p-4">

        <h2 className="text-white font-bold mb-4">
          Integrantes ({usuarios.length})
        </h2>

        {usuarios.map((user) => (
  <div
    key={user.id}
    className="flex items-center justify-between bg-gray-700 p-2 rounded mb-2 text-white"
  >
    <span>{user.nombre}</span>

    {user.rol === "admin" ? (
            <span className="text-xs bg-red-600 px-2 py-1 rounded">
              ADMIN
            </span>
          ) : (
            <span className="text-xs bg-gray-600 px-2 py-1 rounded">
              INTEGRANTE
            </span>
          )}
        </div>
      ))}
      </div>

      <div className="flex-1 flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Dashboard 
        </h1>
      </div>
    </div>
  )
}

export default Dashboard
