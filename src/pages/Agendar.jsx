import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'


const NUMERO_BARBERO = '573108240839' // Reemplaza con el número real, con código de país, sin +, sin espacios

function Agendar() {
  const [servicios, setServicios] = useState([])
  const [servicioId, setServicioId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargarServicios() {
      const { data, error } = await supabase.from('servicios').select('*')
      if (error) {
        console.error('Error cargando servicios:', error)
      } else {
        setServicios(data)
      }
    }
    cargarServicios()
  }, [])

      async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje('')

    // Validar que el horario esté disponible
    const { data: disponible, error: errorDisponibilidad } = await supabase
      .rpc('horario_disponible', { p_fecha: fecha, p_hora: hora })

    if (errorDisponibilidad) {
      console.error('Error verificando disponibilidad:', errorDisponibilidad)
      setMensaje('Hubo un error al verificar el horario. Intenta de nuevo.')
      setEnviando(false)
      return
    }

    if (!disponible) {
      setMensaje('Ese horario ya está ocupado. Por favor elige otra hora.')
      setEnviando(false)
      return
    }

    const clienteId = crypto.randomUUID()

    // Paso 1: crear el cliente (sin pedir que nos devuelva la fila)
    const { error: errorCliente } = await supabase
      .from('clientes')
      .insert([{ id: clienteId, nombre, telefono, email }])

    if (errorCliente) {
      console.error('Error creando cliente:', errorCliente)
      setMensaje('Hubo un error al guardar tus datos. Intenta de nuevo.')
      setEnviando(false)
      return
    }

    // Paso 2: crear la cita, usando el id generado arriba
    const { error: errorCita } = await supabase.from('citas').insert([
      {
        cliente_id: clienteId,
        servicio_id: servicioId,
        fecha,
        hora,
        estado: 'pendiente',
      },
    ])

        if (errorCita) {
      console.error('Error creando cita:', errorCita)
      setMensaje('Hubo un error al agendar la cita. Intenta de nuevo.')
    } else {
      setMensaje('¡Cita agendada con éxito! Te vamos a redirigir a WhatsApp para confirmar.')

      // Buscar el nombre del servicio elegido para el mensaje
      const servicioElegido = servicios.find((s) => s.id === servicioId)
      const nombreServicio = servicioElegido?.nombre || 'servicio'

      const mensajeWhatsapp = `Hola MOBBVEED, soy ${nombre}. Acabo de agendar una cita para *${nombreServicio}* el *${fecha}* a las *${hora}*. Mi teléfono es ${telefono}.`

      const urlWhatsapp = `https://wa.me/${NUMERO_BARBERO}?text=${encodeURIComponent(mensajeWhatsapp)}`

      window.open(urlWhatsapp, '_blank')

      setServicioId('')
      setFecha('')
      setHora('')
      setNombre('')
      setTelefono('')
      setEmail('')
    }

    setEnviando(false)
  }

  return (
    <div className="container page form-page">
    <div className="form-card">
      <h1>Agendar Cita</h1>
      <form onSubmit={handleSubmit} className="agendar-form">
        <div>
          <label>Servicio:</label><br />
          <select className='inputlar'
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} - ${s.precio}
              </option>
            ))}
          </select>
        </div><br />    

        <div>
          <label>Fecha:</label><br />
          <input className='inputlar'
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div><br />

        <div>
          <label>Hora:</label><br />
          <input className='inputlar'
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </div><br />

        <div>
          <label>Nombre:</label><br />
          <input className='inputlar'
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div><br />

        <div>
          <label>Teléfono:</label><br />
          <input className='inputlar'
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div><br />

        <div>
          <label>Email (opcional):</label><br />
          <input className='inputlar'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div><br />

        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Agendar cita'}
        </button>
      </form>
    {mensaje && <p className="form-message">{mensaje}</p>}
  </div>
</div>
  )
}

export default Agendar