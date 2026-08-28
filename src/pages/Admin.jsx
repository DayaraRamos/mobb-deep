import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'


function Admin() {
      // Formulario de nuevo trabajo
  const [trabajos, setTrabajos] = useState([])
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('')
  const [archivoTrabajo, setArchivoTrabajo] = useState(null)
  const [subiendoTrabajo, setSubiendoTrabajo] = useState(false)
  const [mensajeTrabajo, setMensajeTrabajo] = useState('')
  const [citas, setCitas] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)

  // Formulario de nuevo servicio
  const [nombreServicio, setNombreServicio] = useState('')
  const [descripcionServicio, setDescripcionServicio] = useState('')
  const [precioServicio, setPrecioServicio] = useState('')
  const [duracionServicio, setDuracionServicio] = useState('')
  const [guardandoServicio, setGuardandoServicio] = useState(false)
  const [mensajeServicio, setMensajeServicio] = useState('')

  async function cargarCitas() {
    const { data, error } = await supabase
      .from('citas')
      .select(`
        id,
        fecha,
        hora,
        estado,
        clientes ( nombre, telefono ),
        servicios ( nombre, precio )
      `)
      .order('fecha', { ascending: true })

    if (error) {
      console.error('Error cargando citas:', error)
    } else {
      setCitas(data)
    }
  }

  async function cargarServicios() {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error cargando servicios:', error)
    } else {
      setServicios(data)
    }
  }

    async function cargarTrabajos() {
    const { data, error } = await supabase
      .from('trabajos_realizados')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando trabajos:', error)
    } else {
      setTrabajos(data)
    }
  }

      useEffect(() => {
    async function cargarTodo() {
      setCargando(true)
      await Promise.all([cargarCitas(), cargarServicios(), cargarTrabajos()])
      setCargando(false)
    }
    cargarTodo()
  }, [])

  async function actualizarEstado(id, nuevoEstado) {
    const { error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) {
      console.error('Error actualizando cita:', error)
    } else {
      cargarCitas()
    }
  }

  async function crearServicio(e) {
    e.preventDefault()
    setGuardandoServicio(true)
    setMensajeServicio('')

    const { error } = await supabase.from('servicios').insert([
      {
        nombre: nombreServicio,
        descripcion: descripcionServicio,
        precio: Number(precioServicio),
        duracion_minutos: Number(duracionServicio),
      },
    ])

    if (error) {
      console.error('Error creando servicio:', error)
      setMensajeServicio('Hubo un error al guardar el servicio.')
    } else {
      setMensajeServicio('Servicio agregado con éxito.')
      setNombreServicio('')
      setDescripcionServicio('')
      setPrecioServicio('')
      setDuracionServicio('')
      cargarServicios()
    }

    setGuardandoServicio(false)
  }

  async function eliminarServicio(id) {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este servicio?')
    if (!confirmar) return

    const { error } = await supabase.from('servicios').delete().eq('id', id)

    if (error) {
      console.error('Error eliminando servicio:', error)
      alert('No se pudo eliminar. Puede que tenga citas asociadas.')
    } else {
      cargarServicios()
    }
  }

    async function subirTrabajo(e) {
    e.preventDefault()
    if (!archivoTrabajo) {
      setMensajeTrabajo('Selecciona una imagen primero.')
      return
    }

    setSubiendoTrabajo(true)
    setMensajeTrabajo('')

    const extension = archivoTrabajo.name.split('.').pop()
    const nombreArchivo = `${crypto.randomUUID()}.${extension}`

    // Paso 1: subir el archivo al bucket "trabajos"
    const { error: errorSubida } = await supabase.storage
      .from('trabajos')
      .upload(nombreArchivo, archivoTrabajo)

    if (errorSubida) {
      console.error('Error subiendo imagen:', errorSubida)
      setMensajeTrabajo('Hubo un error al subir la imagen.')
      setSubiendoTrabajo(false)
      return
    }

    // Paso 2: obtener la URL pública de esa imagen
    const { data: urlData } = supabase.storage
      .from('trabajos')
      .getPublicUrl(nombreArchivo)

    // Paso 3: guardar el registro en la tabla trabajos_realizados
    const { error: errorInsert } = await supabase.from('trabajos_realizados').insert([
      {
        imagen_url: urlData.publicUrl,
        descripcion: descripcionTrabajo,
      },
    ])

    if (errorInsert) {
      console.error('Error guardando trabajo:', errorInsert)
      setMensajeTrabajo('La imagen se subió, pero hubo un error al guardarla.')
    } else {
      setMensajeTrabajo('Trabajo agregado con éxito.')
      setDescripcionTrabajo('')
      setArchivoTrabajo(null)
      e.target.reset()
      cargarTrabajos()
    }

    setSubiendoTrabajo(false)
  }

  async function eliminarTrabajo(id, imagenUrl) {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este trabajo?')
    if (!confirmar) return

    // Extraer el nombre del archivo desde la URL para borrarlo también del Storage
    const nombreArchivo = imagenUrl.split('/').pop()

    await supabase.storage.from('trabajos').remove([nombreArchivo])

    const { error } = await supabase.from('trabajos_realizados').delete().eq('id', id)

    if (error) {
      console.error('Error eliminando trabajo:', error)
      alert('No se pudo eliminar el trabajo.')
    } else {
      cargarTrabajos()
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // --- Cálculo de balances ---
  const completadas = citas.filter((c) => c.estado === 'completada')

  const totalGenerado = completadas.reduce(
    (suma, c) => suma + (c.servicios?.precio || 0),
    0
  )

  const promedioPorServicio =
    completadas.length > 0 ? totalGenerado / completadas.length : 0

  const balancePorServicio = {}
  completadas.forEach((c) => {
    const nombre = c.servicios?.nombre || 'Sin nombre'
    const precio = c.servicios?.precio || 0
    if (!balancePorServicio[nombre]) {
      balancePorServicio[nombre] = { cantidad: 0, total: 0 }
    }
    balancePorServicio[nombre].cantidad += 1
    balancePorServicio[nombre].total += precio
  })

  if (cargando) return <div className="container page"><p>Cargando panel...</p></div>

  return (
    <div className="container page">
      <div className="section-heading admin-header">
                <h1>Panel de Administrador</h1>
        <button onClick={cerrarSesion} className="btn btn-outline btn-sm">
          Cerrar sesión
        </button>
      </div>

      {/* --- Balances --- */}
      <section className="section">
        <h2>Balances</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total generado</p>
            <p className="stat-value">${totalGenerado.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Servicios completados</p>
            <p className="stat-value">{completadas.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Promedio por servicio</p>
            <p className="stat-value">
              ${promedioPorServicio.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {Object.keys(balancePorServicio).length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(balancePorServicio).map(([nombre, datos]) => (
                  <tr key={nombre}>
                    <td>{nombre}</td>
                    <td>{datos.cantidad}</td>
                    <td>${datos.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

            <div className="stripe-rule stripe-rule--thin"></div>

      {/* --- Gestión de trabajos realizados --- */}
      <section className="section" style={{ marginTop: '3rem' }}>
        <h2>Trabajos realizados</h2>

        <div className="admin-grid">
                    <form onSubmit={subirTrabajo} className="form-card">
            <h3>Agregar trabajo</h3>

            <div className="form-group">
              <label>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArchivoTrabajo(e.target.files[0])}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción (opcional)</label>
              <input
                type="text"
                value={descripcionTrabajo}
                onChange={(e) => setDescripcionTrabajo(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={subiendoTrabajo}>
              {subiendoTrabajo ? 'Subiendo...' : 'Agregar trabajo'}
            </button>

            {mensajeTrabajo && <p className="form-message">{mensajeTrabajo}</p>}
          </form>

          <div className="gallery-grid">
            {trabajos.map((t) => (
              <div key={t.id} className="gallery-item">
                <img src={t.imagen_url} alt={t.descripcion || 'Trabajo'} />
                {t.descripcion && <p>{t.descripcion}</p>}
                <div style={{ padding: '0 0.75rem 0.75rem 0.75rem' }}>
                  <button
                    onClick={() => eliminarTrabajo(t.id, t.imagen_url)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="stripe-rule stripe-rule--thin"></div>

      {/* --- Gestión de servicios --- */}
      <section className="section" style={{ marginTop: '3rem' }}>
        <h2>Servicios</h2>

        <div className="admin-grid">
                    <form onSubmit={crearServicio} className="form-card">
            <h3>Agregar servicio</h3>

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nombreServicio}
                onChange={(e) => setNombreServicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción (opcional)</label>
              <input
                type="text"
                value={descripcionServicio}
                onChange={(e) => setDescripcionServicio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                value={precioServicio}
                onChange={(e) => setPrecioServicio(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Duración (minutos)</label>
              <input
                type="number"
                value={duracionServicio}
                onChange={(e) => setDuracionServicio(e.target.value)}
                required
                min="1"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={guardandoServicio}>
              {guardandoServicio ? 'Guardando...' : 'Agregar servicio'}
            </button>

            {mensajeServicio && <p className="form-message">{mensajeServicio}</p>}
          </form>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Duración</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>${s.precio.toLocaleString()}</td>
                    <td>{s.duracion_minutos} min</td>
                    <td>
                      <button
                        onClick={() => eliminarServicio(s.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="stripe-rule stripe-rule--thin"></div>

      {/* --- Citas --- */}
      <section className="section" style={{ marginTop: '3rem' }}>
        <h2>Citas</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Servicio</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.clientes?.nombre}</td>
                  <td>{cita.clientes?.telefono}</td>
                  <td>{cita.servicios?.nombre}</td>
                  <td>${cita.servicios?.precio?.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${cita.estado}`}>{cita.estado}</span>
                  </td>
                  <td>
                    {cita.estado === 'pendiente' && (
                      <>
                        <button onClick={() => actualizarEstado(cita.id, 'aceptada')} className="btn btn-primary btn-sm" style={{ marginRight: '0.5rem' }}>
                          Aceptar
                        </button>
                        <button onClick={() => actualizarEstado(cita.id, 'rechazada')} className="btn btn-danger btn-sm">
                          Rechazar
                        </button>
                      </>
                    )}
                    {cita.estado === 'aceptada' && (
                      <button onClick={() => actualizarEstado(cita.id, 'completada')} className="btn btn-outline btn-sm">
                        Marcar completada
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Admin