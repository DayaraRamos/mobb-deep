# MOBB-DEEP — Sistema de Agendamiento para Barbería 💈

Plataforma web para que los clientes de MOBB-DEEP agenden sus citas en línea, elijan servicio, fecha y hora disponible, y reciban confirmación directa por WhatsApp. Incluye panel de administración con control de citas y balances de ingresos.

## ✨ Funcionalidades

- **Agendamiento de citas** con validación de horarios disponibles en tiempo real
- **Confirmación automática por WhatsApp** al completar el agendamiento
- **Panel de administrador** (protegido con login) para:
  - Ver y gestionar todas las citas (aceptar, rechazar, marcar como completadas)
  - Visualizar balances: total generado, promedio por servicio, desglose por tipo de servicio
- **Catálogo de servicios y galería de trabajos realizados** en la página de inicio
- Diseño propio, sin librerías de componentes externas

## 🛠️ Tecnologías

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) para la navegación
- [Supabase](https://supabase.com/) como backend (base de datos + autenticación)
- CSS propio (sin frameworks de UI)

## 📁 Estructura del proyecto

```
src/
├── pages/
│   ├── Inicio.jsx       # Landing con servicios y galería
│   ├── Agendar.jsx      # Formulario de agendamiento de citas
│   ├── Login.jsx        # Ingreso del administrador
│   └── Admin.jsx        # Panel de gestión de citas y balances
├── RutaProtegida.jsx    # Protege el acceso al panel de administrador
├── supabaseClient.js    # Configuración de conexión a Supabase
└── App.jsx              # Enrutamiento principal
```

## 🚀 Cómo correrlo localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/barberia-web.git
   cd barberia-web
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz con tus credenciales de Supabase:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. Corre el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🌐 Despliegue

Este proyecto está pensado para desplegarse en [Vercel](https://vercel.com/), conectado directamente a este repositorio para despliegue automático en cada `push`.

## 📄 Licencia

Proyecto privado de MOBB-DEEP. Todos los derechos reservados.
