<template>
  <div class="page-features">
    <div class="page-header">
      <div class="header-badge">
        <v-icon icon="mdi-star-four-points" size="16" color="cyan" />
        <span>Funcionalidades</span>
      </div>
      <h1>Nuestras <span class="gradient-text">Características</span></h1>
      <p class="page-desc">
        Herramientas poderosas diseñadas para que tu experiencia de lectura sea extraordinaria.
      </p>
    </div>

    <div class="features-grid">
      <div
        class="feature-card"
        v-for="(f, i) in features"
        :key="i"
        :style="{ animationDelay: (i * 0.1) + 's' }"
      >
        <div class="feature-icon" :style="{ background: f.bg }">
          <span>{{ f.icon }}</span>
        </div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    icon: '📚',
    title: 'Organiza tu biblioteca',
    desc: 'Crea colecciones personalizadas y etiquetas inteligentes para encontrar cualquier libro al instante.',
    bg: 'rgba(6, 182, 212, 0.1)',
  },
  {
    icon: '🔍',
    title: 'Búsqueda avanzada',
    desc: 'Filtra por autor, género, tema o popularidad con nuestro potente motor de búsqueda.',
    bg: 'rgba(139, 92, 246, 0.1)',
  },
  {
    icon: '🤝',
    title: 'Comparte con amigos',
    desc: 'Recomienda libros y comparte listas de lectura con tu comunidad en segundos.',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: '📊',
    title: 'Estadísticas de lectura',
    desc: 'Visualiza tu progreso, establece metas y sigue tu evolución como lector.',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: '🌙',
    title: 'Modo nocturno',
    desc: 'Lectura cómoda en cualquier momento del día con nuestro tema oscuro automático.',
    bg: 'rgba(99, 102, 241, 0.1)',
  },
  {
    icon: '☁️',
    title: 'Sincronización en la nube',
    desc: 'Accede a tu biblioteca desde cualquier dispositivo, siempre actualizada.',
    bg: 'rgba(236, 72, 153, 0.1)',
  },
]
</script>

<style scoped>
.page-features {
  padding: 48px 28px 60px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.18);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.76rem;
  color: #06b6d4;
  font-weight: 500;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 10px;
}

.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
}

.feature-card {
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px 24px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease-out both;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 8px 32px rgba(6, 182, 212, 0.08);
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 8px;
}

.feature-card p {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
