<template>
  <section class="sections-preview">
    <h2 class="section-title">Explora nuestras secciones</h2>
    <p class="section-subtitle">Todo lo que necesitas para tu experiencia de lectura</p>
    <div class="cards-grid">
      <NuxtLink
        v-for="card in sectionCards"
        :key="card.to"
        :to="card.to"
        class="preview-card"
      >
        <div class="card-icon-wrap" :style="{ background: card.iconBg }">
          <v-icon :icon="card.icon" size="28" :color="card.iconColor" />
        </div>
        <h3>{{ card.title }}</h3>
        <p>{{ card.desc }}</p>
        <div class="card-arrow">
          <v-icon icon="mdi-arrow-right" size="18" />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const sectionCards = [
  {
    title: 'Categorías',
    desc: 'Explora por géneros: Ciencia Ficción, Tecnología, Literatura, Historia y más.',
    icon: 'mdi-shape-outline',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    to: '/categories',
  },
  {
    title: 'Características',
    desc: 'Organiza, busca y comparte con herramientas diseñadas para lectores.',
    icon: 'mdi-star-four-points',
    iconColor: '#06b6d4',
    iconBg: 'rgba(6, 182, 212, 0.1)',
    to: '/features',
  },
  {
    title: 'Publicaciones',
    desc: 'Lee reseñas de libros, comparte tu experiencia y sube imágenes de tus lecturas.',
    icon: 'mdi-book-open-page-variant',
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    to: '/reviews',
  },
  {
    title: 'Biblioteca Digital',
    desc: 'Sube y descarga libros, documentos PDF para toda la comunidad.',
    icon: 'mdi-library-shelves',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    to: '/library',
  },
  {
    title: 'Testimonios',
    desc: 'Descubre lo que dicen miles de lectores sobre NEO BOOKS.',
    icon: 'mdi-message-text-outline',
    iconColor: '#06b6d4',
    iconBg: 'rgba(6, 182, 212, 0.1)',
    to: '/testimonials',
  },
  {
    title: 'Contacto',
    desc: 'Escríbenos y te responderemos en menos de 24 horas.',
    icon: 'mdi-email-fast-outline',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    to: '/contact',
  },
]
</script>

<style scoped>
/* ==================== SECTION CARDS ==================== */
.sections-preview {
  padding: 60px 24px 70px;
  max-width: 960px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: #f1f5f9;
  text-align: center;
  margin: 0 0 6px;
}

.section-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 36px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.preview-card {
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.preview-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.35s;
}

.preview-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 12px 40px rgba(6, 182, 212, 0.08);
}

.preview-card:hover::before {
  opacity: 1;
}

.card-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.preview-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 8px;
}

.preview-card p {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}

.card-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #334155;
  transition: all 0.3s;
}

.preview-card:hover .card-arrow {
  color: #06b6d4;
  transform: translateX(4px);
}
</style>
