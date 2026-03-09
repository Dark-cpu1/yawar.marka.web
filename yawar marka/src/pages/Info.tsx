function Info() {
  const apiUrl = import.meta.env.VITE_API_URL
  console.log(apiUrl)
  return (
    <div className="min-h-screen flex items-center justify-center  from-purple-900 via-gray-900 to-black text-white p-6">
      
      <div className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl max-w-lg shadow-2xl border border-purple-500">
        
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">
          💃🔥 ¡Vive la Magia de la Danza! 🔥🕺
        </h2>

        <p className="mb-4 text-gray-200 text-center">
          🎭 Somos un elenco de danza apasionado por el arte, la cultura y la tradición.
        </p>

        <p className="mb-6 text-center text-yellow-400 font-semibold">
          Si amas bailar, usar disfraces típicos y sentir la emoción del escenario… ¡este es tu lugar!
        </p>

        <div className="space-y-3 text-gray-100">
          <p>✨ En nuestro elenco encontrarás:</p>
          <p>💃 Bailes tradicionales y folclóricos</p>
          <p>🕺 Danzas modernas y coreografías creativas</p>
          <p>👘 Vestuarios típicos llenos de color y cultura</p>
          <p>🎉 Presentaciones en eventos, festivales y celebraciones</p>
        </div>

        <p className="mt-6 text-center text-green-400 font-bold">
          No importa si eres principiante o ya tienes experiencia…
        </p>

        <p className="text-center text-xl mt-2 text-blue-400 mb-6">
          👉 ¡Aquí todos pueden brillar!
        </p>

        {/* 📍 Google Maps */}
        <div className="mt-6">
          <h3 className="text-center text-lg font-semibold text-pink-400 mb-3">
            📍 Nuestra Ubicación
          </h3>

          <iframe
            title="Yawar Marcka Tocache"
            src="https://www.google.com/maps?q=Yawar+Marcka+Tocache,+Jirón+Esteban+Delgado,+Tocache+22540&output=embed"
            className="w-full h-64 rounded-xl border border-purple-500"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  )
}

export default Info
