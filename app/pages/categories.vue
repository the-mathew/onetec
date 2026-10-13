<template>
  <div class="page-categories">
    <!-- Header Banner -->
    <div class="categories-hero">
      <div class="header-badge">
        <v-icon icon="mdi-shape-outline" size="15" color="cyan" />
        <span>Catálogo Temático</span>
      </div>
      <h1 class="page-title">
        Explora por <span class="gradient-text">Categorías</span>
      </h1>
      <p class="page-subtitle">
        Descubre miles de títulos clasificados por géneros, disciplinas y colecciones especiales.
      </p>

      <!-- Category Filter Bar (Horizontal Chips) -->
      <div class="chips-container">
        <v-slide-group
          v-model="activeChipIndex"
          show-arrows
          class="category-slide-group"
        >
          <!-- 'Todas' Chip -->
          <v-slide-group-item>
            <v-chip
              :variant="activeCategorySlug === 'todas' ? 'flat' : 'tonal'"
              :color="activeCategorySlug === 'todas' ? 'cyan' : undefined"
              class="cat-chip mr-2"
              @click="selectCategory('todas')"
            >
              <v-icon icon="mdi-view-grid-outline" start size="16" />
              <span>Todas ({{ totalBooksCount }})</span>
            </v-chip>
          </v-slide-group-item>

          <!-- Specific Category Chips -->
          <v-slide-group-item
            v-for="cat in categories"
            :key="cat.slug"
          >
            <v-chip
              :variant="activeCategorySlug === cat.slug ? 'flat' : 'tonal'"
              :color="activeCategorySlug === cat.slug ? 'cyan' : undefined"
              class="cat-chip mr-2"
              @click="selectCategory(cat.slug)"
            >
              <v-icon :icon="cat.icon" start size="16" :color="activeCategorySlug === cat.slug ? undefined : cat.color" />
              <span>{{ cat.shortTitle || cat.title }}</span>
            </v-chip>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </div>

    <!-- Active Category Banner Info -->
    <v-card class="active-category-card" elevation="4">
      <div class="active-card-content">
        <div
          class="category-icon-wrapper"
          :style="{
            background: activeCategory ? `${activeCategory.color}18` : 'rgba(6, 182, 212, 0.12)',
            borderColor: activeCategory ? `${activeCategory.color}40` : 'rgba(6, 182, 212, 0.3)',
            boxShadow: activeCategory ? `0 0 24px ${activeCategory.color}25` : 'none',
          }"
        >
          <v-icon
            :icon="activeCategory ? activeCategory.icon : 'mdi-bookshelf'"
            size="36"
            :color="activeCategory ? activeCategory.color : 'cyan'"
          />
        </div>

        <div class="category-info-body">
          <div class="d-flex align-center flex-wrap gap-2 mb-2">
            <h2 class="active-cat-title">
              {{ activeCategory ? activeCategory.title : 'Todas las Categorías' }}
            </h2>
            <v-chip
              size="small"
              :color="activeCategory ? activeCategory.color : 'cyan'"
              variant="tonal"
              class="font-weight-bold"
            >
              {{ activeCategory ? activeCategory.badge : `${totalBooksCount} títulos en total` }}
            </v-chip>
          </div>

          <p class="active-cat-desc">
            {{
              activeCategory
                ? activeCategory.description
                : 'Navega libremente por todos los títulos disponibles en NEO BOOKS o selecciona una temática específica arriba para ver colecciones dedicadas.'
            }}
          </p>

          <!-- Tags associated with category -->
          <div v-if="activeCategory && activeCategory.tags.length" class="category-tags-list">
            <span class="tags-label">Temas destacados:</span>
            <v-chip
              v-for="tag in activeCategory.tags"
              :key="tag"
              size="x-small"
              variant="outlined"
              class="tag-chip"
            >
              #{{ tag }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Search and Quick Filter Toolbar -->
    <div class="categories-toolbar">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar libros en esta categoría..."
        variant="solo-filled"
        flat
        density="comfortable"
        rounded="lg"
        hide-details
        class="search-input-field"
        clearable
      />
      <div class="toolbar-actions">
        <v-btn
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-filter-variant"
          class="filter-action-btn"
          size="comfortable"
        >
          Filtros avanzados
        </v-btn>
        <v-btn
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-sort-ascending"
          class="filter-action-btn"
          size="comfortable"
        >
          Más recientes
        </v-btn>
      </div>
    </div>

    <!-- Category Grid Display (When 'Todas' or Cards) -->
    <div v-if="activeCategorySlug === 'todas'" class="all-categories-grid">
      <v-card
        v-for="cat in filteredCategories"
        :key="cat.slug"
        class="cat-grid-card"
        @click="selectCategory(cat.slug)"
        rounded="xl"
      >
        <div class="cat-card-header">
          <div
            class="cat-icon-badge"
            :style="{ background: `${cat.color}15`, borderColor: `${cat.color}35` }"
          >
            <v-icon :icon="cat.icon" size="24" :color="cat.color" />
          </div>
          <v-chip size="x-small" :color="cat.color" variant="tonal">
            {{ cat.badge }}
          </v-chip>
        </div>
        <h3 class="cat-card-title">{{ cat.title }}</h3>
        <p class="cat-card-desc">{{ cat.description }}</p>
        <div class="cat-card-footer">
          <span class="explore-text" :style="{ color: cat.color }">
            Explorar categoría
            <v-icon icon="mdi-arrow-right" size="14" class="ml-1" />
          </span>
        </div>
      </v-card>
    </div>

    <!-- Books in selected category -->
    <div v-if="activeCategorySlug !== 'todas'" class="category-books-section">
      <div class="books-section-header">
        <h2 class="books-section-title">
          <v-icon icon="mdi-file-pdf-box" size="22" color="red-lighten-1" class="mr-2" />
          Documentos en esta categoría
        </h2>
        <v-btn
          variant="tonal"
          color="cyan"
          size="small"
          rounded="lg"
          prepend-icon="mdi-library-shelves"
          to="/library"
          class="goto-library-btn"
        >
          Ir a la Biblioteca
        </v-btn>
      </div>

      <div v-if="categoryBooks.length === 0" class="no-books-state">
        <v-icon icon="mdi-book-off-outline" size="36" color="grey" />
        <p>Aún no se han subido documentos en esta categoría.</p>
        <v-btn
          variant="outlined"
          color="cyan"
          size="small"
          rounded="lg"
          prepend-icon="mdi-cloud-upload"
          to="/library"
        >
          Subir un documento
        </v-btn>
      </div>

      <div v-else class="category-books-grid">
        <div v-for="book in categoryBooks" :key="book.id" class="cat-book-card">
          <div class="cat-book-icon">
            <v-icon icon="mdi-file-pdf-box" size="28" color="red-lighten-1" />
          </div>
          <div class="cat-book-info">
            <h4>{{ book.title }}</h4>
            <span class="cat-book-author">{{ book.author }}</span>
            <p v-if="book.description" class="cat-book-desc">{{ book.description }}</p>
            <div class="cat-book-meta">
              <span>{{ formatFileSize(book.fileSize) }}</span>
              <span>·</span>
              <span>{{ book.downloads }} descargas</span>
              <span>·</span>
              <span>{{ formatDate(book.uploadedAt) }}</span>
            </div>
          </div>
          <div class="cat-book-actions">
            <v-btn variant="tonal" color="cyan" size="small" rounded="lg" icon @click="viewBook(book)">
              <v-icon icon="mdi-eye-outline" size="18" />
            </v-btn>
            <v-btn variant="outlined" color="cyan" size="small" rounded="lg" icon @click="downloadBook(book)">
              <v-icon icon="mdi-download" size="18" />
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick links box -->
    <div class="content-ready-box">
      <div class="ready-icon-pulse">
        <v-icon icon="mdi-library-shelves" size="32" color="cyan" />
      </div>
      <div class="ready-text">
        <h3>Biblioteca Digital Disponible</h3>
        <p>
          Sube documentos PDF y compártelos con la comunidad. Filtra por categoría o busca por título y autor.
        </p>
      </div>
      <v-btn
        color="cyan"
        variant="tonal"
        rounded="lg"
        prepend-icon="mdi-cloud-upload"
        to="/library"
        class="action-features-btn"
      >
        Ir a la Biblioteca
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories } from '~/composables/useCategories'
import { useLibrary } from '~/composables/useLibrary'

const route = useRoute()
const router = useRouter()
const { categories } = useCategories()
const { getBooksByCategory, downloadBook, viewBook, formatFileSize, formatDate } = useLibrary()

const searchQuery = ref('')
const activeChipIndex = ref(null)

const activeCategorySlug = computed(() => {
  return (route.query.cat as string) || 'todas'
})

const activeCategory = computed(() => {
  if (activeCategorySlug.value === 'todas') return null
  return categories.value.find((c) => c.slug === activeCategorySlug.value) || null
})

const totalBooksCount = computed(() => '6.8k')

const categoryBooks = computed(() => {
  return getBooksByCategory(activeCategorySlug.value)
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const q = searchQuery.value.toLowerCase().trim()
  return categories.value.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  )
})

function selectCategory(slug: string) {
  if (slug === 'todas') {
    router.push({ query: {} })
  } else {
    router.push({ query: { cat: slug } })
  }
}
</script>

<style scoped>
.page-categories {
  padding: 36px 24px 60px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Hero Section */
.categories-hero {
  text-align: center;
  margin-bottom: 32px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.76rem;
  color: #06b6d4;
  font-weight: 500;
  margin-bottom: 14px;
  letter-spacing: 0.02em;
}

.page-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 10px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 0.98rem;
  max-width: 580px;
  margin: 0 auto 24px;
  line-height: 1.55;
}

/* Horizontal Chips Group */
.chips-container {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.category-slide-group {
  max-width: 100%;
}

.cat-chip {
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  height: 36px !important;
  padding: 0 14px !important;
  cursor: pointer;
  transition: all 0.2s ease !important;
  border-radius: 100px !important;
}

.cat-chip:hover {
  transform: translateY(-1px);
}

/* Active Category Card */
.active-category-card {
  background: rgba(17, 24, 39, 0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 20px !important;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.active-card-content {
  display: flex;
  align-items: flex-start;
  gap: 22px;
}

.category-icon-wrapper {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.category-info-body {
  flex: 1;
}

.active-cat-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.active-cat-desc {
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0 0 12px;
}

.category-tags-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tags-label {
  font-size: 0.74rem;
  color: #64748b;
  font-weight: 600;
}

.tag-chip {
  font-size: 0.72rem !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #cbd5e1 !important;
}

/* Toolbar */
.categories-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.search-input-field {
  flex: 1;
  min-width: 260px;
}

:deep(.search-input-field .v-field) {
  background: rgba(17, 24, 39, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
  color: #f1f5f9;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.filter-action-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0.01em !important;
  color: #94a3b8 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.filter-action-btn:hover {
  color: #06b6d4 !important;
  border-color: rgba(6, 182, 212, 0.3) !important;
}

/* All Categories Grid */
.all-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}

.cat-grid-card {
  background: rgba(17, 24, 39, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.cat-grid-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.25) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.08) !important;
}

.cat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cat-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.cat-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 6px;
}

.cat-card-desc {
  font-size: 0.84rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 16px;
  min-height: 40px;
}

.cat-card-footer {
  display: flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 600;
}

.explore-text {
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s;
}

.cat-grid-card:hover .explore-text {
  transform: translateX(4px);
}

/* Category Books Section */
.category-books-section {
  margin-top: 28px;
  margin-bottom: 20px;
}

.books-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.books-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  margin: 0;
}

.goto-library-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
}

.no-books-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 20px;
  border: 1px dashed rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  text-align: center;
  color: #94a3b8;
}

.no-books-state p {
  margin: 0;
  font-size: 0.88rem;
}

.category-books-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cat-book-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 16px;
  padding: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-book-card:hover {
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.cat-book-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(239, 83, 80, 0.08);
  border: 1px solid rgba(239, 83, 80, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-book-info {
  flex: 1;
  min-width: 0;
}

.cat-book-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 3px;
}

.cat-book-author {
  font-size: 0.82rem;
  color: #67e8f9;
  font-weight: 500;
}

.cat-book-desc {
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 6px 0 0;
}

.cat-book-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 8px;
}

.cat-book-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

/* Content Ready Box */
.content-ready-box {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(6, 182, 212, 0.04);
  border: 1px dashed rgba(6, 182, 212, 0.25);
  border-radius: 16px;
  padding: 20px 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.ready-icon-pulse {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(6, 182, 212, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ready-text {
  flex: 1;
  min-width: 240px;
}

.ready-text h3 {
  font-size: 0.98rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
}

.ready-text p {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.action-features-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
}

@media (max-width: 600px) {
  .active-card-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .active-cat-title {
    justify-content: center;
  }
  .category-tags-list {
    justify-content: center;
  }
  .cat-book-card {
    flex-direction: column;
    align-items: stretch;
  }
  .cat-book-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
