<template>
  <div class="library-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-badge">
        <v-icon icon="mdi-library-shelves" size="16" color="#06b6d4" />
        <span>Biblioteca Digital</span>
      </div>
      <h1>Comparte tus <span class="gradient-text">documentos</span></h1>
      <p class="page-desc">
        Sube libros y documentos PDF para que toda la comunidad pueda acceder, descargar y aprender de ellos.
      </p>
    </div>

    <div class="library-layout">
      <!-- Upload Form -->
      <section class="upload-card">
        <div class="section-title-row">
          <h2>Subir documento</h2>
          <v-chip color="cyan" size="small" variant="tonal">
            <v-icon icon="mdi-cloud-upload" start size="14" />
            PDF
          </v-chip>
        </div>

        <v-form class="upload-form" @submit.prevent="submitBook">
          <v-text-field
            v-model="form.title"
            label="Título del libro o documento"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-book-outline"
            required
          />

          <v-text-field
            v-model="form.author"
            label="Autor"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-edit-outline"
            required
          />

          <v-textarea
            v-model="form.description"
            label="Descripción breve"
            variant="outlined"
            rows="3"
            auto-grow
            counter="300"
            maxlength="300"
          />

          <v-select
            v-model="form.categorySlug"
            :items="categoryItems"
            item-title="title"
            item-value="slug"
            label="Categoría"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-shape-outline"
            required
          >
            <template #item="{ item, props: itemProps }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <div
                    class="category-select-icon"
                    :style="{ background: `${item.raw.color}1a`, borderColor: `${item.raw.color}40` }"
                  >
                    <v-icon :icon="item.raw.icon" size="16" :color="item.raw.color" />
                  </div>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <!-- PDF File Upload -->
          <div class="pdf-upload-zone" :class="{ 'has-file': form.fileName }" @click="triggerFileInput">
            <input
              ref="fileInputRef"
              type="file"
              accept=".pdf,application/pdf"
              class="hidden-file-input"
              @change="handleFileUpload"
            />
            <div v-if="!form.fileName" class="upload-placeholder">
              <div class="upload-icon-ring">
                <v-icon icon="mdi-file-pdf-box" size="36" color="red-lighten-1" />
              </div>
              <p class="upload-cta">Haz clic para seleccionar un archivo PDF</p>
              <span class="upload-hint">Tamaño máximo recomendado: 2 MB</span>
            </div>
            <div v-else class="file-selected-info">
              <div class="file-icon-badge">
                <v-icon icon="mdi-file-pdf-box" size="28" color="red-lighten-1" />
              </div>
              <div class="file-details">
                <strong>{{ form.fileName }}</strong>
                <span>{{ formatFileSize(form.fileSize) }}</span>
              </div>
              <v-btn
                icon
                variant="text"
                size="x-small"
                color="grey"
                @click.stop="clearFile"
              >
                <v-icon icon="mdi-close-circle" size="20" />
              </v-btn>
            </div>
          </div>

          <!-- Error message -->
          <v-alert
            v-if="uploadError"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-2"
            closable
            @click:close="uploadError = ''"
          >
            {{ uploadError }}
          </v-alert>

          <!-- Success message -->
          <v-alert
            v-if="showSuccess"
            type="success"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            ¡Documento subido exitosamente!
          </v-alert>

          <v-btn
            type="submit"
            color="cyan"
            size="large"
            rounded="lg"
            block
            prepend-icon="mdi-cloud-upload"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            class="submit-btn"
          >
            Subir a la biblioteca
          </v-btn>
        </v-form>
      </section>

      <!-- Library Feed -->
      <section class="feed-card">
        <div class="section-title-row">
          <h2>Documentos disponibles</h2>
          <v-chip color="purple" size="small" variant="tonal">
            {{ filteredBooks.length }} {{ filteredBooks.length === 1 ? 'documento' : 'documentos' }}
          </v-chip>
        </div>

        <!-- Search & Filter -->
        <div class="feed-toolbar">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Buscar por título, autor..."
            variant="solo-filled"
            flat
            density="compact"
            rounded="lg"
            hide-details
            clearable
            class="feed-search"
          />
        </div>

        <!-- Category Chips Filter -->
        <div class="feed-chips">
          <v-chip
            :variant="filterCategory === 'todas' ? 'flat' : 'tonal'"
            :color="filterCategory === 'todas' ? 'cyan' : undefined"
            size="small"
            class="filter-chip"
            @click="filterCategory = 'todas'"
          >
            Todos
          </v-chip>
          <v-chip
            v-for="cat in categories"
            :key="cat.slug"
            :variant="filterCategory === cat.slug ? 'flat' : 'tonal'"
            :color="filterCategory === cat.slug ? 'cyan' : undefined"
            size="small"
            class="filter-chip"
            @click="filterCategory = cat.slug"
          >
            <v-icon :icon="cat.icon" start size="14" />
            {{ cat.shortTitle }}
          </v-chip>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <v-icon icon="mdi-bookshelf" size="40" color="cyan" />
          </div>
          <p v-if="searchQuery || filterCategory !== 'todas'">
            No se encontraron documentos con esos criterios de búsqueda.
          </p>
          <p v-else>
            Aún no hay documentos en la biblioteca. ¡Sé el primero en compartir!
          </p>
        </div>

        <!-- Books List -->
        <TransitionGroup name="book-list" tag="div" class="books-feed">
          <article v-for="book in filteredBooks" :key="book.id" class="book-item">
            <div class="book-item-header">
              <div
                class="book-cat-icon"
                :style="{ background: getCategoryColor(book.categorySlug) + '1a', borderColor: getCategoryColor(book.categorySlug) + '40' }"
              >
                <v-icon :icon="getCategoryIcon(book.categorySlug)" size="20" :color="getCategoryColor(book.categorySlug)" />
              </div>
              <div class="book-meta-main">
                <h3 class="book-title">{{ book.title }}</h3>
                <div class="book-author-line">
                  <v-icon icon="mdi-account-edit-outline" size="13" class="mr-1" />
                  <span>{{ book.author }}</span>
                </div>
              </div>
              <v-chip size="x-small" variant="tonal" :color="getCategoryColor(book.categorySlug)">
                {{ getCategoryName(book.categorySlug) }}
              </v-chip>
            </div>

            <p v-if="book.description" class="book-description">{{ book.description }}</p>

            <div class="book-file-bar">
              <div class="file-info-pills">
                <span class="pill">
                  <v-icon icon="mdi-file-pdf-box" size="14" color="red-lighten-1" />
                  {{ book.fileName }}
                </span>
                <span class="pill">
                  <v-icon icon="mdi-weight" size="13" />
                  {{ formatFileSize(book.fileSize) }}
                </span>
                <span class="pill">
                  <v-icon icon="mdi-download" size="13" />
                  {{ book.downloads }} {{ book.downloads === 1 ? 'descarga' : 'descargas' }}
                </span>
              </div>
            </div>

            <div class="book-footer">
              <div class="book-upload-info">
                <v-avatar size="24" color="cyan-darken-3" class="mr-2">
                  <span class="avatar-initials">{{ getInitials(book.uploadedBy) }}</span>
                </v-avatar>
                <span class="uploader-name">{{ book.uploadedBy }}</span>
                <span class="upload-date">· {{ formatDate(book.uploadedAt) }}</span>
              </div>
              <div class="book-actions">
                <v-btn
                  variant="tonal"
                  color="cyan"
                  size="small"
                  rounded="lg"
                  prepend-icon="mdi-eye-outline"
                  class="action-btn"
                  @click="viewBook(book)"
                >
                  Ver
                </v-btn>
                <v-btn
                  variant="outlined"
                  color="cyan"
                  size="small"
                  rounded="lg"
                  prepend-icon="mdi-download"
                  class="action-btn"
                  @click="downloadBook(book)"
                >
                  Descargar
                </v-btn>
                <v-btn
                  v-if="currentUser && currentUser.username === book.uploadedBy"
                  variant="text"
                  color="red-lighten-1"
                  size="small"
                  icon
                  @click="confirmDelete(book)"
                >
                  <v-icon icon="mdi-delete-outline" size="18" />
                </v-btn>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </section>
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="delete-dialog-card">
        <v-card-title class="delete-dialog-title">
          <v-icon icon="mdi-alert-circle-outline" color="red-lighten-1" class="mr-2" />
          Eliminar documento
        </v-card-title>
        <v-card-text class="delete-dialog-text">
          ¿Estás seguro de que deseas eliminar <strong>{{ bookToDelete?.title }}</strong>? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="delete-dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" variant="flat" rounded="lg" @click="executeDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCategories, type BookCategory } from '~/composables/useCategories'
import { useLibrary, type LibraryBook } from '~/composables/useLibrary'

const { categories } = useCategories()
const {
  books,
  addBook,
  deleteBook,
  searchBooks,
  downloadBook,
  viewBook,
  formatFileSize,
  formatDate,
} = useLibrary()

const { currentUser } = useAuth()

const searchQuery = ref('')
const filterCategory = ref('todas')
const isSubmitting = ref(false)
const uploadError = ref('')
const showSuccess = ref(false)
const deleteDialog = ref(false)
const bookToDelete = ref<LibraryBook | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  title: '',
  author: '',
  description: '',
  categorySlug: '',
  fileName: '',
  fileSize: 0,
  fileData: '',
})

const categoryItems = computed(() => {
  return categories.value.map((c: BookCategory) => ({
    title: c.title,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
  }))
})

const isFormValid = computed(() => {
  return form.title.trim() && form.author.trim() && form.categorySlug && form.fileData
})

const filteredBooks = computed(() => {
  return searchBooks(searchQuery.value, filterCategory.value)
})

function getCategoryColor(slug: string): string {
  const cat = categories.value.find((c: BookCategory) => c.slug === slug)
  return cat?.color || '#06b6d4'
}

function getCategoryIcon(slug: string): string {
  const cat = categories.value.find((c: BookCategory) => c.slug === slug)
  return cat?.icon || 'mdi-book-outline'
}

function getCategoryName(slug: string): string {
  const cat = categories.value.find((c: BookCategory) => c.slug === slug)
  return cat?.shortTitle || cat?.title || 'Sin categoría'
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U'
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return

  // Validate it's a PDF
  if (file.type !== 'application/pdf') {
    uploadError.value = 'Solo se permiten archivos PDF.'
    return
  }

  // Warn if file is large
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'El archivo supera los 2 MB recomendados. Puede funcionar pero con limitaciones de almacenamiento.'
  }

  form.fileName = file.name
  form.fileSize = file.size

  const reader = new FileReader()
  reader.onload = () => {
    form.fileData = String(reader.result || '')
  }
  reader.onerror = () => {
    uploadError.value = 'Error al leer el archivo. Intenta de nuevo.'
  }
  reader.readAsDataURL(file)
}

function clearFile() {
  form.fileName = ''
  form.fileSize = 0
  form.fileData = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function submitBook() {
  if (!isFormValid.value) return

  uploadError.value = ''
  isSubmitting.value = true

  try {
    addBook({
      title: form.title,
      author: form.author,
      genre: '',
      publishedDate: '',
      description: form.description,
      categorySlug: form.categorySlug,
      fileName: form.fileName,
      fileSize: form.fileSize,
      fileData: form.fileData,
      uploadedBy: currentUser.value?.username || 'Anónimo',
    })

    // Reset form
    form.title = ''
    form.author = ''
    form.description = ''
    form.categorySlug = ''
    clearFile()

    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (e) {
    uploadError.value = 'Error al guardar. El almacenamiento puede estar lleno.'
  }

  setTimeout(() => {
    isSubmitting.value = false
  }, 400)
}

function confirmDelete(book: LibraryBook) {
  bookToDelete.value = book
  deleteDialog.value = true
}

function executeDelete() {
  if (bookToDelete.value) {
    deleteBook(bookToDelete.value.id)
  }
  deleteDialog.value = false
  bookToDelete.value = null
}
</script>

<style scoped>
.library-page {
  padding: 0 18px 48px;
}

/* Header */
.page-header {
  text-align: center;
  padding: 12px 0 28px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.18);
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 2.1rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 10px;
}

.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  max-width: 620px;
  margin: 0 auto;
  color: #94a3b8;
  line-height: 1.6;
}

/* Layout */
.library-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-card,
.feed-card {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.35);
}

.upload-card {
  align-self: flex-start;
  position: sticky;
  top: 80px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-title-row h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
}

/* Upload Form */
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.category-select-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  margin-right: 6px;
}

/* PDF Upload Zone */
.pdf-upload-zone {
  border: 2px dashed rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(6, 182, 212, 0.02);
}

.pdf-upload-zone:hover {
  border-color: rgba(6, 182, 212, 0.4);
  background: rgba(6, 182, 212, 0.05);
}

.pdf-upload-zone.has-file {
  border-color: rgba(6, 182, 212, 0.3);
  border-style: solid;
  background: rgba(6, 182, 212, 0.04);
  padding: 14px 16px;
}

.hidden-file-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.upload-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(239, 83, 80, 0.08);
  border: 1px solid rgba(239, 83, 80, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.upload-cta {
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

.upload-hint {
  color: #64748b;
  font-size: 0.75rem;
}

.file-selected-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid rgba(239, 83, 80, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-details strong {
  display: block;
  color: #f1f5f9;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-details span {
  color: #64748b;
  font-size: 0.75rem;
}

.submit-btn {
  margin-top: 4px;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
}

/* Feed */
.feed-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-toolbar {
  display: flex;
  gap: 10px;
}

.feed-search {
  flex: 1;
}

:deep(.feed-search .v-field) {
  background: rgba(17, 24, 39, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
}

.feed-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-chip {
  cursor: pointer;
  font-size: 0.78rem !important;
  transition: all 0.2s ease !important;
}

.filter-chip:hover {
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 18px;
  color: #94a3b8;
  border: 1px dashed rgba(148, 163, 184, 0.2);
  border-radius: 16px;
}

.empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(6, 182, 212, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}

/* Book Items */
.books-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-item {
  background: rgba(15, 23, 42, 0.58);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-item:hover {
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.book-item-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.book-cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  flex-shrink: 0;
}

.book-meta-main {
  flex: 1;
  min-width: 0;
}

.book-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
  line-height: 1.3;
}

.book-author-line {
  display: flex;
  align-items: center;
  font-size: 0.82rem;
  color: #94a3b8;
}

.book-description {
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0 0 14px;
}

.book-file-bar {
  margin-bottom: 14px;
}

.file-info-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  color: #94a3b8;
}

.book-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.book-upload-info {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}

.avatar-initials {
  font-size: 0.6rem;
  font-weight: 700;
}

.uploader-name {
  color: #cbd5e1;
  font-weight: 600;
}

.upload-date {
  color: #64748b;
  margin-left: 4px;
}

.book-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.78rem !important;
  letter-spacing: 0.01em !important;
}

/* Delete Dialog */
.delete-dialog-card {
  background: rgba(15, 23, 42, 0.98) !important;
  border: 1px solid rgba(239, 68, 68, 0.2) !important;
  border-radius: 20px !important;
}

.delete-dialog-title {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #f1f5f9 !important;
  display: flex;
  align-items: center;
  padding-top: 20px !important;
}

.delete-dialog-text {
  color: #94a3b8 !important;
  font-size: 0.92rem;
  line-height: 1.6;
}

.delete-dialog-actions {
  padding: 12px 20px 16px !important;
}

/* Transitions */
.book-list-enter-active {
  transition: all 0.4s ease-out;
}

.book-list-leave-active {
  transition: all 0.3s ease-in;
}

.book-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.book-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.book-list-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 960px) {
  .library-layout {
    grid-template-columns: 1fr;
  }

  .upload-card {
    position: static;
  }
}

@media (max-width: 600px) {
  .book-item-header {
    flex-wrap: wrap;
  }

  .book-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .book-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
