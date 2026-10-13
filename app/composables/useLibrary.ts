export interface LibraryBook {
  id: string
  title: string
  author: string
  genre: string
  publishedDate: string
  description: string
  categorySlug: string
  fileName: string
  fileSize: number
  fileData: string // base64 data URL
  uploadedBy: string
  uploadedAt: string
  downloads: number
}

const STORAGE_KEY = 'neobooks_library'

// Global reactive state
const books = ref<LibraryBook[]>([])
const isLoaded = ref(false)

function loadFromStorage() {
  if (import.meta.server) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    books.value = raw ? JSON.parse(raw) : []
  } catch {
    books.value = []
  }
  isLoaded.value = true
}

function saveToStorage() {
  if (import.meta.server) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  } catch (e) {
    console.error('Error saving library to localStorage. Storage may be full.', e)
  }
}

export function useLibrary() {
  // Load on first use
  if (!isLoaded.value) {
    loadFromStorage()
  }

  function addBook(payload: {
    title: string
    author: string
    genre: string
    publishedDate: string
    description: string
    categorySlug: string
    fileName: string
    fileSize: number
    fileData: string
    uploadedBy: string
  }): LibraryBook {
    const book: LibraryBook = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      author: payload.author.trim(),
      genre: payload.genre.trim(),
      publishedDate: payload.publishedDate,
      description: payload.description.trim(),
      categorySlug: payload.categorySlug,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileData: payload.fileData,
      uploadedBy: payload.uploadedBy.trim(),
      uploadedAt: new Date().toISOString(),
      downloads: 0,
    }

    books.value = [book, ...books.value]
    saveToStorage()
    return book
  }

  function deleteBook(id: string) {
    books.value = books.value.filter((b) => b.id !== id)
    saveToStorage()
  }

  function getBooksByCategory(slug: string): LibraryBook[] {
    if (!slug || slug === 'todas') return books.value
    return books.value.filter((b) => b.categorySlug === slug)
  }

  function searchBooks(query: string, categorySlug?: string): LibraryBook[] {
    let result = categorySlug && categorySlug !== 'todas'
      ? books.value.filter((b) => b.categorySlug === categorySlug)
      : [...books.value]

    if (query && query.trim()) {
      const q = query.toLowerCase().trim()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.fileName.toLowerCase().includes(q)
      )
    }

    return result
  }

  function incrementDownloads(id: string) {
    const book = books.value.find((b) => b.id === id)
    if (book) {
      book.downloads++
      saveToStorage()
    }
  }

  function downloadBook(book: LibraryBook) {
    incrementDownloads(book.id)

    // Create a temporary link to trigger download
    const link = document.createElement('a')
    link.href = book.fileData
    link.download = book.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function viewBook(book: LibraryBook) {
    incrementDownloads(book.id)

    // Open in new tab
    const newTab = window.open()
    if (newTab) {
      newTab.document.write(
        `<html><head><title>${book.title} — NEO BOOKS</title><style>body{margin:0;background:#0a0a0a;}</style></head><body><embed src="${book.fileData}" type="application/pdf" width="100%" height="100%" style="position:fixed;inset:0;"></body></html>`
      )
      newTab.document.close()
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  // Ensure loaded on mount (SSR safety)
  onMounted(() => {
    if (!isLoaded.value) {
      loadFromStorage()
    }
  })

  return {
    books: readonly(books),
    addBook,
    deleteBook,
    getBooksByCategory,
    searchBooks,
    incrementDownloads,
    downloadBook,
    viewBook,
    formatFileSize,
    formatDate,
  }
}
