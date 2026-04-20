'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating?: number
  interactive?: boolean
  size?: number
  onRate?: (rating: number) => void
}

export default function StarRating({
  rating = 0,
  interactive = false,
  size = 16,
  onRate,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(rating)

  const displayRating = interactive ? (hovered || selected) : rating

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= displayRating ? '#facc15' : 'none'}
          stroke={star <= displayRating ? '#facc15' : '#52525b'}
          strokeWidth="1.5"
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => {
            if (interactive) {
              setSelected(star)
              onRate?.(star)
            }
          }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}
