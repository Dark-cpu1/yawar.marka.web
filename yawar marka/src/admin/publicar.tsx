import { useState } from "react"
const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)

function Publicar() {
  const [mensaje, setMensaje] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const publicar = async () => {
    await fetch(`yawarmarkaweb-production-78a9.up.railway.app/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje, videoUrl })
    })

    alert("Publicado correctamente")
    setMensaje("")
    setVideoUrl("")
  }

  return (
    <div>
      <h2>Publicar</h2>

      <textarea
        placeholder="Escribe un mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />

      <input
        type="text"
        placeholder="URL del video"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <button onClick={publicar}>
        Publicar
      </button>
    </div>
  )
}

export default Publicar
