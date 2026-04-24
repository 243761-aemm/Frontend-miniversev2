'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, User, Mail, Lock, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/app/lib/api'
import { saveSession } from '@/app/lib/auth'

export default function RegistroPage() {
    const router = useRouter()
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [edad, setEdad] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        const edadNum = parseInt(edad)
        if (isNaN(edadNum) || edadNum < 13 || edadNum > 120) {
            setError('Ingresa una edad válida (mínimo 13 años)')
            return
        }

        setLoading(true)
        try {
            const data = await authApi.register(nombre, email, password, edadNum)
            saveSession(data.token, data.usuario)
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#27272a',
        border: '1px solid #3f3f46',
        borderRadius: '8px',
        padding: '10px 12px 10px 38px',
        fontSize: '14px',
        color: '#ffffff',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const iconStyle: React.CSSProperties = {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
    }

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '13px',
        color: '#a1a1aa',
        marginBottom: '6px',
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
            {/* Logo */}
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
                <p style={{ fontSize: '15px', color: '#a1a1aa' }}>Crea tu cuenta para comenzar a reseñar</p>
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
                    Registro
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
                    {/* Nombre */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Nombre completo</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} color="#71717a" style={iconStyle} />
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Correo electrónico</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} color="#71717a" style={iconStyle} />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Edad */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Edad</label>
                        <div style={{ position: 'relative' }}>
                            <Hash size={16} color="#71717a" style={iconStyle} />
                            <input
                                type="number"
                                placeholder="Tu edad"
                                value={edad}
                                onChange={(e) => setEdad(e.target.value)}
                                required
                                min={13}
                                max={120}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#71717a" style={iconStyle} />
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Confirmar contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#71717a" style={iconStyle} />
                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={inputStyle}
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
                        }}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#a1a1aa', marginTop: '20px' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'none' }}>
                        Inicia sesión
                    </Link>
                </p>
            </div>

            <div style={{ marginTop: '28px' }}>
                <Link href="/" style={{ fontSize: '14px', color: '#71717a', textDecoration: 'none' }}>
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}