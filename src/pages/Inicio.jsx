import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import videoHero from '../img/herofondo.mp4'

function Inicio() {
  const [servicios, setServicios] = useState([])
  const [trabajos, setTrabajos] = useState([])

  useEffect(() => {
    async function cargarDatos() {
      const { data: dataServicios, error: errorServicios } = await supabase
        .from('servicios')
        .select('*')

      if (errorServicios) {
        console.error('Error cargando servicios:', errorServicios)
      } else {
        setServicios(dataServicios)
      }

      const { data: dataTrabajos, error: errorTrabajos } = await supabase
        .from('trabajos_realizados')
        .select('*')

      if (errorTrabajos) {
        console.error('Error cargando trabajos:', errorTrabajos)
      } else {
        setTrabajos(dataTrabajos)
      }
    }

    cargarDatos()
  }, [])

  return (
    <div className="container page">
            <section className="hero full-bleed hero-bleed">
        <video
          className="hero-bleed-video"
          src={videoHero}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-bleed-overlay"></div>
        <div className="full-bleed-inner">
        <span className="eyebrow">Corte, barba y tradición</span>
        <h1>Tu barbería de confianza,<br />a un clic de distancia.</h1>
        <p  className="pheroinicio">
          Agenda tu cita en segundos, elige el servicio que necesitas y te
          confirmamos por WhatsApp. Sin filas, sin llamadas.
        </p>
        <Link to="/agendar" className="btn btn-primary">
          Agendar mi cita
        </Link>
        
        </div>
        
      </section><br /><br />

      <section className="section">
        <div className="section-heading">
          <b><h2 className='tituloservicios'>Nuestros servicios</h2></b>
          <p className='pservicios'>Precios claros, sin sorpresas.</p>
        </div>

        {servicios.length === 0 ? (
          <b><p className='pmensajesinservicios'>Pronto vas a ver aquí nuestros servicios.</p></b>
        ) : (
          <div className="service-grid">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="card">
                <h3>{servicio.nombre}</h3>
                <p className="service-price">${servicio.precio.toLocaleString()}</p>
                <p className="service-meta">{servicio.duracion_minutos} min</p>
                {servicio.descripcion && <p className='descripInicio'>{servicio.descripcion}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <h2 className='tituloservicios'>Trabajos realizados</h2>
          <p className='pservicios'>Una muestra de lo que hacemos cada día.</p>
        </div>

        {trabajos.length === 0 ? (
          <b><p className='pmensajesinservicios'>Pronto vas a ver aquí nuestra galería de trabajos.</p></b>
        ) : (
          <div className="gallery-grid">
            {trabajos.map((trabajo) => (
              <div key={trabajo.id} className="gallery-item">
                <img
                  src={trabajo.imagen_url}
                  alt={trabajo.descripcion || 'Trabajo realizado'}
                />
                {trabajo.descripcion && <p>{trabajo.descripcion}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Inicio