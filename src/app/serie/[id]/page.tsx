'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Film, Calendar, Monitor, User, LogOut, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { seriesApi, seasonsApi, episodesApi, reviewsApi, commentsApi, SerieAPI, SeasonAPI, EpisodeAPI, ReviewAPI, CommentAPI } from '@/app/lib/api'
import { isLoggedIn, getUsuario, logout, getSession } from '@/app/lib/auth'
import { getSocket, disconnectSocket } from '@/app/lib/socket'

interface SeriePageProps {
  params: Promise<{ id: string }>
}

// Componente de comentarios en tiempo real para una resena
function ReviewComments({ review, loggedIn }: { review: ReviewAPI; loggedIn: boolean }) {
  const [comments, setComments] = useState<CommentAPI[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    commentsApi.getByReview(review.id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false))

    const session = getSession()
    if (!session) return

    const socket = getSocket(session.token)
    socket.emit('join:review', { idResena: review.id })

    socket.on('new:comment', (comentario: CommentAPI) => {
      setComments((prev) => {
        if (prev.some((c) => c.id === comentario.id)) return prev
        return [...prev, comentario]
      })
    })

    return () => {
      socket.emit('leave:review', { idResena: review.id })
      socket.off('new:comment')
    }
  }, [review.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const handleSubmit = async () => {
    if (!newComment.trim() || newComment.trim().length < 2) return
    setSubmitting(true)
    try {
      await commentsApi.create(newComment.trim(), review.id)
      setNewComment('')
    } catch {
      // el comentario llega igual por socket
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2a2a2a' }}>
      {loading ? (
        <p style={{ fontSize: '12px', color: '#71717a' }}>Cargando comentarios...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
          {comments.length === 0 && (
            <p style={{ fontSize: '12px', color: '#71717a' }}>Sin comentarios aun. Se el primero.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '6px', padding: '8px 10px' }}>
              <p style={{ fontSize: '12px', color: '#d4d4d8', margin: 0 }}>{c.contenido}</p>
              <span style={{ fontSize: '10px', color: '#52525b' }}>
                {new Date(c.fechaCreacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {loggedIn && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1, backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a',
              borderRadius: '6px', padding: '7px 10px', fontSize: '12px',
              color: '#ffffff', outline: 'none',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: '#e11d48', border: 'none', borderRadius: '6px',
              padding: '7px 10px', cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1, display: 'flex', alignItems: 'center',
            }}
          >
            <Send size={13} color="#ffffff" />
          </button>
        </div>
      )}

      {!loggedIn && (
        <p style={{ fontSize: '12px', color: '#71717a' }}>Inicia sesion para comentar.</p>
      )}
    </div>
  )
}

// Componente de una resena con toggle de comentarios
function ReviewCard({ review, loggedIn }: { review: ReviewAPI; loggedIn: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '14px 16px', border: '1px solid #2a2a2a' }}>
      <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6, margin: '0 0 10px 0' }}>
        {review.contenido}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#52525b' }}>
          {new Date(review.fechaCreacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: '12px', color: '#a1a1aa',
          }}
        >
          <MessageCircle size={13} />
          {expanded ? 'Ocultar comentarios' : 'Ver comentarios'}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      {expanded && <ReviewComments review={review} loggedIn={loggedIn} />}
    </div>
  )
}

export default function SeriePage({ params }: SeriePageProps) {
  const { id } = React.use(params)
  const router = useRouter()

  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [serie, setSerie] = useState<SerieAPI | null>(null)
  const [seasons, setSeasons] = useState<SeasonAPI[]>([])
  const [episodes, setEpisodes] = useState<EpisodeAPI[]>([])
  const [selectedSeason, setSelectedSeason] = useState<SeasonAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [opinion, setOpinion] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeAPI | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [reviews, setReviews] = useState<ReviewAPI[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewsEpisodeId, setReviewsEpisodeId] = useState<number | null>(null)

  useEffect(() => {
    const logged = isLoggedIn()
    setLoggedIn(logged)
    if (logged) {
      const u = getUsuario()
      if (u) setUserName(u.nombre)
    }
  }, [])

  useEffect(() => {
    const serieId = parseInt(id)
    if (isNaN(serieId)) {
      router.push('/')
      return
    }
    seriesApi.getById(serieId)
      .then(async (data) => {
        setSerie(data)
        const temporadas = await seasonsApi.getBySerie(serieId)
        setSeasons(temporadas)
        if (temporadas.length > 0) setSelectedSeason(temporadas[0])
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!selectedSeason) return
    setLoadingEpisodes(true)
    setSelectedEpisode(null)
    setReviews([])
    setReviewsEpisodeId(null)
    episodesApi.getBySeason(selectedSeason.id)
      .then(setEpisodes)
      .catch(() => setEpisodes([]))
      .finally(() => setLoadingEpisodes(false))
  }, [selectedSeason])

  // Socket para resenas en tiempo real — va en SeriePage porque usa su state
  useEffect(() => {
    if (!reviewsEpisodeId) return

    const session = getSession()
    if (!session) return

    const socket = getSocket(session.token)
    socket.emit('join:episode', { idCapitulo: reviewsEpisodeId })

    socket.on('new:review', (resena: ReviewAPI) => {
      setReviews((prev) => {
        if (prev.some((r) => r.id === resena.id)) return prev
        return [...prev, resena]
      })
    })

    return () => {
      socket.emit('leave:episode', { idCapitulo: reviewsEpisodeId })
      socket.off('new:review')
    }
  }, [reviewsEpisodeId])

  useEffect(() => {
    return () => disconnectSocket()
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUserName('')
  }

  const handleVerResenas = async (ep: EpisodeAPI) => {
    if (reviewsEpisodeId === ep.id) {
      setReviewsEpisodeId(null)
      setReviews([])
      return
    }
    setSelectedEpisode(ep)
    setReviewsEpisodeId(ep.id)
    setLoadingReviews(true)
    try {
      const data = await reviewsApi.getByEpisode(ep.id)
      setReviews(data)
    } catch {
      setReviews([])
    } finally {
      setLoadingReviews(false)
    }
  }

  const handlePublicarResena = async () => {
    if (!loggedIn) { router.push('/login'); return }
    if (!selectedEpisode) { setErrorMsg('Selecciona un episodio para resenar'); return }
    if (opinion.trim().length < 10) { setErrorMsg('La resena debe tener al menos 10 caracteres'); return }

    setSubmitting(true)
    setErrorMsg('')
    try {
      await reviewsApi.create(opinion, selectedEpisode.id)
      setSuccessMsg('Resena publicada correctamente')
      setOpinion('')
      if (reviewsEpisodeId === selectedEpisode.id) {
        const data = await reviewsApi.getByEpisode(selectedEpisode.id)
        setReviews(data)
      }
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al publicar la resena')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#71717a', fontSize: '14px' }}>Cargando serie...</p>
      </div>
    )
  }

  if (!serie) return null

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/login" style={{ padding: '6px 16px', fontSize: '14px', color: '#ffffff', textDecoration: 'none' }}>Iniciar sesion</Link>
            <Link href="/registro" style={{ padding: '6px 16px', fontSize: '14px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '6px', textDecoration: 'none' }}>Registrarse</Link>
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

      <div style={{ paddingTop: '52px' }}>
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          {serie.imagenUrl ? (
            <img src={serie.imagenUrl} alt={serie.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.95) 100%)' }} />
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>{serie.nombre}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#71717a" />
              <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{serie.estreno}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Monitor size={14} color="#71717a" />
              <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{seasons.length} temporadas</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Sinopsis</h2>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6 }}>{serie.sinopsis}</p>
          </div>

          {seasons.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Temporadas y episodios</h2>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season)}
                    style={{
                      padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                      cursor: 'pointer', border: 'none',
                      backgroundColor: selectedSeason?.id === season.id ? '#e11d48' : '#1e1e1e',
                      color: selectedSeason?.id === season.id ? '#ffffff' : '#a1a1aa',
                    }}
                  >
                    T{season.numero}
                  </button>
                ))}
              </div>

              {loadingEpisodes ? (
                <p style={{ color: '#71717a', fontSize: '14px' }}>Cargando episodios...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {episodes.map((ep) => (
                    <div key={ep.id}>
                      <div
                        style={{
                          backgroundColor: selectedEpisode?.id === ep.id ? '#1e1e2e' : '#1a1a1a',
                          border: selectedEpisode?.id === ep.id ? '1px solid #e11d48' : '1px solid #2a2a2a',
                          borderRadius: reviewsEpisodeId === ep.id ? '8px 8px 0 0' : '8px',
                          padding: '12px 16px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}
                          onClick={() => setSelectedEpisode(ep)}
                        >
                          <span style={{ fontSize: '12px', color: '#71717a' }}>E{ep.numero}</span>
                          <span style={{ fontSize: '14px', color: '#d4d4d8' }}>{ep.titulo}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {ep.duracion > 0 && (
                            <span style={{ fontSize: '12px', color: '#71717a' }}>{ep.duracion} min</span>
                          )}
                          <button
                            onClick={() => handleVerResenas(ep)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              background: 'transparent', border: '1px solid #2a2a2a',
                              borderRadius: '6px', padding: '4px 10px',
                              cursor: 'pointer', fontSize: '12px',
                              color: reviewsEpisodeId === ep.id ? '#e11d48' : '#a1a1aa',
                            }}
                          >
                            <MessageCircle size={12} />
                            {reviewsEpisodeId === ep.id ? 'Ocultar' : 'Ver resenas'}
                          </button>
                        </div>
                      </div>

                      {reviewsEpisodeId === ep.id && (
                        <div style={{
                          backgroundColor: '#111111', border: '1px solid #2a2a2a',
                          borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '16px',
                        }}>
                          {loadingReviews ? (
                            <p style={{ fontSize: '13px', color: '#71717a' }}>Cargando resenas...</p>
                          ) : reviews.length === 0 ? (
                            <p style={{ fontSize: '13px', color: '#71717a' }}>
                              Sin resenas aun. Se el primero en escribir una.
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} loggedIn={loggedIn} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {episodes.length === 0 && (
                    <p style={{ color: '#71717a', fontSize: '14px' }}>No hay episodios disponibles para esta temporada.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '72px' }}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px', border: '1px solid #2a2a2a' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              {loggedIn ? 'Escribe tu resena' : 'Inicia sesion para resenar'}
            </h3>

            {selectedEpisode && (
              <div style={{ backgroundColor: '#2a2a2a', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', fontSize: '13px', color: '#a1a1aa' }}>
                E{selectedEpisode.numero} — {selectedEpisode.titulo}
              </div>
            )}

            {!selectedEpisode && loggedIn && (
              <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '12px' }}>
                Selecciona un episodio de la lista para resenarlo.
              </p>
            )}

            {successMsg && (
              <div style={{ backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#86efac' }}>
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            <textarea
              placeholder={loggedIn ? 'Cuentanos que te parecio este episodio...' : 'Inicia sesion para dejar una resena'}
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              disabled={!loggedIn}
              rows={5}
              style={{
                width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a',
                borderRadius: '6px', padding: '10px 12px', fontSize: '13px',
                color: '#ffffff', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', marginBottom: '12px', boxSizing: 'border-box',
                opacity: loggedIn ? 1 : 0.5, cursor: loggedIn ? 'text' : 'not-allowed',
              }}
            />

            <button
              onClick={loggedIn ? handlePublicarResena : () => router.push('/login')}
              disabled={submitting}
              style={{
                width: '100%', padding: '10px',
                backgroundColor: loggedIn ? '#e11d48' : '#3f3f46',
                color: '#ffffff', border: 'none', borderRadius: '6px',
                fontSize: '14px', fontWeight: 500,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Publicando...' : loggedIn ? 'Publicar resena' : 'Iniciar sesion'}
            </button>
          </div>
        </div>
      </div>

      <style>{`input::placeholder { color: #52525b; } textarea::placeholder { color: #52525b; }`}</style>
    </div>
  )
}