<template>
  <div class="reviews-page">
    <div class="page-header">
      <div class="header-badge">
        <v-icon icon="mdi-book-open-page-variant" size="16" color="#06b6d4" />
        <span>Publicaciones</span>
      </div>
      <h1>Reseñas de <span class="gradient-text">libros</span></h1>
      <p class="page-desc">
        Comparte tu opinión, califica la lectura y sube una imagen de tu experiencia con el libro.
      </p>
    </div>

    <div class="reviews-layout">
      <section class="composer-card">
        <div class="section-title-row">
          <h2>Nueva publicación</h2>
          <v-chip color="cyan" size="small" variant="tonal">Foro</v-chip>
        </div>

        <v-form class="review-form" @submit.prevent="submitReview">
          <div class="grid-two">
            <v-text-field
              v-model="form.title"
              label="Título de la reseña"
              variant="outlined"
              density="comfortable"
              required
            />
            <v-text-field
              v-model="form.book"
              label="Libro"
              variant="outlined"
              density="comfortable"
              required
            />
          </div>

          <v-text-field
            v-model="form.author"
            label="Tu nombre"
            variant="outlined"
            density="comfortable"
            required
          />

          <div class="rating-row">
            <label>Calificación</label>
            <div class="stars-picker">
              <v-btn
                v-for="n in 5"
                :key="n"
                variant="text"
                icon
                density="comfortable"
                :color="n <= form.rating ? 'amber' : 'grey-lighten-1'"
                @click="form.rating = n"
              >
                <v-icon :icon="n <= form.rating ? 'mdi-star' : 'mdi-star-outline'" />
              </v-btn>
            </div>
          </div>

          <v-textarea
            v-model="form.review"
            label="Escribe tu reseña"
            variant="outlined"
            rows="5"
            auto-grow
            required
          />

          <div class="upload-box">
            <label class="upload-label">Imagen opcional</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden-file-input"
            />
            <div class="upload-button-wrap">
              <v-btn variant="outlined" color="cyan" prepend-icon="mdi-image-plus" @click="triggerFileInput">
                Seleccionar imagen
              </v-btn>
              <span v-if="form.imageName">{{ form.imageName }}</span>
            </div>
            <img v-if="form.imagePreview" :src="form.imagePreview" class="preview-image" alt="Vista previa de la reseña" />
          </div>

          <v-btn
            type="submit"
            color="cyan"
            size="large"
            rounded="lg"
            block
            prepend-icon="mdi-send"
            :loading="isSubmitting"
          >
            Publicar reseña
          </v-btn>
        </v-form>
      </section>

      <section class="feed-card">
        <div class="section-title-row">
          <h2>Últimas reseñas</h2>
          <v-chip color="purple" size="small" variant="tonal">{{ reviews.length }} publicaciones</v-chip>
        </div>

        <div v-if="reviews.length === 0" class="empty-state">
          <v-icon icon="mdi-book-open-variant" size="32" color="cyan" />
          <p>Aún no hay reseñas. ¡Sé el primero en compartir tu lectura!</p>
        </div>

        <article v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-head">
            <div class="user-pill">
              <v-avatar size="36" color="cyan-darken-2">
                <span>{{ getInitials(review.author) }}</span>
              </v-avatar>
              <div>
                <strong>{{ review.author }}</strong>
                <small>{{ formatDate(review.createdAt) }}</small>
              </div>
            </div>
            <div class="stars-inline">
              <v-icon v-for="n in 5" :key="n" :icon="n <= review.rating ? 'mdi-star' : 'mdi-star-outline'" size="16" :color="n <= review.rating ? 'amber' : 'grey-lighten-1'" />
            </div>
          </div>

          <div class="review-body">
            <h3>{{ review.title }}</h3>
            <p class="book-name">Libro: {{ review.book }}</p>
            <p class="review-text">{{ review.review }}</p>
            <img v-if="review.image" :src="review.image" :alt="review.imageName || 'Imagen de reseña'" class="book-image" />
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const { reviews, addReview, formatDate } = useReviews()

const isSubmitting = ref(false)
const form = reactive({
  title: '',
  book: '',
  author: '',
  rating: 5,
  review: '',
  image: null,
  imageName: '',
  imagePreview: '',
})

const triggerFileInput = () => {
  const input = document.querySelector('.hidden-file-input')
  input?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  form.imageName = file.name

  const reader = new FileReader()
  reader.onload = () => {
    form.image = String(reader.result || '')
    form.imagePreview = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

const getInitials = (name) => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'U'
}

const submitReview = () => {
  if (!form.title || !form.book || !form.author || !form.review) return

  isSubmitting.value = true

  addReview({
    title: form.title,
    book: form.book,
    author: form.author,
    rating: form.rating,
    review: form.review,
    image: form.image,
    imageName: form.imageName,
  })

  form.title = ''
  form.book = ''
  form.author = ''
  form.rating = 5
  form.review = ''
  form.image = null
  form.imageName = ''
  form.imagePreview = ''

  if (document.querySelector('.hidden-file-input')) {
    document.querySelector('.hidden-file-input').value = ''
  }

  setTimeout(() => {
    isSubmitting.value = false
  }, 500)
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 32px;
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

.reviews-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 18px 48px;
}

.composer-card,
.feed-card {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.35);
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
  font-size: 1.3rem;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.grid-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #cbd5e1;
  padding: 6px 0;
}

.stars-picker {
  display: flex;
  align-items: center;
  gap: 4px;
}

.upload-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hidden-file-input {
  display: none;
}

.upload-label {
  color: #cbd5e1;
  font-size: 0.9rem;
}

.upload-button-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.upload-button-wrap span {
  color: #94a3b8;
  font-size: 0.8rem;
}

.preview-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.feed-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 18px;
  color: #94a3b8;
  border: 1px dashed rgba(148, 163, 184, 0.2);
  border-radius: 16px;
}

.review-item {
  background: rgba(15, 23, 42, 0.58);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 18px;
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-pill strong {
  display: block;
  color: #f8fafc;
}

.user-pill small {
  color: #94a3b8;
}

.stars-inline {
  display: flex;
  align-items: center;
  gap: 2px;
}

.review-body h3 {
  margin: 0 0 8px;
  color: #f8fafc;
  font-size: 1.1rem;
}

.book-name {
  margin: 0 0 8px;
  color: #67e8f9;
  font-weight: 600;
  font-size: 0.9rem;
}

.review-text {
  margin: 0 0 14px;
  color: #dbeafe;
  line-height: 1.7;
  white-space: pre-line;
}

.book-image {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.12);
}

@media (max-width: 960px) {
  .reviews-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .grid-two {
    grid-template-columns: 1fr;
  }

  .review-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
