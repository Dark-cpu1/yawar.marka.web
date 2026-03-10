import { useState } from "react"

function AdminPanel() {

  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const publicar = async () => {

    const formData = new FormData()
    formData.append("titulo", titulo)
    formData.append("contenido", contenido)

    if (archivo) formData.append("archivo", archivo)

    const res = await fetch(`yawarmarkaweb-production-78a9.up.railway.app/api/informes`, {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      alert("Publicado ")
      setTitulo("")
      setContenido("")
      setArchivo(null)
      setPreview(null)
    }
  }
  const apiUrl = import.meta.env.VITE_API_URL
  console.log(apiUrl)

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">

      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded"
      />

      <textarea
        placeholder="Contenido"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          if (e.target.files) {
            const file = e.target.files[0]
            setArchivo(file)
            setPreview(URL.createObjectURL(file))
          }
        }}
      />

      {preview && (
        archivo?.type.startsWith("image/") ?
          <img src={preview} className="w-60 mt-4 rounded" /> :
          <video src={preview} controls className="w-60 mt-4 rounded" />
      )}

      <button
        onClick={publicar}
        className="bg-indigo-600 px-4 py-2 mt-4 rounded"
      >
        Publicar
      </button>

    </div>
  )
}

export default AdminPanel
