import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import fotoLocal from '../img/admin.jpeg'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="container page form-page">
    <div className='form-card'>
      <h1>Ingreso Administrador</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo:</label>
          <input className='inputlar'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div><br />
        <div>
          <label>Contraseña:</label>
          <input className='inputlar'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
      <div className="admin-photo">
        <img src={fotoLocal} alt="Local de la barbería" />
      </div>
    </div>
  )
}

export default Login