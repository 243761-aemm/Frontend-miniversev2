const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api'

function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken()

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || data.mensaje || 'Error en la petición')
    }

    return data as T
}

// ── Auth ───────────────────────────────────────────────
export const authApi = {
    login: (correo: string, contrasena: string) =>
        request<{ token: string; usuario: { id: number; nombre: string; correo: string } }>(
            '/auth/login',
            { method: 'POST', body: JSON.stringify({ correo, contrasena }) }
        ),

    register: (nombre: string, correo: string, contrasena: string, edad: number) =>
        request<{ token: string; usuario: { id: number; nombre: string; correo: string } }>(
            '/auth/register',
            { method: 'POST', body: JSON.stringify({ nombre, correo, contrasena, edad }) }
        ),
}

// ── Series ─────────────────────────────────────────────
export type SerieAPI = {
    id: number
    nombre: string
    estreno: number
    sinopsis: string
    idGenero: number
    idDirector: number
    imagenUrl: string | null
    tmdbId?: number
    genero?: { nombre: string }
}

export type TmdbSearchResult = {
    tmdbId: number
    nombre: string
    estreno: string
    sinopsis: string
    imagenUrl: string | null
    generos: string[]
}

export const seriesApi = {
    getAll: () => request<SerieAPI[]>('/series'),
    getById: (id: number) => request<SerieAPI>(`/series/${id}`),
    search: (q: string) =>
        request<TmdbSearchResult[]>(`/series/search?q=${encodeURIComponent(q)}`),
    import: (tmdbId: number) =>
        request<SerieAPI>('/series/import', {
            method: 'POST',
            body: JSON.stringify({ tmdbId }),
        }),
}

// ── Seasons ────────────────────────────────────────────
export type SeasonAPI = {
    id: number
    numero: number
    nombre: string
    descripcion: string | null
    imagenUrl: string | null
    idSerie: number
}

export const seasonsApi = {
    getBySerie: (idSerie: number) => request<SeasonAPI[]>(`/seasons/serie/${idSerie}`),
    import: (idSerie: number) =>
        request<SeasonAPI[]>(`/seasons/import/${idSerie}`, { method: 'POST' }),
}

// ── Episodes ───────────────────────────────────────────
export type EpisodeAPI = {
    id: number
    titulo: string
    numero: number
    duracion: number
    idTemporada: number
}

export const episodesApi = {
    getBySeason: (idTemporada: number) =>
        request<EpisodeAPI[]>(`/episodes/season/${idTemporada}`),
    import: (idTemporada: number) =>
        request<EpisodeAPI[]>(`/episodes/import/${idTemporada}`, { method: 'POST' }),
}

// ── Reviews ────────────────────────────────────────────
export type ReviewAPI = {
    id: number
    contenido: string
    fechaCreacion: string
    idCapitulo: number
    idUsuario: number
}

export const reviewsApi = {
    getByEpisode: (idCapitulo: number) =>
        request<ReviewAPI[]>(`/reviews/episode/${idCapitulo}`),
    getMyReviews: () => request<ReviewAPI[]>('/reviews/me'),
    create: (contenido: string, idCapitulo: number) =>
        request<ReviewAPI>('/reviews', {
            method: 'POST',
            body: JSON.stringify({ contenido, idCapitulo }),
        }),
    delete: (id: number) =>
        request<{ mensaje: string }>(`/reviews/${id}`, { method: 'DELETE' }),
}

// ── Comments ───────────────────────────────────────────
export type CommentAPI = {
    id: number
    contenido: string
    fechaCreacion: string
    idUsuario: number
    idResena: number
}

export const commentsApi = {
    getByReview: (idResena: number) =>
        request<CommentAPI[]>(`/comments/review/${idResena}`),
    create: (contenido: string, idResena: number) =>
        request<CommentAPI>('/comments', {
            method: 'POST',
            body: JSON.stringify({ contenido, idResena }),
        }),
    delete: (id: number) =>
        request<{ mensaje: string }>(`/comments/${id}`, { method: 'DELETE' }),
}

// ── User ───────────────────────────────────────────────
export type UserAPI = {
    id: number
    nombre: string
    correo: string
    edad: number
}

export const userApi = {
    getProfile: () => request<UserAPI>('/users/profile'),
    update: (data: { nombre?: string; edad?: number }) =>
        request<UserAPI>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: () =>
        request<{ mensaje: string }>('/users/profile', { method: 'DELETE' }),
}