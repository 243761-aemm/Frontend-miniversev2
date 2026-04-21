import Link from 'next/link'
import { Serie } from '@/app/lib/data'

interface SerieCardProps {
  serie: Serie
}

export default function SerieCard({ serie }: SerieCardProps) {
  return (
    <Link href={`/serie/${serie.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          cursor: 'pointer',
          aspectRatio: '2/3',
          backgroundColor: '#1a1a1a',
        }}
      >
        {/* Image */}
        <img
          src={serie.image}
          alt={serie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(serie.title)}`
          }}
        />

        {/* Rating badge */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            backgroundColor: 'rgba(0,0,0,0.75)',
            borderRadius: '4px',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {serie.rating.toFixed(1)}
        </div>
      </div>
    </Link>
  )
}
