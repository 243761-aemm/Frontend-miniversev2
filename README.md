# MiniVerse - Frontend

Interfaz web para la plataforma de reseñas de series por episodio. Construida con Next.js y TypeScript, consume el API del backend para todas las operaciones.

---

## Tecnologías

- Next.js 16 con TypeScript
- Socket.io client para comentarios en tiempo real
- Lucide React para iconos

---

## Requisitos

- Node.js 18 o superior
- Backend de MiniVerse corriendo

---

## Instalación

```bash
npm install

nom install socket.io
```

Crear el archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3100/api
NEXT_PUBLIC_REALTIME_URL=http://localhost:3008
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Estructura

```
src/app/
├── components/
│   ├── layout/       - Navbar y Footer
│   └── ui/           - Componentes reutilizables
├── lib/
│   ├── api.ts        - Cliente HTTP para el backend
│   ├── auth.ts       - Manejo de sesión y token
│   └── data.ts       - Tipos y datos estáticos
├── login/            - Página de inicio de sesión
├── registro/         - Página de registro
├── perfil/           - Página de perfil de usuario
├── serie/[id]/       - Página de detalle de serie
└── page.tsx          - Página principal
```

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| NEXT_PUBLIC_API_URL | URL base del API Gateway |
| NEXT_PUBLIC_REALTIME_URL | URL del servicio de Socket.io |

---

## Funcionalidades

- Catálogo de series con imágenes desde TMDB
- Búsqueda de series en tiempo real
- Registro e inicio de sesión
- Detalle de serie con temporadas y episodios
- Publicación de reseñas por episodio
- Comentarios en tiempo real mediante Socket.io
- Sesión persistente con JWT en localStorage

---

## Despliegue

El proyecto está desplegado en Vercel. Para desplegar una nueva versión basta con hacer push a la rama principal y Vercel lo detecta automáticamente.

Agregar las variables de entorno en el panel de Vercel antes del primer despliegue:

```
NEXT_PUBLIC_API_URL=https://miniverse-api-gateway.onrender.com/api
NEXT_PUBLIC_REALTIME_URL=https://miniverse-realtime-service.onrender.com
```