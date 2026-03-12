import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_API_URL

function Home() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [informes, setInformes] = useState<any[]>([])
  const [reacciones, setReacciones] = useState<any>({})
  const [comentarios, setComentarios] = useState<any>({})
  const [nuevoComentario, setNuevoComentario] = useState<any>({})
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null)
  
  // Obtener datos del usuario logueado
  const usuarioLogueado = JSON.parse(localStorage.getItem("user") || "{}")

  // 1. CARGAR USUARIOS
  const cargarUsuarios = () => {
    fetch(`${apiUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando usuarios:", err))
  }

  // 2. CARGAR INFORMES Y REACCIONES
  const cargarInformes = () => {
    fetch(`${apiUrl}/api/informes`)
      .then(res => res.json())
      .then(data => {
        setInformes(data)
        // Por cada informe, traer sus reacciones
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
      .catch(err => console.error("Error cargando informes:", err))
  }

  useEffect(() => {
    cargarUsuarios()
    cargarInformes()
  }, [])

  // 3. ACCIONES DE INFORMES
  const eliminarInforme = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este informe?")) return
    await fetch(`${apiUrl}/api/informes/${id}`, { method: "DELETE" })
    cargarInformes()
  }

  const reaccionar = async (informeId: number, tipo: string) => {
    if (!usuarioLogueado.id) return alert("Debes iniciar sesión")
    
    await fetch(`${apiUrl}/api/reacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ informe_id: informeId, usuario_id: usuarioLogueado.id, tipo })
    })
    cargarInformes() // Recargar para ver el contador actualizado
  }

  // 4. COMENTARIOS
  const cargarComentarios = (informeId: number) => {
    fetch(`${apiUrl}/api/comentarios/${informeId}`)
      .then(res => res.json())
      .then(data => {
        setComentarios((prev: any) => ({ ...prev, [informeId]: data }))
      })
  }

  const enviarComentario = async (informeId: number) => {
    if (!usuarioLogueado.id) return alert("Debes iniciar sesión")
    if (!nuevoComentario[informeId]?.trim()) return

    await fetch(`${apiUrl}/api/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        informe_id: informeId,
        usuario_id: usuarioLogueado.id,
        comentario: nuevoComentario[informeId]
      })
    })

    setNuevoComentario((prev: any) => ({ ...prev, [informeId]: "" }))
    cargarComentarios(informeId)
  }

  // 5. GESTIÓN DE USUARIOS (ADMIN)
  const eliminarUsuario = (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return
    fetch(`${apiUrl}/api/users/${id}`, { method: "DELETE" })
      .then(() => cargarUsuarios())
  }

  const cambiarRol = (id: number, nuevoRol: string) => {
    fetch(`${apiUrl}/api/users/${id}/rol`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol: nuevoRol })
    }).then(() => {
      setMenuAbierto(null)
      cargarUsuarios()
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* SIDEBAR: INTEGRANTES */}
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="font-bold mb-4 text-xl">Integrantes ({usuarios.length})</h2>
        {usuarios.map((user) => (
          <div key={user.id} className="bg-gray-700 p-3 rounded mb-2 flex justify-between items-center relative">
            <div>
              <p className="font-medium">{user.nombre}</p>
              <p className="text-xs text-blue-400 uppercase">{user.rol}</p>
            </div>
            {usuarioLogueado.rol === "admin" && (
              <div className="relative">
                <button onClick={() => setMenuAbierto(menuAbierto === user.id ? null : user.id)} className="px-2">⋮</button>
                {menuAbierto === user.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-xl z-50 overflow-hidden">
                    <button onClick={() => cambiarRol(user.id, "admin")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Hacer Admin</button>
                    <button onClick={() => cambiarRol(user.id, "user")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Quitar Admin</button>
                    <button onClick={() => eliminarUsuario(user.id)} className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white">Eliminar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL: INFORMES */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-black mb-8">Informes Publicados</h1>
        <div className="max-w-4xl">
          {informes.map((informe) => (
            <div key={informe.id} className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-blue-300">{informe.titulo}</h2>
                {usuarioLogueado.rol === "admin" && (
                  <button onClick={() => eliminarInforme(informe.id)} className="bg-red-600/20 text-red-500 border border-red-500/50 px-4 py-1 rounded-lg hover:bg-red-600 hover:text-white transition">
                    Eliminar
                  </button>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">{informe.contenido}</p>

              {informe.archivo && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-700">
                  {informe.archivo.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={`${apiUrl}/uploads/${informe.archivo}`} className="w-full max-h-[500px] object-cover" alt="Informe" />
                  ) : (
                    <video controls className="w-full"><source src={`${apiUrl}/uploads/${informe.archivo}`} /></video>
                  )}
                </div>
              )}

              <span className="text-xs text-gray-500 block mt-4 italic">
                Publicado el {new Date(informe.fecha).toLocaleString()}
              </span>

              {/* REACCIONES */}
              <div className="flex items-center gap-4 mt-6 border-t border-gray-700 pt-4">
                {['like', 'corazon', 'risa', 'dislike', 'triste'].map((tipo) => (
                  <button key={tipo} onClick={() => reaccionar(informe.id, tipo)} className="bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600 transition">
                    {{like: '👍', corazon: '❤️', risa: '😂', dislike: '👎', triste: '😢'}[tipo]} 
                    <span className="ml-1 font-bold">{reacciones[informe.id]?.[tipo] || 0}</span>
                  </button>
                ))}
              </div>

              {/* COMENTARIOS */}
              <div className="mt-6 bg-gray-900/50 p-4 rounded-xl">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario[informe.id] || ""}
                    onChange={(e) => setNuevoComentario({...nuevoComentario, [informe.id]: e.target.value})}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button onClick={() => enviarComentario(informe.id)} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Enviar</button>
                </div>

                <button onClick={() => cargarComentarios(informe.id)} className="text-blue-400 text-sm hover:underline mb-4">
                  Ver comentarios ({comentarios[informe.id]?.length || 0})
                </button>

                <div className="space-y-3">
                  {comentarios[informe.id]?.map((c: any) => (
                    <div key={c.id} className="bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500">
                      <p className="text-blue-300 font-bold text-sm">{c.nombre}</p>
                      <p className="text-gray-200">{c.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home