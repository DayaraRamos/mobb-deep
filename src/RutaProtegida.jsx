import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

function RutaProtegida({ children }) {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (cargando) return <p>Cargando...</p>

  if (!sesion) return <Navigate to="/login" replace />

  return children
}

export default RutaProtegida