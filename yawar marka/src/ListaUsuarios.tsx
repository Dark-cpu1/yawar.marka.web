import { useEffect, useState } from "react"

function ListaUsuarios() {

  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(data => setUsuarios(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <h2 className="text-white text-2xl mb-6">Integrantes Registrados</h2>

      <div className="bg-gray-800 rounded-xl p-6">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className="border-b border-gray-700 py-3 text-white"
          >
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaUsuarios
