import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Agendar from './pages/Agendar'
import Admin from './pages/Admin'
import Login from './pages/Login'
import RutaProtegida from './RutaProtegida'
import Footer from './Footer'
import './App.css'
import logo from "./src/img/logodeep.png"

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand" onClick={() => setMenuAbierto(false)}>
          { <img src="./src/img/logodeep.png" alt="Logo" className="logo" />/*<span>MOBB-DEEP</span> */}
          </NavLink>

          <button
            className="navbar-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <ul className={`navbar-links ${menuAbierto ? 'open' : ''}`}>
            <li>
              <NavLink to="/" end onClick={() => setMenuAbierto(false)}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/agendar" onClick={() => setMenuAbierto(false)}>
                Agendar
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" onClick={() => setMenuAbierto(false)}>
                Ingreso Admin
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App