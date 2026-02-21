import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ListaUsuarios from "./ListaUsuarios"
import AdminPanel from "./pages/AdminPanel"
import Info from "./pages/Info"


function App() {

  const usuarioLogueado = JSON.parse(localStorage.getItem("user") || "null")

  const esAdmin =
    usuarioLogueado?.rol?.trim().toLowerCase() === "admin"

  return (
    <BrowserRouter>
      <Header />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={esAdmin ? <AdminPanel /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={esAdmin ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route path="/integrantes" element={<ListaUsuarios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/info" element={<Info />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
