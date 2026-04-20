'use client'

import Link from 'next/link'
import { Film, User, LogOut, Mail, Calendar, Pencil } from 'lucide-react'

export default function PerfilPage() {
  const user = {
    username: 'aaaa',
    email: 'tu@gmail.com',
    memberSince: '2 de marzo de 2026',
    reviewsPublished: 0,
    seriesRated: 0,
    averageRating: 0.0,
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      {/* NAVBAR */}
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
          Miniverse
        </Link>

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
            {user.username}
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut size={16} color="#a1a1aa" />
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div
        style={{
          paddingTop: '72px',
          maxWidth: '700px',
          margin: '0 auto',
          padding: '72px 24px 48px',
        }}
      >
        {/* Profile card */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '10px',
            padding: '32px',
            marginBottom: '16px',
            border: '1px solid #1e1e1e',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#2a2a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <User size={32} color="#71717a" />
          </div>

          {/* Username */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{user.username}</span>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <Pencil size={14} color="#71717a" />
            </button>
          </div>

          {/* Email */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
            }}
          >
            <Mail size={14} color="#71717a" />
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{user.email}</span>
          </div>

          {/* Member since */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '32px',
            }}
          >
            <Calendar size={14} color="#71717a" />
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>
              Miembro desde {user.memberSince}
            </span>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                {user.reviewsPublished}
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>Reseñas publicadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                {user.seriesRated}
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>Series calificadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                {user.averageRating.toFixed(1)}
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>Calificación promedio</div>
            </div>
          </div>
        </div>

        {/* Recent activity card */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '10px',
            padding: '32px',
            border: '1px solid #1e1e1e',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            Actividad reciente
          </h2>

          {/* Empty state */}
          <div
            style={{
              textAlign: 'center',
              padding: '32px 0',
            }}
          >
            <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '20px' }}>
              Aún no has publicado ninguna reseña
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #ffffff',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Explorar series
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
