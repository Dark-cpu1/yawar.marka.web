import { useState } from "react"
import { apiService } from "../services/api" 

function AdminPanel() {
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const publicar = async () => {
    if (!titulo || !contenido) return alert("Llena los campos obligatorios");

    const formData = new FormData()
    formData.append("titulo", titulo)
    formData.append("contenido", contenido)

    if (archivo) formData.append("archivo", archivo)

    try {
      const res = await apiService.createInforme(formData)

      if (res) {
        alert("¡Informe publicado con éxito!")
        setTitulo("")
        setContenido("")
        setArchivo(null)
        setPreview(null)
      }
    } catch (error) {
      console.error("Error al publicar:", error)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 outline-none"
      />

      <textarea
        placeholder="Contenido"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded border border-gray-700 h-32 focus:border-indigo-500 outline-none"
      />

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Subir imagen o video:</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0]
              setArchivo(file)
              setPreview(URL.createObjectURL(file))
            }
          }}
          className="text-sm text-gray-400"
        />
      </div>

      {preview && (
        <div className="mt-4">
          {archivo?.type.startsWith("image/") ? (
            <img src={preview} className="w-60 rounded border border-gray-700" alt="Preview" />
          ) : (
            <video src={preview} controls className="w-60 rounded border border-gray-700" />
          )}
        </div>
      )}

      <button
        onClick={publicar}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 mt-6 rounded font-bold transition-all"
      >
        Publicar Informe
      </button>
    </div>
  )
}

export default AdminPanel