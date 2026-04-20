'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, Star, Calendar, Monitor, Tag, User, LogOut } from 'lucide-react'
import { getSerieById, getReviewsBySerieId } from '@/lib/data'
import { notFound } from 'next/navigation'

interface SeriePageProps {
  params: { id: string }
}

export default function SeriePage({ params }: SeriePageProps) {
  const serie = getSerieById(params.id)
  if (!serie) notFound()

  const reviews = getReviewsBySerieId(params.id)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [opinion, setOpinion] = useState('')

  const displayRating = hoveredRating || userRating

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
            aaaa
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut size={16} color="#a1a1aa" />
          </Link>
        </div>
      </nav>

      {/* HERO BACKDROP */}
      <div style={{ paddingTop: '52px' }}>
        <div
          style={{
            position: 'relative',
            height: '300px',
            overflow: 'hidden',
          }}
        >
          <img
            src={serie.backdropImage || serie.image}
            alt={serie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.95) 100%)',
            }}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* Title */}
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', marginTop: '24px' }}>
            {serie.title}
          </h1>

          {/* Meta info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} fill="#facc15" color="#facc15" />
              <span style={{ fontSize: '14px', color: '#facc15', fontWeight: 600 }}>
                {serie.rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '13px', color: '#71717a' }}>
                ({reviews.length} reseñas)
              </span>
            </div>

            {/* Year */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#71717a" />
              <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{serie.year}</span>
            </div>

            {/* Seasons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Monitor size={14} color="#71717a" />
              <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{serie.seasons} temporadas</span>
            </div>

            {/* Genres */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={14} color="#71717a" />
              <span style={{ fontSize: '14px', color: '#a1a1aa' }}>{serie.genres.join(', ')}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Sinopsis</h2>
            <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6 }}>{serie.synopsis}</p>
          </div>

          {/* Reviews section */}
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
            Reseñas de usuarios ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p style={{ color: '#71717a', fontSize: '14px' }}>
              No hay reseñas todavía. ¡Sé el primero en opinar!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{review.author}</span>
                      <p style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>
                        {review.date}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        backgroundColor: '#2a2a2a',
                        borderRadius: '4px',
                        padding: '3px 8px',
                      }}
                    >
                      <Star size={12} fill="#facc15" color="#facc15" />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{review.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#d4d4d8', marginTop: '8px', lineHeight: 1.5 }}>
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Write review */}
        <div style={{ position: 'sticky', top: '72px' }}>
          <div
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #2a2a2a',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              Escribe tu reseña
            </h3>

            {/* Star rating input */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>
                Tu calificación
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={star <= displayRating ? '#facc15' : 'none'}
                    stroke={star <= displayRating ? '#facc15' : '#52525b'}
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setUserRating(star)}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Opinion textarea */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>
                Tu opinión
              </p>
              <textarea
                placeholder="Cuéntanos qué te pareció esta serie..."
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Submit button */}
            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#3f3f46',
                color: '#a1a1aa',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Publicar reseña
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
