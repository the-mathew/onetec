export interface BookCategory {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  icon: string
  color: string
  badge: string
  tags: string[]
}

export const bookCategories: BookCategory[] = [
  {
    id: '1',
    slug: 'ciencia-ficcion',
    title: 'Ciencia Ficción & Fantasía',
    shortTitle: 'Ciencia Ficción',
    description: 'Explora universos alternos, futuros distópicos, viajes interestelares y mundos de magia y fantasía épica.',
    icon: 'mdi-rocket-launch-outline',
    color: '#06b6d4',
    badge: '1.2k libros',
    tags: ['Cyberpunk', 'Space Opera', 'Distopía', 'Fantasía Épica', 'Multiverso'],
  },
  {
    id: '2',
    slug: 'tecnologia',
    title: 'Tecnología & Programación',
    shortTitle: 'Tecnología',
    description: 'Desarrollo web, inteligencia artificial, ingeniería de software, ciberseguridad y arquitectura en la nube.',
    icon: 'mdi-laptop-code',
    color: '#8b5cf6',
    badge: '980 libros',
    tags: ['JavaScript', 'Python', 'Machine Learning', 'Cloud', 'DevOps'],
  },
  {
    id: '3',
    slug: 'literatura',
    title: 'Literatura & Clásicos',
    shortTitle: 'Literatura',
    description: 'Las obras cumbres de las letras universales, novelas contemporáneas, poesía selecta y narrativa hispana.',
    icon: 'mdi-book-open-page-variant-outline',
    color: '#10b981',
    badge: '2.5k libros',
    tags: ['Novela', 'Poesía', 'Clásicos', 'Realismo Mágico', 'Ensayo'],
  },
  {
    id: '4',
    slug: 'historia',
    title: 'Historia & Biografías',
    shortTitle: 'Historia',
    description: 'Crónicas de civilizaciones antiguas, guerras, hitos que transformaron a la humanidad y biografías de líderes.',
    icon: 'mdi-history',
    color: '#f59e0b',
    badge: '750 libros',
    tags: ['Historia Universal', 'Biografías', 'Guerras Mundiales', 'Arqueología'],
  },
  {
    id: '5',
    slug: 'filosofia',
    title: 'Filosofía & Pensamiento',
    shortTitle: 'Filosofía',
    description: 'Cuestionamientos existenciales, ética, epistemología, lógica y las grandes corrientes filosóficas de la historia.',
    icon: 'mdi-brain',
    color: '#ec4899',
    badge: '430 libros',
    tags: ['Ética', 'Existencialismo', 'Estoicismo', 'Epistemología', 'Lógica'],
  },
  {
    id: '6',
    slug: 'desarrollo-personal',
    title: 'Desarrollo Personal & Negocios',
    shortTitle: 'Desarrollo Personal',
    description: 'Productividad, hábitos atómicos, mentalidad de éxito, liderazgo, finanzas personales y emprendimiento.',
    icon: 'mdi-trending-up',
    color: '#3b82f6',
    badge: '890 libros',
    tags: ['Hábitos', 'Productividad', 'Finanzas', 'Liderazgo', 'Mindset'],
  },
]

export function useCategories() {
  const categories = ref<BookCategory[]>(bookCategories)

  function getCategoryBySlug(slug: string): BookCategory | undefined {
    return categories.value.find((c) => c.slug.toLowerCase() === (slug || '').toLowerCase())
  }

  return {
    categories: readonly(categories),
    getCategoryBySlug,
  }
}
