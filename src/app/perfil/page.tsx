'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Film, User, LogOut, Mail, Calendar, Pencil, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { userApi, reviewsApi, UserAPI, ReviewAPI } from '@/app/lib/api'
import { getUsuario, logout, isLoggedIn } from '@/app/lib/auth'

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserAPI | null>(null)
  const [reviews, setReviews] = useState<ReviewAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edición de nombre
  const [editingNombre, setEditingNombre] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [savingNombre, setSavingNombre] = useState(false)

  // Confirmación eliminar cuenta
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [userData, reviewsData] = await Promise.all([
          userApi.getProfile(),
          reviewsApi.getMyReviews(),
        ])
        setUser(userData)
        setNuevoNombre(userData.nombre)
        setReviews(reviewsData)
      } catch (err: any) {
        setError(err.message || 'Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveNombre = async () => {
    if (!nuevoNombre.trim() || nuevoNombre === user?.nombre) {
      setEditingNombre(false)
      return
    }
    setSavingNombre(true)
    try {
      const updated = await userApi.update({ nombre: nuevoNombre.trim() })
      setUser(updated)
      setEditingNombre(false)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el nombre')
    } finally {
      setSavingNombre(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await userApi.delete()
      logout()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la cuenta')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: '14px' }}>
        Cargando perfil...
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      {/* NAVBAR */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a',
          height: '52px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: '#ffffff', textDecoration: 'none' }}>
          <Film size={20} />
          Miniverse
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#a1a1aa', textDecoration: 'none' }}>
            <User size={16} color="#a1a1aa" />
            {user?.nombre}
          </Link>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogOut size={16} color="#a1a1aa" />
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '72px 24px 48px' }}>

        {/* Error banner */}
        {error && (
          <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px', fontSize: '14px', color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Profile card */}
        <div style={{ backgroundColor: '#141414', borderRadius: '10px', padding: '32px', marginBottom: '16px', border: '1px solid #1e1e1e' }}>
          {/* Avatar */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <User size={32} color="#71717a" />
          </div>

          {/* Nombre editable */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {editingNombre ? (
              <>
                <input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  style={{
                    backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px',
                    padding: '4px 8px', fontSize: '18px', fontWeight: 700, color: '#ffffff', outline: 'none',
                  }}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNombre(); if (e.key === 'Escape') setEditingNombre(false) }}
                />
                <button onClick={handleSaveNombre} disabled={savingNombre} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Check size={16} color="#22c55e" />
                </button>
                <button onClick={() => setEditingNombre(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={16} color="#71717a" />
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>{user?.nombre}</span>
                <button onClick={() => setEditingNombre(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}>
                  <Pencil size={14} color="#71717a" />
                </button>
              </>
            )}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Mail size={14} color="#71717a" />
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{user?.correo}</span>
          </div>

          {/* Edad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px' }}>
            <Calendar size={14} color="#71717a" />
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{user?.edad} años</span>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{reviews.length}</div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>Reseñas publicadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>#{user?.id}</div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>ID de usuario</div>
            </div>
          </div>
        </div>

        {/* Mis reseñas */}
        <div style={{ backgroundColor: '#141414', borderRadius: '10px', padding: '32px', marginBottom: '16px', border: '1px solid #1e1e1e' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Mis reseñas</h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '20px' }}>Aún no has publicado ninguna reseña</p>
              <Link href="/" style={{ display: 'inline-block', padding: '8px 20px', border: '1px solid #ffffff', borderRadius: '6px', color: '#ffffff', fontSize: '14px', textDecoration: 'none' }}>
                Explorar series
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((review) => (
                <div key={review.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a2a' }}>
                  <p style={{ fontSize: '14px', color: '#d4d4d8', marginBottom: '8px', lineHeight: 1.5 }}>
                    {review.contenido}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#71717a' }}>
                      {formatDate(review.fechaCreacion)} · Episodio #{review.idCapitulo}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await reviewsApi.delete(review.id)
                          setReviews((prev) => prev.filter((r) => r.id !== review.id))
                        } catch (err: any) {
                          setError(err.message || 'Error al eliminar la reseña')
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#ef4444' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zona de peligro */}
        <div style={{ backgroundColor: '#141414', borderRadius: '10px', padding: '24px', border: '1px solid #3f1e1e' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#ef4444' }}>Zona de peligro</h2>
          <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>
            Eliminar tu cuenta es una acción permanente. Se borrarán todos tus datos.
          </p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                padding: '8px 20px', backgroundColor: 'transparent',
                border: '1px solid #ef4444', borderRadius: '6px',
                color: '#ef4444', fontSize: '14px', cursor: 'pointer',
              }}
            >
              Eliminar cuenta
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>¿Estás seguro?</span>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ padding: '6px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '13px', cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ padding: '6px 16px', backgroundColor: 'transparent', border: '1px solid #3f3f46', borderRadius: '6px', color: '#a1a1aa', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}