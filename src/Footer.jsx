import logo from './img/logodeep.png'

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="columna1">
          <img src={logo} alt="Logo" className="logofooter" />
          <p className="pfooter">MOBB DEEP — barbería</p>
        </div>

        <div className="columna2">
          <h2>Horario</h2>
          <p className="pfooter">Lunes a Sábado: 10:00 am - 08:00 pm</p>
          <p className="pfooter">Domingos y Festivos: 10:00 am - 06:00 pm</p>
        </div>

        <div className="columna3">
          <h2>Contáctanos</h2>
          <div className="footer-social">
            <a href="/agendar" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.42-4.4-1.16l-.32-.18-3 .79.8-2.92-.2-.3A7.94 7.94 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.6c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4-.14 0-.3-.02-.46-.02s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/mobbdeepbarber" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.facebook.com/people/MOBB-DEEP-b/100092360667368/?rdid=VVkpLeRyfasztpCM&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15ZW1H5scb%2F" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
</svg>
            </a>
          </div>
        </div>
      </div>

      <div className="finfooter">
        <p className="pfooter">© {new Date().getFullYear()} MOBB DEEP — barbería. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer