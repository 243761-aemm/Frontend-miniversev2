'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Film, Search, User, LogOut } from 'lucide-react'
import { seriesApi, SerieAPI } from '@/app/lib/api'
import { isLoggedIn, getUsuario, logout } from '@/app/lib/auth'

const GENRE_MAP: Record<number, string> = {
  1: 'Drama',
  2: 'Action & Adventure',
  3: 'Animacion',
  4: 'Comedia',
  5: 'Crimen',
  6: 'Documental',
  7: 'Familia',
  8: 'Kids',
  9: 'Misterio',
  10: 'News',
  11: 'Reality',
  12: 'Sci-Fi & Fantasy',
  13: 'Soap',
  14: 'Talk',
  15: 'War & Politics',
  16: 'Western',
}

function SerieCard({ serie }: { serie: SerieAPI }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = serie.imagenUrl && !imgError

  return (
    <Link href={`/serie/${serie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          aspectRatio: '2/3',
          width: '100%',
          backgroundColor: '#1a1a1a',
        }}
      >
        {hasImage ? (
          <img
            src={serie.imagenUrl!}
            alt={serie.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '12px', textAlign: 'center',
              background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
            }}
          >
            <Film size={22} color="#3f3f46" style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '11px', color: '#71717a', lineHeight: 1.3, wordBreak: 'break-word' }}>
              {serie.nombre}
            </span>
          </div>
        )}

        <div
          style={{
            position: 'absolute', bottom: '6px', left: '6px',
            backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '4px',
            padding: '2px 5px', fontSize: '10px', color: '#a1a1aa',
          }}
        >
          {serie.estreno}
        </div>
      </div>

      <p
        style={{
          margin: '5px 0 0 0', fontSize: '12px', fontWeight: 500,
          color: '#d4d4d8', whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis', height: '16px', lineHeight: '16px',
        }}
      >
        {serie.nombre}
      </p>
    </Link>
  )
}

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [series, setSeries] = useState<SerieAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGenre, setActiveGenre] = useState('Todas')

  useEffect(() => {
    const logged = isLoggedIn()
    setLoggedIn(logged)
    if (logged) {
      const u = getUsuario()
      if (u) setUserName(u.nombre)
    }
  }, [])

  useEffect(() => {
    seriesApi.getAll()
      .then(setSeries)
      .catch(() => setError('No se pudieron cargar las series. Esta corriendo el backend?'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUserName('')
  }

  const genres = ['Todas', ...Array.from(
    new Set(series.map((s) => GENRE_MAP[s.idGenero]).filter(Boolean))
  ).sort()]

  const filteredSeries = series.filter((s) => {
    const matchesSearch =
      !searchQuery || s.nombre.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre =
      activeGenre === 'Todas' || GENRE_MAP[s.idGenero] === activeGenre

    return matchesSearch && matchesGenre
  })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a',
        height: '52px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: '#ffffff', textDecoration: 'none' }}>
          <Film size={20} /> Miniverse
        </Link>

        {!loggedIn ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/login" style={{ padding: '6px 16px', fontSize: '14px', color: '#ffffff', textDecoration: 'none' }}>
              Iniciar sesion
            </Link>
            <Link href="/registro" style={{ padding: '6px 16px', fontSize: '14px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '6px', textDecoration: 'none' }}>
              Registrarse
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#a1a1aa', textDecoration: 'none' }}>
              <User size={16} color="#a1a1aa" /> {userName}
            </Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <LogOut size={16} color="#a1a1aa" />
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: '52px' }}>
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img
            src="https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"
            alt="Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.15) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '36px', left: '32px', right: '48%' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.25, marginBottom: '10px' }}>
              Descubre y resena tus series favoritas
            </h1>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.5, margin: 0 }}>
              Comparte tu opinion capitulo por capitulo
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px 32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Search */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <Search size={14} color="#71717a" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Buscar por titulo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', backgroundColor: '#141414', border: '1px solid #222',
                borderRadius: '6px', padding: '8px 12px 8px 32px',
                fontSize: '13px', color: '#ffffff', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>Series populares</h2>

          {/* Genre pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', border: 'none',
                  backgroundColor: activeGenre === genre ? '#e11d48' : '#1e1e1e',
                  color: activeGenre === genre ? '#ffffff' : '#a1a1aa',
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Skeleton loading */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '2/3', borderRadius: '6px', backgroundColor: '#1a1a1a' }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '16px', color: '#fca5a5', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Vacio */}
          {!loading && !error && filteredSeries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#71717a', fontSize: '14px' }}>
              {series.length === 0
                ? 'No hay series en el catalogo aun.'
                : activeGenre !== 'Todas'
                  ? `No hay series en el genero "${activeGenre}".`
                  : 'No se encontraron series con ese titulo.'}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredSeries.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '12px',
              alignItems: 'start',
            }}>
              {filteredSeries.map((serie) => (
                <SerieCard key={serie.id} serie={serie} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer style={{ textAlign: 'center', padding: '24px', fontSize: '12px', color: '#3f3f46', borderTop: '1px solid #141414', marginTop: '48px' }}>
        2026 Miniverse
      </footer>

      <style>{`input::placeholder { color: #52525b; }`}</style>
    </div>
  )
}