export interface BookReview {
  id: string
  title: string
  book: string
  author: string
  rating: number
  review: string
  image: string | null
  imageName: string | null
  createdAt: string
}

const STORAGE_KEY = 'neobooks_reviews'

export function useReviews() {
  const reviews = useState<BookReview[]>(STORAGE_KEY, () => [])

  function loadReviews() {
    if (import.meta.server) return

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        reviews.value = []
        return
      }

      const parsed = JSON.parse(raw) as BookReview[]
      reviews.value = Array.isArray(parsed) ? parsed : []
    } catch {
      reviews.value = []
    }
  }

  function saveReviews(list: BookReview[]) {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    reviews.value = list
  }

  function addReview(payload: {
    title: string
    book: string
    author: string
    rating: number
    review: string
    image: string | null
    imageName: string | null
  }) {
    const review: BookReview = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      book: payload.book.trim(),
      author: payload.author.trim(),
      rating: Math.max(1, Math.min(5, payload.rating)),
      review: payload.review.trim(),
      image: payload.image,
      imageName: payload.imageName,
      createdAt: new Date().toISOString(),
    }

    const next = [review, ...reviews.value]
    saveReviews(next)
    return review
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  onMounted(() => {
    loadReviews()
  })

  return {
    reviews: readonly(reviews),
    addReview,
    loadReviews,
    formatDate,
  }
}
