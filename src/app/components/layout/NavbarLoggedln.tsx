'use client'

import Link from 'next/link'
import { Film, User, LogOut } from 'lucide-react'

export default function NavbarLoggedIn({ username = 'aaaa' }: { username?: string }) {
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
        SeriesFlix
      </Link>

      {/* User info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link
          href="/perfil"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#a1a1aa',
            textDecoration: 'none',
          }}
        >
          <User size={16} color="#a1a1aa" />
          {username}
        </Link>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#a1a1aa',
          }}
        >
          <LogOut size={16} color="#a1a1aa" />
        </button>
      </div>
    </nav>
  )
}
