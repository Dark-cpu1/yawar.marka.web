import logo from "../assets/Yawar-Marka.jpg"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


function Header() {
const apiUrl = import.meta.env.VITE_API_URL
  const usuarioLogueado = JSON.parse(localStorage.getItem("user") || "null")

  const navigate = useNavigate()


  const cerrarSesion = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <header className="bg-gray-950 flex items-center justify-between px-8 py-4">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition"
        >
          <img src={logo} className="w-12 h-12 rounded-xl" />
          <h1 className="text-white font-bold">
            Yawar Marka
          </h1>
      </div>

      <div className="space-x-4">
              <button
            onClick={() => navigate("/info")}
            className="
              bg-blue-600
              px-3
              py-1
              text-sm
              rounded-lg
              text-white
              hover:bg-blue-700
              transition
            "
          >
            Info
          </button>
        {!usuarioLogueado && (
          <>
            <Link to="/login" className="text-white">
              Login
            </Link>

            <Link
              to="/registro"
              className="bg-indigo-600 px-4 py-2 rounded-xl text-white"
            >
              Registro
            </Link>
          </>
        )}

        {usuarioLogueado && (
          <>
            <span className="text-white">
              {usuarioLogueado.nombre}
            </span>

            {usuarioLogueado.rol?.trim().toLowerCase() === "admin" && (
              <Link
                to="/admin"
                className="text-yellow-400 font-bold"
              >
                Admin
              </Link>
            )}

            <button
              onClick={cerrarSesion}
              className="text-red-400"
            >
              Cerrar sesión
            </button>
          </>
        )}

      </div>

    </header>
  )
}

export default Header
