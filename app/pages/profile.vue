<template>
  <div class="profile-page">

    <!-- Redirect if not logged in -->
    <div v-if="!currentUser" class="not-logged-in">
      <div class="not-logged-icon-wrap">
        <v-icon icon="mdi-account-lock-outline" size="48" color="cyan" />
      </div>
      <h2>Acceso restringido</h2>
      <p>Debes iniciar sesión para ver tu perfil.</p>
      <v-btn to="/login" color="cyan" variant="flat" rounded="lg" prepend-icon="mdi-login">
        Iniciar sesión
      </v-btn>
    </div>

    <template v-else>
      <!-- Hero / Profile Header -->
      <div class="profile-hero">
        <div class="hero-orbs">
          <div class="hero-orb hero-orb-1"></div>
          <div class="hero-orb hero-orb-2"></div>
        </div>
        <div class="profile-hero-content">
          <div class="profile-avatar-ring">
            <v-icon
              :icon="currentUser.role === 'docente' ? 'mdi-school' : 'mdi-account-school'"
              size="40"
              :color="currentUser.role === 'docente' ? 'cyan' : 'purple'"
            />
          </div>
          <div class="profile-hero-text">
            <h1 class="profile-name">{{ currentUser.username }}</h1>
            <div class="profile-role-badge" :class="currentUser.role === 'docente' ? 'badge-docente' : 'badge-estudiante'">
              <v-icon
                :icon="currentUser.role === 'docente' ? 'mdi-shield-crown-outline' : 'mdi-book-open-variant'"
                size="14"
                class="mr-1"
              />
              {{ currentUser.role === 'docente' ? 'Docente' : 'Estudiante' }}
            </div>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ myBooks.length }}</span>
              <span class="stat-label">Documentos subidos</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ totalDownloads }}</span>
              <span class="stat-label">Descargas totales</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="profile-layout">

        <!-- LEFT: Upload Form -->
        <section class="profile-card upload-section">
          <div class="card-header">
            <div class="card-header-icon">
              <v-icon icon="mdi-cloud-upload-outline" size="20" color="cyan" />
            </div>
            <div>
              <h2 class="card-title">Publicar material</h2>
              <p class="card-subtitle">Sube un documento PDF a la biblioteca</p>
            </div>
          </div>

          <v-divider class="form-divider" />

          <form class="material-form" @submit.prevent="submitMaterial">

            <!-- Title -->
            <div class="form-field-group">
              <label class="field-label" for="material-title">
                <v-icon icon="mdi-text-box-outline" size="15" class="mr-1" color="cyan" />
                Nombre del material
                <span class="required-dot">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                class="custom-input"
                placeholder="Ej. Introducción al Álgebra Lineal"
                required
                id="material-title"
              />
            </div>

            <!-- Author -->
            <div class="form-field-group">
              <label class="field-label" for="material-author">
                <v-icon icon="mdi-account-edit-outline" size="15" class="mr-1" color="cyan" />
                Autor / Autores
                <span class="required-dot">*</span>
              </label>
              <input
                v-model="form.author"
                type="text"
                class="custom-input"
                placeholder="Ej. García, J. & López, M."
                required
                id="material-author"
              />
            </div>

            <!-- Genre -->
            <div class="form-field-group">
              <label class="field-label" for="material-genre">
                <v-icon icon="mdi-tag-outline" size="15" class="mr-1" color="cyan" />
                Género / Tipo de material
                <span class="required-dot">*</span>
              </label>
              <div class="select-wrapper">
                <select v-model="form.genre" class="custom-select" id="material-genre" required>
                  <option value="" disabled>Selecciona un género</option>
                  <option v-for="genre in genreOptions" :key="genre.value" :value="genre.value">
                    {{ genre.label }}
                  </option>
                </select>
                <v-icon icon="mdi-chevron-down" size="18" class="select-chevron" />
              </div>
            </div>

            <!-- Published Date -->
            <div class="form-field-group">
              <label class="field-label" for="material-date">
                <v-icon icon="mdi-calendar-outline" size="15" class="mr-1" color="cyan" />
                Fecha de publicación
                <span class="required-dot">*</span>
              </label>
              <input
                v-model="form.publishedDate"
                type="date"
                class="custom-input custom-input--date"
                required
                id="material-date"
              />
            </div>

            <!-- Category -->
            <div class="form-field-group">
              <label class="field-label" for="material-category">
                <v-icon icon="mdi-shape-outline" size="15" class="mr-1" color="cyan" />
                Categoría
                <span class="required-dot">*</span>
              </label>
              <div class="select-wrapper">
                <select v-model="form.categorySlug" class="custom-select" id="material-category" required>
                  <option value="" disabled>Selecciona una categoría</option>
                  <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                    {{ cat.title }}
                  </option>
                </select>
                <v-icon icon="mdi-chevron-down" size="18" class="select-chevron" />
              </div>
            </div>

            <!-- Description -->
            <div class="form-field-group">
              <label class="field-label" for="material-description">
                <v-icon icon="mdi-text-long" size="15" class="mr-1" color="cyan" />
                Descripción breve
              </label>
              <textarea
                v-model="form.description"
                class="custom-textarea"
                placeholder="Describe brevemente el contenido, temática o propósito del material..."
                rows="3"
                maxlength="350"
                id="material-description"
              ></textarea>
              <span class="char-counter">{{ form.description.length }}/350</span>
            </div>

            <!-- PDF Upload Zone -->
            <div class="form-field-group">
              <label class="field-label">
                <v-icon icon="mdi-file-pdf-box" size="15" class="mr-1" color="red-lighten-1" />
                Archivo PDF
                <span class="required-dot">*</span>
              </label>

              <div
                class="pdf-drop-zone"
                :class="{ 'has-file': form.fileName, 'drag-over': isDragging }"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                id="pdf-drop-zone"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".pdf,application/pdf"
                  class="hidden-input"
                  @change="handleFileSelect"
                />

                <div v-if="!form.fileName" class="drop-placeholder">
                  <div class="drop-icon-ring">
                    <v-icon icon="mdi-cloud-upload-outline" size="32" color="cyan" />
                  </div>
                  <p class="drop-cta">Arrastra tu PDF aquí o <span class="drop-link">haz clic para explorar</span></p>
                  <span class="drop-hint">Solo archivos PDF · Máx. 2 MB recomendado</span>
                </div>

                <div v-else class="file-preview">
                  <div class="file-preview-icon">
                    <v-icon icon="mdi-file-pdf-box" size="26" color="red-lighten-1" />
                  </div>
                  <div class="file-preview-info">
                    <strong>{{ form.fileName }}</strong>
                    <span>{{ formatFileSize(form.fileSize) }}</span>
                  </div>
                  <button type="button" class="file-clear-btn" @click.stop="clearFile" title="Eliminar archivo">
                    <v-icon icon="mdi-close" size="16" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Alerts -->
            <transition name="fade">
              <div v-if="uploadError" class="form-alert form-alert--error">
                <v-icon icon="mdi-alert-circle-outline" size="18" class="mr-2" />
                {{ uploadError }}
              </div>
            </transition>

            <transition name="fade">
              <div v-if="showSuccess" class="form-alert form-alert--success">
                <v-icon icon="mdi-check-circle-outline" size="18" class="mr-2" />
                ¡Material publicado exitosamente en la biblioteca!
              </div>
            </transition>

            <!-- Submit -->
            <v-btn
              type="submit"
              size="large"
              rounded="lg"
              block
              class="submit-btn"
              :loading="isSubmitting"
              :disabled="!isFormValid"
              id="submit-material-btn"
            >
              <template #prepend>
                <v-icon icon="mdi-send-outline" />
              </template>
              Publicar en la Biblioteca
            </v-btn>
          </form>
        </section>

        <!-- RIGHT: My uploaded materials -->
        <section class="profile-card my-materials-section">
          <div class="card-header">
            <div class="card-header-icon card-header-icon--purple">
              <v-icon icon="mdi-bookshelf" size="20" color="purple" />
            </div>
            <div>
              <h2 class="card-title">Mis publicaciones</h2>
              <p class="card-subtitle">Documentos que has subido a la biblioteca</p>
            </div>
            <v-chip size="small" color="purple" variant="tonal" class="ml-auto">
              {{ myBooks.length }}
            </v-chip>
          </div>

          <v-divider class="form-divider" />

          <!-- Empty state -->
          <div v-if="myBooks.length === 0" class="materials-empty">
            <div class="empty-icon-wrap">
              <v-icon icon="mdi-file-document-outline" size="36" color="cyan" />
            </div>
            <p>Aún no has publicado ningún material.</p>
            <span>Usa el formulario para compartir tu primer documento.</span>
          </div>

          <!-- Materials list -->
          <TransitionGroup name="material-list" tag="div" class="materials-list" v-else>
            <article
              v-for="book in myBooks"
              :key="book.id"
              class="material-item"
            >
              <div class="material-item-left">
                <div
                  class="material-cat-icon"
                  :style="{ background: getCategoryColor(book.categorySlug) + '1a', borderColor: getCategoryColor(book.categorySlug) + '40' }"
                >
                  <v-icon :icon="getCategoryIcon(book.categorySlug)" size="18" :color="getCategoryColor(book.categorySlug)" />
                </div>
                <div class="material-info">
                  <h3 class="material-title">{{ book.title }}</h3>
                  <div class="material-meta-row">
                    <span class="meta-pill">
                      <v-icon icon="mdi-account-edit-outline" size="12" class="mr-1" />
                      {{ book.author }}
                    </span>
                    <span class="meta-pill meta-pill--genre" v-if="book.genre">
                      <v-icon icon="mdi-tag-outline" size="12" class="mr-1" />
                      {{ getGenreLabel(book.genre) }}
                    </span>
                    <span class="meta-pill" v-if="book.publishedDate">
                      <v-icon icon="mdi-calendar-outline" size="12" class="mr-1" />
                      {{ formatPublishedDate(book.publishedDate) }}
                    </span>
                  </div>
                  <p v-if="book.description" class="material-description">{{ book.description }}</p>
                  <div class="material-stats-row">
                    <span class="stat-badge">
                      <v-icon icon="mdi-download" size="12" />
                      {{ book.downloads }} descargas
                    </span>
                    <span class="stat-badge">
                      <v-icon icon="mdi-file-pdf-box" size="12" color="red-lighten-1" />
                      {{ formatFileSize(book.fileSize) }}
                    </span>
                    <span class="stat-badge">
                      <v-icon icon="mdi-clock-outline" size="12" />
                      {{ formatDate(book.uploadedAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="material-item-actions">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="cyan"
                  @click="viewBook(book)"
                  title="Ver documento"
                >
                  <v-icon icon="mdi-eye-outline" size="18" />
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="red-lighten-1"
                  @click="confirmDelete(book)"
                  title="Eliminar"
                >
                  <v-icon icon="mdi-delete-outline" size="18" />
                </v-btn>
              </div>
            </article>
          </TransitionGroup>
        </section>
      </div>
    </template>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="delete-dialog-card">
        <v-card-title class="delete-dialog-title">
          <v-icon icon="mdi-alert-circle-outline" color="red-lighten-1" class="mr-2" />
          Eliminar publicación
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

const { currentUser } = useAuth()
const { categories } = useCategories()
const {
  books,
  addBook,
  deleteBook,
  viewBook,
  formatFileSize,
  formatDate,
} = useLibrary()

// ---- Genre options ----
const genreOptions = [
  { value: 'novela', label: 'Novela' },
  { value: 'cuento', label: 'Cuento / Relato corto' },
  { value: 'ensayo', label: 'Ensayo' },
  { value: 'poesia', label: 'Poesía' },
  { value: 'biografia', label: 'Biografía / Autobiografía' },
  { value: 'ciencia-ficcion', label: 'Ciencia Ficción' },
  { value: 'fantasia', label: 'Fantasía' },
  { value: 'terror', label: 'Terror / Suspenso' },
  { value: 'investigacion', label: 'Investigación académica' },
  { value: 'texto-educativo', label: 'Texto educativo / Manual' },
  { value: 'articulo', label: 'Artículo científico' },
  { value: 'informe', label: 'Informe / Reporte' },
  { value: 'tesis', label: 'Tesis / Monografía' },
  { value: 'otro', label: 'Otro' },
]

// ---- Form state ----
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isSubmitting = ref(false)
const uploadError = ref('')
const showSuccess = ref(false)
const deleteDialog = ref(false)
const bookToDelete = ref<LibraryBook | null>(null)

const form = reactive({
  title: '',
  author: '',
  genre: '',
  publishedDate: '',
  description: '',
  categorySlug: '',
  fileName: '',
  fileSize: 0,
  fileData: '',
})

// ---- Computed ----
const isFormValid = computed(() =>
  form.title.trim() &&
  form.author.trim() &&
  form.genre &&
  form.publishedDate &&
  form.categorySlug &&
  form.fileData
)

const myBooks = computed(() => {
  if (!currentUser.value) return []
  return books.value.filter((b) => b.uploadedBy === currentUser.value!.username)
})

const totalDownloads = computed(() =>
  myBooks.value.reduce((acc, b) => acc + b.downloads, 0)
)

// ---- Category helpers ----
function getCategoryColor(slug: string): string {
  const cat = categories.value.find((c: BookCategory) => c.slug === slug)
  return cat?.color || '#06b6d4'
}

function getCategoryIcon(slug: string): string {
  const cat = categories.value.find((c: BookCategory) => c.slug === slug)
  return cat?.icon || 'mdi-book-outline'
}

function getGenreLabel(value: string): string {
  return genreOptions.find((g) => g.value === value)?.label || value
}

function formatPublishedDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr + 'T00:00:00'))
  } catch {
    return dateStr
  }
}

// ---- File handling ----
function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (file) processFile(file)
}

function processFile(file: File) {
  uploadError.value = ''
  if (file.type !== 'application/pdf') {
    uploadError.value = 'Solo se permiten archivos PDF.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'El archivo supera los 2 MB recomendados. Puede funcionar pero con limitaciones de almacenamiento.'
  }
  form.fileName = file.name
  form.fileSize = file.size
  const reader = new FileReader()
  reader.onload = () => { form.fileData = String(reader.result || '') }
  reader.onerror = () => { uploadError.value = 'Error al leer el archivo. Intenta de nuevo.' }
  reader.readAsDataURL(file)
}

function clearFile() {
  form.fileName = ''
  form.fileSize = 0
  form.fileData = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ---- Submit ----
function submitMaterial() {
  if (!isFormValid.value) return
  uploadError.value = ''
  isSubmitting.value = true
  try {
    addBook({
      title: form.title,
      author: form.author,
      genre: form.genre,
      publishedDate: form.publishedDate,
      description: form.description,
      categorySlug: form.categorySlug,
      fileName: form.fileName,
      fileSize: form.fileSize,
      fileData: form.fileData,
      uploadedBy: currentUser.value?.username || 'Anónimo',
    })
    form.title = ''
    form.author = ''
    form.genre = ''
    form.publishedDate = ''
    form.description = ''
    form.categorySlug = ''
    clearFile()
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 4000)
  } catch {
    uploadError.value = 'Error al guardar. El almacenamiento puede estar lleno.'
  }
  setTimeout(() => { isSubmitting.value = false }, 500)
}

// ---- Delete ----
function confirmDelete(book: LibraryBook) {
  bookToDelete.value = book
  deleteDialog.value = true
}

function executeDelete() {
  if (bookToDelete.value) deleteBook(bookToDelete.value.id)
  deleteDialog.value = false
  bookToDelete.value = null
}
</script>

<style scoped>
.profile-page {
  padding: 0 16px 60px;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* NOT LOGGED IN */
.not-logged-in {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; gap: 16px;
  text-align: center; color: #94a3b8;
}
.not-logged-icon-wrap {
  width: 80px; height: 80px; border-radius: 20px;
  background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2);
  display: flex; align-items: center; justify-content: center;
}
.not-logged-in h2 { color: #f1f5f9; font-size: 1.5rem; font-weight: 700; margin: 0; }
.not-logged-in p { margin: 0; }

/* HERO */
.profile-hero {
  position: relative; padding: 32px 24px 28px; border-radius: 24px;
  background: rgba(13,19,33,0.8); border: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 28px; max-width: 1200px; margin-left: auto; margin-right: auto;
  overflow: hidden; backdrop-filter: blur(20px);
}
.hero-orbs { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; }
.hero-orb-1 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: -100px; left: -80px;
}
.hero-orb-2 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -80px; right: -60px;
}
.profile-hero-content {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.profile-avatar-ring {
  width: 72px; height: 72px; border-radius: 20px;
  background: rgba(6,182,212,0.1); border: 2px solid rgba(6,182,212,0.3);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 20px rgba(6,182,212,0.15);
}
.profile-hero-text { flex: 1; }
.profile-name {
  font-size: 1.8rem; font-weight: 800; color: #f1f5f9;
  margin: 0 0 8px; letter-spacing: -0.01em;
}
.profile-role-badge {
  display: inline-flex; align-items: center;
  font-size: 0.76rem; font-weight: 600; padding: 4px 12px; border-radius: 100px;
}
.badge-docente { background: rgba(6,182,212,0.1); color: #22d3ee; border: 1px solid rgba(6,182,212,0.25); }
.badge-estudiante { background: rgba(139,92,246,0.1); color: #c084fc; border: 1px solid rgba(139,92,246,0.2); }
.profile-stats { display: flex; align-items: center; gap: 24px; margin-left: auto; }
.stat-item { text-align: center; }
.stat-value {
  display: block; font-size: 1.8rem; font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.stat-label { font-size: 0.72rem; color: #64748b; margin-top: 2px; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }

/* LAYOUT */
.profile-layout {
  display: grid; grid-template-columns: 420px 1fr;
  gap: 28px; max-width: 1200px; margin: 0 auto;
}
@media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr; } }

/* CARDS */
.profile-card {
  background: rgba(13,19,33,0.75); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; padding: 24px; backdrop-filter: blur(16px);
}
.upload-section { align-self: flex-start; position: sticky; top: 76px; }
.card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
.card-header-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.15);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.card-header-icon--purple {
  background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.15);
}
.card-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0 0 2px; }
.card-subtitle { font-size: 0.78rem; color: #64748b; margin: 0; }
.form-divider { border-color: rgba(255,255,255,0.06) !important; margin-bottom: 20px; }

/* FORM */
.material-form { display: flex; flex-direction: column; gap: 16px; }
.form-field-group { display: flex; flex-direction: column; gap: 7px; position: relative; }
.field-label {
  display: flex; align-items: center;
  font-size: 0.82rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.02em;
}
.required-dot { color: #06b6d4; margin-left: 3px; font-size: 0.9rem; line-height: 1; }

.custom-input,
.custom-textarea {
  background: rgba(17,24,39,0.65); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px; padding: 11px 14px; color: #f1f5f9;
  font-family: 'Inter', sans-serif; font-size: 0.88rem;
  width: 100%; outline: none; transition: all 0.22s ease; box-sizing: border-box; resize: none;
}
.custom-input:focus, .custom-textarea:focus {
  border-color: rgba(6,182,212,0.5); background: rgba(17,24,39,0.85);
  box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
}
.custom-input::placeholder, .custom-textarea::placeholder { color: #475569; }
.custom-input--date { color-scheme: dark; }

.select-wrapper { position: relative; }
.custom-select {
  appearance: none; background: rgba(17,24,39,0.65);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
  padding: 11px 40px 11px 14px; color: #f1f5f9;
  font-family: 'Inter', sans-serif; font-size: 0.88rem;
  width: 100%; outline: none; transition: all 0.22s ease; cursor: pointer;
}
.custom-select:focus {
  border-color: rgba(6,182,212,0.5); box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
}
.custom-select option { background: #0d1321; color: #f1f5f9; }
.select-chevron {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%); pointer-events: none; color: #64748b;
}
.char-counter { font-size: 0.72rem; color: #475569; text-align: right; margin-top: -4px; }

/* PDF DROP ZONE */
.pdf-drop-zone {
  border: 2px dashed rgba(148,163,184,0.18); border-radius: 16px; padding: 28px 20px;
  cursor: pointer; transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  background: rgba(6,182,212,0.02); text-align: center;
}
.pdf-drop-zone:hover, .pdf-drop-zone.drag-over {
  border-color: rgba(6,182,212,0.45); background: rgba(6,182,212,0.06);
}
.pdf-drop-zone.has-file {
  border-style: solid; border-color: rgba(6,182,212,0.3);
  background: rgba(6,182,212,0.04); padding: 14px 16px;
}
.hidden-input { display: none; }
.drop-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.drop-icon-ring {
  width: 60px; height: 60px; border-radius: 16px;
  background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2);
  display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
}
.drop-cta { color: #cbd5e1; font-size: 0.88rem; font-weight: 500; margin: 0; }
.drop-link { color: #06b6d4; text-decoration: underline; }
.drop-hint { color: #475569; font-size: 0.73rem; }
.file-preview { display: flex; align-items: center; gap: 12px; text-align: left; }
.file-preview-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.file-preview-info { flex: 1; min-width: 0; }
.file-preview-info strong {
  display: block; color: #f1f5f9; font-size: 0.83rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.file-preview-info span { color: #64748b; font-size: 0.73rem; }
.file-clear-btn {
  background: none; border: none; cursor: pointer; color: #64748b;
  padding: 4px; border-radius: 6px; transition: color 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.file-clear-btn:hover { color: #f87171; }

/* ALERTS */
.form-alert {
  display: flex; align-items: flex-start; border-radius: 12px;
  padding: 11px 14px; font-size: 0.83rem; line-height: 1.4;
}
.form-alert--error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
.form-alert--success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; }

/* SUBMIT BUTTON */
.submit-btn {
  background: linear-gradient(135deg, #06b6d4, #7c3aed) !important;
  color: #fff !important; font-weight: 700 !important;
  text-transform: none !important; letter-spacing: 0.02em !important;
  box-shadow: 0 6px 20px rgba(6,182,212,0.25) !important;
  transition: all 0.25s ease !important;
}
.submit-btn:hover:not(:disabled) {
  box-shadow: 0 8px 28px rgba(6,182,212,0.4) !important; transform: translateY(-1px);
}

/* MATERIALS LIST */
.my-materials-section { display: flex; flex-direction: column; }
.materials-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 48px 16px; gap: 10px; color: #94a3b8;
  border: 1px dashed rgba(148,163,184,0.15); border-radius: 16px;
}
.empty-icon-wrap {
  width: 64px; height: 64px; border-radius: 16px;
  background: rgba(6,182,212,0.07); display: flex; align-items: center;
  justify-content: center; margin-bottom: 6px;
}
.materials-empty p { font-size: 0.95rem; color: #94a3b8; margin: 0; }
.materials-empty span { font-size: 0.78rem; color: #475569; }
.materials-list { display: flex; flex-direction: column; gap: 12px; }
.material-item {
  display: flex; align-items: flex-start; gap: 14px;
  background: rgba(17,24,39,0.5); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px; padding: 16px;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
}
.material-item:hover {
  border-color: rgba(6,182,212,0.2); background: rgba(17,24,39,0.75);
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
.material-item-left { display: flex; gap: 14px; flex: 1; min-width: 0; }
.material-cat-icon {
  width: 40px; height: 40px; border-radius: 11px; border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.material-info { flex: 1; min-width: 0; }
.material-title {
  font-size: 0.95rem; font-weight: 700; color: #f1f5f9; margin: 0 0 6px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.material-meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.meta-pill {
  display: inline-flex; align-items: center; font-size: 0.72rem; color: #94a3b8;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 2px 8px;
}
.meta-pill--genre {
  background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.2); color: #c084fc;
}
.material-description {
  font-size: 0.78rem; color: #64748b; line-height: 1.5; margin: 0 0 8px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.material-stats-row { display: flex; flex-wrap: wrap; gap: 8px; }
.stat-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; color: #64748b; }
.material-item-actions { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }

/* DELETE DIALOG */
.delete-dialog-card {
  background: #0d1321 !important; border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 20px !important;
}
.delete-dialog-title {
  color: #f1f5f9 !important; font-weight: 700; font-size: 1rem;
  padding: 20px 20px 12px !important; display: flex; align-items: center;
}
.delete-dialog-text { color: #94a3b8 !important; padding: 0 20px 16px !important; }
.delete-dialog-text strong { color: #f1f5f9; }
.delete-dialog-actions { padding: 8px 16px 16px !important; }

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
.material-list-enter-active, .material-list-leave-active { transition: all 0.35s ease; }
.material-list-enter-from { opacity: 0; transform: translateY(12px); }
.material-list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
