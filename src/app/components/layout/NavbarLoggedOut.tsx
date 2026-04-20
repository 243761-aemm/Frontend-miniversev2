'use client'

import Link from 'next/link'
import { Film } from 'lucide-react'

export default function NavbarLoggedOut() {
  return (
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
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Logo */}
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
        <Film size={20} color="#ffffff" />
        Minverse
      </Link>

      {/* Auth buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link
          href="/login"
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            color: '#ffffff',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            color: '#ffffff',
            background: 'transparent',
            border: '1px solid #ffffff',
            borderRadius: '6px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Registrarse
        </Link>
      </div>
    </nav>
  )
}
