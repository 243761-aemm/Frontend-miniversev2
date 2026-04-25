'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Film, User, LogOut, MessageSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import {
    episodesApi, reviewsApi, commentsApi,
    EpisodeAPI, ReviewAPI, CommentAPI,
} from '@/app/lib/api'
import { isLoggedIn, getUsuario, logout } from '@/app/lib/auth'

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:3008'

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'ahora mismo'
    if (minutes < 60) return `hace ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    return `hace ${days}d`
}

function CommentSection({
    reviewId,
    currentUserId,
    token,
}: {
    reviewId: number
    currentUserId: number | null
    token: string | null
}) {
    const [comments, setComments] = useState<CommentAPI[]>([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const socketRef = useRef<Socket | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        commentsApi.getByReview(reviewId)
            .then(setComments)
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [reviewId])

    useEffect(() => {
        if (!token) return

        const socket = io(REALTIME_URL, {
            auth: { token },
        })

        socketRef.current = socket

        socket.emit('join:review', { idResena: reviewId })

        socket.on('new:comment', (comentario: CommentAPI) => {
            setComments((prev) => {
                const exists = prev.some((c) => c.id === comentario.id)
                if (exists) return prev
                return [...prev, comentario]
            })
        })

        return () => {
            socket.emit('leave:review', { idResena: reviewId })
            socket.disconnect()
        }
    }, [reviewId, token])

    useEffect(() => {
        if (!loading) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [comments, loading])

    const handleSubmit = async () => {
        if (!newComment.trim()) return
        setSubmitting(true)
        try {
            await commentsApi.create(newComment.trim(), reviewId)
            setNewComment('')
        } catch {
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await commentsApi.delete(id)
            setComments((prev) => prev.filter((c) => c.id !== id))
        } catch { }
    }

    return (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
            {loading && <p style={{ fontSize: '12px', color: '#52525b' }}>Cargando comentarios...</p>}

            {!loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                    {comments.length === 0 && (
                        <p style={{ fontSize: '12px', color: '#52525b' }}>Sin comentarios aún.</p>
                    )}
                    {comments.map((c) => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <div>
                                <span style={{ fontSize: '12px', color: '#71717a' }}>{timeAgo(c.fechaCreacion)}</span>
                                <p style={{ fontSize: '13px', color: '#d4d4d8', marginTop: '2px', lineHeight: 1.5 }}>{c.contenido}</p>
                            </div>
                            {currentUserId === c.idUsuario && (
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                                >
                                    <Trash2 size={13} color="#52525b" />
                                </button>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            )}

            {currentUserId && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                        style={{
                            flex: 1, backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a',
                            borderRadius: '6px', padding: '7px 10px', fontSize: '13px',
                            color: '#ffffff', outline: 'none', fontFamily: 'inherit',
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !newComment.trim()}
                        style={{
                            padding: '7px 14px', backgroundColor: '#27272a', border: 'none',
                            borderRadius: '6px', fontSize: '13px', color: '#a1a1aa',
                            cursor: submitting ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                        }}
                    >
                        Enviar
                    </button>
                </div>
            )}
        </div>
    )
}

function ReviewCard({
    review,
    currentUserId,
    token,
    onDelete,
}: {
    review: ReviewAPI
    currentUserId: number | null
    token: string | null
    onDelete: (id: number) => void
}) {
    const [showComments, setShowComments] = useState(false)

    return (
        <div style={{ backgroundColor: '#141414', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <User size={15} color="#71717a" />
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>Usuario #{review.idUsuario}</p>
                        <p style={{ fontSize: '11px', color: '#52525b', margin: 0 }}>{timeAgo(review.fechaCreacion)}</p>
                    </div>
                </div>
                {currentUserId === review.idUsuario && (
                    <button
                        onClick={() => onDelete(review.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                        <Trash2 size={14} color="#52525b" />
                    </button>
                )}
            </div>

            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                {review.contenido}
            </p>

            <button
                onClick={() => setShowComments((v) => !v)}
                style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    color: '#71717a', fontSize: '12px', padding: 0,
                }}
            >
                <MessageSquare size={13} />
                Comentarios
                {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showComments && (
                <CommentSection reviewId={review.id} currentUserId={currentUserId} token={token} />
            )}
        </div>
    )
}

export default function EpisodePage() {
    const params = useParams()
    const serieId = Number(params.id)
    const episodeId = Number(params.idEpisodio)

    const [loggedIn, setLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const [episode, setEpisode] = useState<EpisodeAPI | null>(null)
    const [reviews, setReviews] = useState<ReviewAPI[]>([])
    const [loadingEp, setLoadingEp] = useState(true)
    const [loadingReviews, setLoadingReviews] = useState(true)

    const [newReview, setNewReview] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    useEffect(() => {
        const logged = isLoggedIn()
        setLoggedIn(logged)
        if (logged) {
            const u = getUsuario()
            if (u) {
                setUserName(u.nombre)
                setCurrentUserId(u.id)
            }
            setToken(localStorage.getItem('token'))
        }
    }, [])

    useEffect(() => {
        if (!episodeId) return
        episodesApi.getById(episodeId)
            .then(setEpisode)
            .catch(() => { })
            .finally(() => setLoadingEp(false))
    }, [episodeId])

    useEffect(() => {
        if (!episodeId) return
        reviewsApi.getByEpisode(episodeId)
            .then(setReviews)
            .catch(() => { })
            .finally(() => setLoadingReviews(false))
    }, [episodeId])

    const handleLogout = () => {
        logout()
        setLoggedIn(false)
        setUserName('')
        setCurrentUserId(null)
        setToken(null)
    }

    const handleSubmitReview = async () => {
        if (!newReview.trim()) return
        setSubmitting(true)
        setSubmitError('')
        try {
            const created = await reviewsApi.create(newReview.trim(), episodeId)
            setReviews((prev) => [created, ...prev])
            setNewReview('')
        } catch (e: any) {
            setSubmitError(e.message || 'Error al publicar la reseña')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteReview = async (id: number) => {
        try {
            await reviewsApi.delete(id)
            setReviews((prev) => prev.filter((r) => r.id !== id))
        } catch { }
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

            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 64px' }}>
                <Link
                    href={`/serie/${serieId}`}
                    style={{ fontSize: '13px', color: '#52525b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}
                >
                    ← Volver a la serie
                </Link>

                <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '12px', color: '#52525b', marginBottom: '4px' }}>
                        {episode ? `Ep. ${episode.numero} — ${episode.titulo}` : `Episodio ${episodeId}`}
                    </p>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Reseñas</h1>
                </div>

                {loggedIn && (
                    <div style={{ backgroundColor: '#141414', borderRadius: '8px', padding: '20px', border: '1px solid #1e1e1e', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0' }}>
                            Escribe tu reseña
                        </h3>
                        <textarea
                            placeholder="¿Qué te pareció este episodio?"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            rows={4}
                            style={{
                                width: '100%', backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a',
                                borderRadius: '6px', padding: '10px 12px', fontSize: '13px',
                                color: '#ffffff', outline: 'none', resize: 'vertical',
                                fontFamily: 'inherit', boxSizing: 'border-box',
                            }}
                        />
                        {submitError && (
                            <p style={{ fontSize: '12px', color: '#fca5a5', marginTop: '6px' }}>{submitError}</p>
                        )}
                        <button
                            onClick={handleSubmitReview}
                            disabled={submitting || !newReview.trim()}
                            style={{
                                marginTop: '10px', padding: '9px 20px',
                                backgroundColor: submitting || !newReview.trim() ? '#27272a' : '#e11d48',
                                color: submitting || !newReview.trim() ? '#52525b' : '#ffffff',
                                border: 'none', borderRadius: '6px', fontSize: '13px',
                                fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'background 0.15s',
                            }}
                        >
                            {submitting ? 'Publicando...' : 'Publicar reseña'}
                        </button>
                    </div>
                )}

                {!loggedIn && (
                    <div style={{ backgroundColor: '#141414', borderRadius: '8px', padding: '16px 20px', border: '1px solid #1e1e1e', marginBottom: '32px', fontSize: '13px', color: '#71717a' }}>
                        <Link href="/login" style={{ color: '#e11d48', textDecoration: 'none' }}>Inicia sesión</Link>
                        {' '}para escribir una reseña.
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                        {loadingReviews ? 'Cargando reseñas...' : `${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}`}
                    </h2>
                </div>

                {!loadingReviews && reviews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#52525b', fontSize: '14px' }}>
                        Nadie ha reseñado este episodio aún. ¡Sé el primero!
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            currentUserId={currentUserId}
                            token={token}
                            onDelete={handleDeleteReview}
                        />
                    ))}
                </div>
            </div>

            <style>{`input::placeholder, textarea::placeholder { color: #52525b; }`}</style>
        </div>
    )
}