'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Film, User, LogOut, ChevronDown, ChevronRight, Clock, Play } from 'lucide-react'
import { seriesApi, seasonsApi, episodesApi, SerieAPI, SeasonAPI, EpisodeAPI } from '@/app/lib/api'
import { isLoggedIn, getUsuario, logout } from '@/app/lib/auth'

export default function SeriePage() {
  const params = useParams()
  const id = Number(params.id)

  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  const [serie, setSerie] = useState<SerieAPI | null>(null)
  const [seasons, setSeasons] = useState<SeasonAPI[]>([])
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<number, EpisodeAPI[]>>({})
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null)

  const [loadingSerie, setLoadingSerie] = useState(true)
  const [loadingSeasons, setLoadingSeasons] = useState(false)
  const [loadingEpisodes, setLoadingEpisodes] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const logged = isLoggedIn()
    setLoggedIn(logged)
    if (logged) {
      const u = getUsuario()
      if (u) setUserName(u.nombre)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    setLoadingSerie(true)
    seriesApi.getById(id)
      .then(setSerie)
      .catch(() => setError('No se pudo cargar la serie.'))
      .finally(() => setLoadingSerie(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    setLoadingSeasons(true)
    seasonsApi.getBySerie(id)
      .then(setSeasons)
      .catch(() => {})
      .finally(() => setLoadingSeasons(false))
  }, [id])

  const handleToggleSeason = async (season: SeasonAPI) => {
    if (expandedSeason === season.id) {
      setExpandedSeason(null)
      return
    }
    setExpandedSeason(season.id)
    if (episodesBySeason[season.id]) return
    setLoadingEpisodes(season.id)
    try {
      const eps = await episodesApi.getBySeason(season.id)
      setEpisodesBySeason((prev) => ({ ...prev, [season.id]: eps }))
    } catch {
    } finally {
      setLoadingEpisodes(null)
    }
  }

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUserName('')
  }

  if (loadingSerie) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#52525b', fontSize: '14px' }}>Cargando...</div>
      </div>
    )
  }

  if (error || !serie) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: '#fca5a5', fontSize: '14px' }}>{error || 'Serie no encontrada'}</p>
        <Link href="/" style={{ color: '#a1a1aa', fontSize: '13px', textDecoration: 'none' }}>Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a',
        height: '52px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: '#ffffff', textDecoration: 'none' }}>
          <Film size={20} />
          Miniverse
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {loggedIn ? (
            <>
              <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#a1a1aa', textDecoration: 'none' }}>
                <User size={16} color="#a1a1aa" />
                {userName}
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <LogOut size={16} color="#a1a1aa" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: '14px', color: '#a1a1aa', textDecoration: 'none' }}>Iniciar sesión</Link>
              <Link href="/registro" style={{ padding: '6px 14px', fontSize: '13px', color: '#ffffff', border: '1px solid #3f3f46', borderRadius: '6px', textDecoration: 'none' }}>Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ paddingTop: '52px' }}>
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          {serie.imagenUrl ? (
            <img
              src={serie.imagenUrl}
              alt={serie.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={48} color="#3f3f46" />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,10,10,1) 100%)' }} />
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 64px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', marginTop: '24px' }}>
          {serie.nombre}
        </h1>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          {serie.estreno && (
            <span style={{ fontSize: '13px', color: '#71717a' }}>{serie.estreno}</span>
          )}
          {serie.genero?.nombre && (
            <span style={{
              fontSize: '12px', color: '#a1a1aa',
              backgroundColor: '#1e1e1e', borderRadius: '4px', padding: '2px 8px',
            }}>
              {serie.genero.nombre}
            </span>
          )}
        </div>

        {serie.sinopsis && (
          <div style={{ backgroundColor: '#141414', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px', border: '1px solid #1e1e1e' }}>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.65, margin: 0 }}>{serie.sinopsis}</p>
          </div>
        )}

        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Temporadas</h2>

        {loadingSeasons && (
          <div style={{ color: '#52525b', fontSize: '13px', padding: '24px 0' }}>Cargando temporadas...</div>
        )}

        {!loadingSeasons && seasons.length === 0 && (
          <div style={{ color: '#52525b', fontSize: '13px', padding: '24px 0' }}>
            No hay temporadas disponibles aún.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {seasons.map((season) => {
            const isOpen = expandedSeason === season.id
            const episodes = episodesBySeason[season.id] || []
            const isLoadingEps = loadingEpisodes === season.id

            return (
              <div key={season.id} style={{ backgroundColor: '#141414', borderRadius: '8px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                <button
                  onClick={() => handleToggleSeason(season)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', background: 'transparent', border: 'none',
                    cursor: 'pointer', color: '#ffffff', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isOpen ? <ChevronDown size={16} color="#71717a" /> : <ChevronRight size={16} color="#71717a" />}
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>
                      {season.nombre || `Temporada ${season.numero}`}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#52525b' }}>
                    {isOpen && episodes.length > 0 ? `${episodes.length} episodios` : ''}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #1e1e1e' }}>
                    {isLoadingEps && (
                      <div style={{ padding: '16px 20px', color: '#52525b', fontSize: '13px' }}>
                        Cargando episodios...
                      </div>
                    )}

                    {!isLoadingEps && episodes.length === 0 && (
                      <div style={{ padding: '16px 20px', color: '#52525b', fontSize: '13px' }}>
                        Sin episodios disponibles.
                      </div>
                    )}

                    {!isLoadingEps && episodes.map((ep, idx) => (
                      <Link
                        key={ep.id}
                        href={`/serie/${id}/episodio/${ep.id}`}
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 20px 12px 48px',
                            borderTop: idx === 0 ? 'none' : '1px solid #1a1a1a',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#52525b', minWidth: '20px' }}>
                              {ep.numero}
                            </span>
                            <Play size={13} color="#52525b" />
                            <span style={{ fontSize: '13px', color: '#d4d4d8' }}>
                              {ep.titulo}
                            </span>
                          </div>
                          {ep.duracion ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} color="#52525b" />
                              <span style={{ fontSize: '12px', color: '#52525b' }}>{ep.duracion} min</span>
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}