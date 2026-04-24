export type AuthUser = {
    id: number
    nombre: string
    correo: string
}

export function saveSession(token: string, usuario: AuthUser): void {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
}

export function getSession(): { token: string; usuario: AuthUser } | null {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')
    if (!token || !usuario) return null
    return { token, usuario: JSON.parse(usuario) }
}

export function getUsuario(): AuthUser | null {
    const session = getSession()
    return session?.usuario ?? null
}

export function isLoggedIn(): boolean {
    return getSession() !== null
}

export function logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
}