'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/app/lib/api'
import { saveSession } from '@/app/lib/auth'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await authApi.login(email, password)
            saveSession(data.token, data.usuario)
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                backgroundColor: '#000000',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                fontFamily: 'inherit',
            }}
        >
            {/* Logo + subtítulo */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                    }}
                >
                    <Film size={28} color="#ffffff" />
                    <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>Miniverse</span>
                </div>
                <p style={{ fontSize: '15px', color: '#a1a1aa' }}>Inicia sesión en tu cuenta</p>
            </div>

            {/* Card */}
            <div
                style={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    padding: '36px 32px',
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>
                    Iniciar sesión
                </h1>

                {/* Error message */}
                {error && (
                    <div
                        style={{
                            backgroundColor: '#450a0a',
                            border: '1px solid #7f1d1d',
                            borderRadius: '6px',
                            padding: '10px 12px',
                            marginBottom: '16px',
                            fontSize: '14px',
                            color: '#fca5a5',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>
                            Correo electrónico
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={16}
                                color="#71717a"
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    backgroundColor: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    padding: '10px 12px 10px 38px',
                                    fontSize: '14px',
                                    color: '#ffffff',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px' }}>
                            Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={16}
                                color="#71717a"
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    backgroundColor: '#27272a',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    padding: '10px 12px 10px 38px',
                                    fontSize: '14px',
                                    color: '#ffffff',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '11px',
                            backgroundColor: loading ? '#52525b' : '#ffffff',
                            color: loading ? '#a1a1aa' : '#000000',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.15s',
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>

                {/* Link registro */}
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#a1a1aa', marginTop: '20px' }}>
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'none' }}>
                        Regístrate
                    </Link>
                </p>
            </div>

            {/* Volver al inicio */}
            <div style={{ marginTop: '28px' }}>
                <Link href="/" style={{ fontSize: '14px', color: '#71717a', textDecoration: 'none' }}>
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}