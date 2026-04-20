'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, Search, User, LogOut } from 'lucide-react'
import { series, genres } from '@/lib/data'
import SerieCard from '@/components/ui/SerieCard'

// The page shows both logged-out (Image 1) and logged-in (Image 2) states
// We'll show logged-in by default for demo, with a toggle

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeGenre, setActiveGenre] = useState('Todas')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSeries = series.filter((serie) => {
    const matchesGenre =
      activeGenre === 'Todas' || serie.genres.includes(activeGenre)
    const matchesSearch =
      !searchQuery ||
      serie.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

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
          Minverse
        </Link>

        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setIsLoggedIn(true)}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLoggedIn(true)}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                color: '#ffffff',
                background: 'transparent',
                border: '1px solid #ffffff',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Registrarse
            </button>
          </div>
        ) : (
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
              aaaa
            </Link>
            <button
              onClick={() => setIsLoggedIn(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={16} color="#a1a1aa" />
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <div style={{ position: 'relative', paddingTop: '52px' }}>
        <div
          style={{
            position: 'relative',
            height: '320px',
            overflow: 'hidden',
          }}
        >
          {/* Hero background image */}
          <img
            src="https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"
            alt="Hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)',
            }}
          />

          {/* Hero text */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '24px',
              right: '50%',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '10px',
                color: '#ffffff',
              }}
            >
              Descubre y reseña tus series favoritas
            </h1>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.5 }}>
              Comparte tu opinión y descubre qué piensan otros sobre las mejores series del momento
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Search bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search
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
              type="text"
              placeholder="Buscar series por título o género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                padding: '8px 12px 8px 36px',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Popular Series section */}
        <section>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            Series populares
          </h2>

          {/* Genre filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: activeGenre === genre ? '#e11d48' : '#1a1a1a',
                  color: activeGenre === genre ? '#ffffff' : '#a1a1aa',
                  transition: 'background-color 0.15s',
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Series grid - 5 columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
            }}
          >
            {filteredSeries.map((serie) => (
              <SerieCard key={serie.id} serie={serie} />
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px',
          fontSize: '13px',
          color: '#71717a',
          borderTop: '1px solid #1a1a1a',
          marginTop: '48px',
        }}
      >
        © 2026 SeriesFlix. Comparte tus opiniones sobre series de televisión.
      </footer>
    </div>
  )
}
