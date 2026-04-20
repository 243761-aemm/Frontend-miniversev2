'use client'

import { useState } from 'react'
import { genres } from '@/lib/data'

interface GenreFilterProps {
  onFilter?: (genre: string) => void
}

export default function GenreFilter({ onFilter }: GenreFilterProps) {
  const [active, setActive] = useState('Todas')

  const handleClick = (genre: string) => {
    setActive(genre)
    onFilter?.(genre)
  }

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleClick(genre)}
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: active === genre ? '#e11d48' : '#1a1a1a',
            color: active === genre ? '#ffffff' : '#a1a1aa',
            transition: 'background-color 0.15s, color 0.15s',
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}
