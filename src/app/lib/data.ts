export type Serie = {
  id: string
  title: string
  rating: number
  reviewCount: number
  year: number
  seasons: number
  genres: string[]
  synopsis: string
  image: string
  backdropImage?: string
}

export type Review = {
  id: string
  serieId: string
  author: string
  date: string
  rating: number
  content: string
}

export const genres = [
  'Todas',
  'Anime',
  'Ciencia Ficción',
  'Crimen',
  'Drama',
  'Drama Histórico',
  'Fantasía',
  'Terror',
  'Thriller',
]

export const series: Serie[] = [
  {
    id: 'dark',
    title: 'Dark',
    rating: 4.8,
    reviewCount: 124,
    year: 2017,
    seasons: 3,
    genres: ['Ciencia Ficción', 'Thriller'],
    synopsis: 'Una conexión de desapariciones de niños desencadena una serie de sucesos en cuatro familias de la ciudad de Winden, revelando las complicadas relaciones entre el pasado y el futuro.',
    image: 'https://image.tmdb.org/t/p/w500/apbrbWs82d2oUWnMGPYIe5j4sPl.jpg',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    rating: 4.5,
    reviewCount: 98,
    year: 2016,
    seasons: 4,
    genres: ['Ciencia Ficción', 'Terror'],
    synopsis: 'En un pequeño pueblo, la desaparición de un niño desencadena una serie de sucesos sobrenaturales que involucran experimentos secretos del gobierno y criaturas de otra dimensión.',
    image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  },
  {
    id: 'game-of-thrones',
    title: 'Game of Thrones',
    rating: 4.2,
    reviewCount: 1,
    year: 2011,
    seasons: 8,
    genres: ['Fantasía', 'Drama'],
    synopsis: 'Nueve familias nobles luchan por el control de las tierras míticas de Poniente. Un antiguo enemigo regresa después de estar inactivo durante milenios. Traiciones, intrigas y batallas épicas definen esta historia medieval de fantasía.',
    image: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdropImage: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
  },
  {
    id: 'the-wire',
    title: 'The Wire',
    rating: 4.7,
    reviewCount: 56,
    year: 2002,
    seasons: 5,
    genres: ['Crimen', 'Drama'],
    synopsis: 'Un retrato realista de la ciudad de Baltimore visto a través del prisma del crimen organizado, las fuerzas del orden y los diferentes estratos sociales.',
    image: 'https://image.tmdb.org/t/p/w500/4lbClFySvugI51fwsyxBTOm4DqK.jpg',
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    rating: 4.4,
    reviewCount: 72,
    year: 2016,
    seasons: 6,
    genres: ['Drama Histórico', 'Drama'],
    synopsis: 'La historia del reinado de la reina Isabel II y los momentos históricos más importantes de la monarquía británica a lo largo de las décadas.',
    image: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
  },
  {
    id: 'squid-game',
    title: 'Squid Game',
    rating: 4.6,
    reviewCount: 88,
    year: 2021,
    seasons: 2,
    genres: ['Thriller', 'Drama'],
    synopsis: 'Cientos de jugadores con problemas financieros aceptan una extraña invitación para competir en unos juegos infantiles. Un tentador premio los espera, pero las consecuencias de perder son mortales.',
    image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93X2Fe7HeBskp5.jpg',
  },
  {
    id: 'peaky-blinders',
    title: 'Peaky Blinders',
    rating: 4.5,
    reviewCount: 91,
    year: 2013,
    seasons: 6,
    genres: ['Drama Histórico', 'Crimen'],
    synopsis: 'La historia de una familia de gánsteres de Birmingham en la época posterior a la Primera Guerra Mundial y sus conflictos con la ley y otras bandas criminales.',
    image: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVn3nyfYjLp.jpg',
  },
  {
    id: 'altered-carbon',
    title: 'Altered Carbon',
    rating: 4.8,
    reviewCount: 43,
    year: 2018,
    seasons: 2,
    genres: ['Ciencia Ficción', 'Thriller'],
    synopsis: 'En un futuro distante, la conciencia puede transferirse a distintos cuerpos. Un ex soldado es resucitado para resolver un crimen en una sociedad dominada por los ultrarricos.',
    image: 'https://image.tmdb.org/t/p/w500/rT0NSRmAEmxIUPkujqSmA8PJVSB.jpg',
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    serieId: 'game-of-thrones',
    author: 'Javier Torres',
    date: '29 de enero de 2026',
    rating: 4,
    content: 'Las primeras temporadas son magistrales. El final fue decepcionante pero el viaje valió la pena.',
  },
]

export function getSerieById(id: string): Serie | undefined {
  return series.find((s) => s.id === id)
}

export function getReviewsBySerieId(serieId: string): Review[] {
  return reviews.filter((r) => r.serieId === serieId)
}
