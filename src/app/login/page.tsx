'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #1a1a1a',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '16px',
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          <Film size={20} />
          Minverse
        </Link>
      </nav>

      {/* Form */}
      <div
        style={{
          paddingTop: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '10px',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #1e1e1e',
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Iniciar sesión
          </h1>
          <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '28px' }}>
            Accede a tu cuenta para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{ fontSize: '13px', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{ fontSize: '13px', color: '#a1a1aa', display: 'block', marginBottom: '6px' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Iniciar sesión
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#71717a', marginTop: '20px' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/registro" style={{ color: '#ffffff', textDecoration: 'underline' }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
