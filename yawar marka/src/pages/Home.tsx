import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_API_URL || "https://yawarmarkaweb-production-1701.up.railway.app";

function Home() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [informes, setInformes] = useState<any[]>([])
  const [reacciones, setReacciones] = useState<any>({})
  const [comentarios, setComentarios] = useState<any>({})
  const [nuevoComentario, setNuevoComentario] = useState<any>({})
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null)
  const usuario = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    fetch(`${apiUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsuarios(data))
  }, [])

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = () => {
    fetch(`${apiUrl}/api/informes`)
      .then(res => res.json())
      .then(data => setInformes(data))
  };

  const eliminarInforme = async (id: number) => {
    await fetch(`${apiUrl}/api/informes/${id}`, {
      method: "DELETE"
    });
    cargarInformes();
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/informes`)
      .then(res => res.json())
      .then(data => {
        setInformes(data)
        data.forEach((inf: any) => {
          fetch(`${apiUrl}/api/reacciones/${inf.id}`)
            .then(res => res.json())
            .then(r => {
              setReacciones((prev: any) => ({
                ...prev,
                [inf.id]: r.reduce((acc: any, item: any) => {
                  acc[item.tipo] = item.total
                  return acc
                }, {})
              }))
            })
        })
      })
  }, [])

  const reaccionar = async (informeId: number, tipo: string) => {
    await fetch(`${apiUrl}/api/reacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ informe_id: informeId, tipo })
    })

    setReacciones((prev: any) => ({
      ...prev,
      [informeId]: {
        ...prev[informeId],
        [tipo]: (prev[informeId]?.[tipo] || 0) + 1
      }
    }))
  }

  const cargarComentarios = (informeId: number) => {
    fetch(`${apiUrl}/api/comentarios/${informeId}`)
      .then(res => res.json())
      .then(data => {
        setComentarios((prev: any) => ({
          ...prev,
          [informeId]: data
        }))
      })
  }

  const enviarComentario = async (informeId: number) => {
    if (!usuario) {
      alert("Debes iniciar sesión")
      return
    }
    if (!nuevoComentario[informeId]?.trim()) return

    await fetch(`${apiUrl}/api/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        informe_id: informeId,
        usuario_id: usuario.id,
        comentario: nuevoComentario[informeId]
      })
    })

    setNuevoComentario((prev: any) => ({
      ...prev,
      [informeId]: ""
    }))
    cargarComentarios(informeId)
  }

  const usuarioLogueado = JSON.parse(localStorage.getItem("user") || "{}")

  const eliminarUsuario = (id: number) => {
    fetch(`${apiUrl}/api/users/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setUsuarios(usuarios.filter(u => u.id !== id))
      })
  }

  const cambiarRol = (id: number, nuevoRol: string) => {
    fetch(`${apiUrl}/api/users/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ rol: nuevoRol })
    })
      .then(() => {
        setUsuarios(usuarios.map(u =>
          u.id === id ? { ...u, rol: nuevoRol } : u
        ))
      })
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-white font-bold mb-4">Integrantes ({usuarios.length})</h2>
        {usuarios.map((user) => (
          <div key={user.id} className="bg-gray-700 p-3 rounded mb-2 text-white flex justify-between items-center relative">
            <div>
              <p>{user.nombre}</p>
              <p className="text-xs text-gray-300">{user.rol}</p>
            </div>
            {usuarioLogueado.rol === "admin" && (
              <div className="relative">
                <button onClick={() => setMenuAbierto(menuAbierto === user.id ? null : user.id)} className="text-xl">⋮</button>
                {menuAbierto === user.id && (
                  <div className="absolute -right-6 mt-2 bg-gray-800 rounded shadow-lg text-sm z-50">
                    <button onClick={() => cambiarRol(user.id, "admin")} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Hacer Admin</button>
                    <button onClick={() => cambiarRol(user.id, "user")} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Quitar Admin</button>
                    <button onClick={() => eliminarUsuario(user.id)} className="block w-full text-left px-4 py-2 hover:bg-red-600">Eliminar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 p-10 text-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Informes publicados</h1>
        {informes.map((informe) => (
          <div key={informe.id} className="bg-gray-800 p-4 rounded mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex-1">{informe.titulo}</h2>
              {usuario?.rol?.trim().toLowerCase() === "admin" && (
                <button onClick={() => eliminarInforme(informe.id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 whitespace-nowrap">Eliminar</button>
              )}
            </div>
            <p className="text-gray-300 mt-2">{informe.contenido}</p>
            {informe.archivo && (
              <div className="mt-4">
                {informe.archivo.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img src={`${apiUrl}/uploads/${informe.archivo}`} className="w-96 rounded" />
                ) : (
                  <video controls className="w-96 rounded">
                    <source src={`${apiUrl}/uploads/${informe.archivo}`} />
                  </video>
                )}
              </div>
            )}
            <span className="text-xs text-gray-500 block mt-3">{new Date(informe.fecha).toLocaleString()}</span>
            <div className="flex items-center gap-6 mt-4 text-lg border-t border-gray-700 pt-3">
              <button onClick={() => reaccionar(informe.id, "like")} className="hover:scale-110 transition">👍 {reacciones[informe.id]?.like || 0}</button>
              <button onClick={() => reaccionar(informe.id, "corazon")} className="hover:scale-110 transition">❤️ {reacciones[informe.id]?.corazon || 0}</button>
              <button onClick={() => reaccionar(informe.id, "risa")} className="hover:scale-110 transition">😂 {reacciones[informe.id]?.risa || 0}</button>
              <button onClick={() => reaccionar(informe.id, "dislike")} className="hover:scale-110 transition">👎 {reacciones[informe.id]?.dislike || 0}</button>
              <button onClick={() => reaccionar(informe.id, "triste")} className="hover:scale-110 transition">😢 {reacciones[informe.id]?.triste || 0}</button>
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="text-sm text-gray-400 mb-2">Comentarios</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={nuevoComentario[informe.id] || ""}
                  onChange={(e) => setNuevoComentario((prev: any) => ({ ...prev, [informe.id]: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button onClick={() => enviarComentario(informe.id)} className="bg-blue-600 px-3 rounded hover:bg-blue-700 transition">Enviar</button>
              </div>
              <button onClick={() => cargarComentarios(informe.id)} className="text-blue-400 text-sm mt-2 hover:underline">Ver comentarios</button>
              <div className="mt-3 space-y-2">
                {comentarios[informe.id]?.map((c: any) => (
                  <div key={c.id} className="bg-gray-700 p-2 rounded">
                    <strong>{c.nombre}</strong>
                    <p>{c.comentario}</p>
                    <small className="text-gray-400">{new Date(c.fecha).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home