<template>
  <div class="page-testimonials">
    <div class="page-header">
      <div class="header-badge">
        <v-icon icon="mdi-message-text-outline" size="16" color="#8b5cf6" />
        <span>Opiniones</span>
      </div>
      <h1>Lo que dicen nuestros <span class="gradient-text">usuarios</span></h1>
      <p class="page-desc">
        Miles de lectores ya confían en NEO BOOKS. Descubre sus experiencias.
      </p>
    </div>

    <!-- Rating summary -->
    <div class="rating-summary">
      <div class="rating-big">4.9</div>
      <div class="rating-stars">
        <v-icon v-for="n in 5" :key="n" icon="mdi-star" size="20" color="#f59e0b" />
      </div>
      <div class="rating-count">Basado en 2,847 reseñas</div>
    </div>

    <div class="testimonials-grid">
      <div
        class="testimonial-card"
        v-for="(t, i) in testimonials"
        :key="i"
        :style="{ animationDelay: (i * 0.08) + 's' }"
      >
        <div class="card-top">
          <div class="avatar-circle" :style="{ background: t.color }">
            {{ t.initials }}
          </div>
          <div>
            <div class="author-name">{{ t.author }}</div>
            <div class="author-role">{{ t.role }}</div>
          </div>
          <div class="stars-small">
            <v-icon v-for="n in t.stars" :key="n" icon="mdi-star" size="14" color="#f59e0b" />
          </div>
        </div>
        <v-icon icon="mdi-format-quote-open" size="22" class="quote-icon" />
        <p class="quote-text">{{ t.quote }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const testimonials = [
  {
    quote: 'NEO BOOKS transformó completamente mi rutina de lectura. Ahora llevo un registro perfecto de todos mis libros.',
    author: 'Ana Patricia',
    initials: 'AP',
    role: 'Lectora ávida',
    stars: 5,
    color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  {
    quote: 'La búsqueda avanzada es increíble. Puedo encontrar cualquier libro en segundos, filtrar por tema y descubrir recomendaciones.',
    author: 'Carlos Mendez',
    initials: 'CM',
    role: 'Estudiante universitario',
    stars: 5,
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    quote: 'Compartir listas de lectura con mis amigos nunca fue tan fácil. La interfaz es hermosa y muy intuitiva.',
    author: 'Laura González',
    initials: 'LG',
    role: 'Profesora de literatura',
    stars: 5,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    quote: 'Las estadísticas de lectura me motivan a leer más cada mes. Es como un fitness tracker pero para libros.',
    author: 'Diego Ramírez',
    initials: 'DR',
    role: 'Emprendedor',
    stars: 4,
    color: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    quote: 'El modo nocturno es perfecto para leer antes de dormir. Cuidan cada detalle de la experiencia.',
    author: 'Sofía Herrera',
    initials: 'SH',
    role: 'Diseñadora UX',
    stars: 5,
    color: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
  {
    quote: 'Sincronizar mi biblioteca entre mi laptop y mi tablet es instantáneo. Excelente servicio en la nube.',
    author: 'Martín Ochoa',
    initials: 'MO',
    role: 'Ingeniero de software',
    stars: 5,
    color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
]
</script>

<style scoped>
.page-testimonials {
  padding: 48px 28px 60px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.18);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.76rem;
  color: #8b5cf6;
  font-weight: 500;
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 10px;
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Rating Summary */
.rating-summary {
  text-align: center;
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.rating-big {
  font-size: 2.6rem;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1;
  margin-bottom: 6px;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 6px;
}

.rating-count {
  font-size: 0.78rem;
  color: #64748b;
}

/* Testimonials Grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.testimonial-card {
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease-out both;
}

.testimonial-card:hover {
  transform: translateY(-3px);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.06);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.author-name {
  font-weight: 600;
  font-size: 0.88rem;
  color: #f1f5f9;
}

.author-role {
  font-size: 0.72rem;
  color: #64748b;
}

.stars-small {
  margin-left: auto;
  display: flex;
  gap: 1px;
}

.quote-icon {
  color: rgba(139, 92, 246, 0.3);
  margin-bottom: 6px;
}

.quote-text {
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
