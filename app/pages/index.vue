<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <v-icon icon="mdi-lightning-bolt" size="14" color="cyan" />
          <span>Plataforma de nueva generación</span>
        </div>
        <h1 class="hero-title">
          Tu biblioteca digital
          <span class="gradient-text">sin límites</span>
        </h1>
        <p class="hero-desc">
          Descubre, organiza y comparte tus lecturas favoritas. Una experiencia de lectura
          moderna, rápida e intuitiva diseñada para los amantes de los libros.
        </p>
        <div class="hero-actions">
          <v-btn
            size="large"
            color="cyan"
            rounded="lg"
            class="btn-glow"
            prepend-icon="mdi-rocket-launch"
            to="/features"
          >
            Explorar
          </v-btn>
          <v-btn
            size="large"
            variant="outlined"
            rounded="lg"
            class="btn-outline"
            prepend-icon="mdi-play-circle-outline"
            to="/contact"
          >
            Contáctanos
          </v-btn>
        </div>
        <!-- Stats -->
        <div class="hero-stats">
          <div class="stat" v-for="s in stats" :key="s.label">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Cards -->
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

    <!-- Quick Testimonials Marquee -->
    <section class="quick-quotes">
      <div class="quotes-track">
        <div class="quote-chip" v-for="(q, i) in quotes" :key="i">
          <v-icon icon="mdi-format-quote-close" size="16" color="cyan" />
          <span>{{ q.text }}</span>
          <strong>— {{ q.author }}</strong>
        </div>
        <!-- Duplicate for infinite scroll effect -->
        <div class="quote-chip" v-for="(q, i) in quotes" :key="'d' + i">
          <v-icon icon="mdi-format-quote-close" size="16" color="cyan" />
          <span>{{ q.text }}</span>
          <strong>— {{ q.author }}</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const stats = [
  { value: '12K+', label: 'Usuarios' },
  { value: '50K+', label: 'Libros' },
  { value: '4.9★', label: 'Rating' },
  { value: '99%', label: 'Uptime' },
]

const sectionCards = [
  {
    title: 'Características',
    desc: 'Organiza, busca y comparte con herramientas diseñadas para lectores.',
    icon: 'mdi-star-four-points',
    iconColor: '#06b6d4',
    iconBg: 'rgba(6, 182, 212, 0.1)',
    to: '/features',
  },
  {
    title: 'Testimonios',
    desc: 'Descubre lo que dicen miles de lectores sobre NEO BOOKS.',
    icon: 'mdi-message-text-outline',
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.1)',
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

const quotes = [
  { text: 'NEO BOOKS transformó mi rutina de lectura.', author: 'Ana P.' },
  { text: 'Fácil, rápido y hermoso.', author: 'Carlos M.' },
  { text: 'La mejor plataforma de libros que he usado.', author: 'Laura G.' },
  { text: 'Organizar mi biblioteca nunca fue tan sencillo.', author: 'Diego R.' },
]
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

/* ==================== HERO ==================== */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  overflow: hidden;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: orbFloat 12s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: -100px;
  left: -80px;
  animation-delay: 0s;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -60px;
  right: -60px;
  animation-delay: -4s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #f59e0b 0%, transparent 70%);
  top: 50%;
  left: 60%;
  animation-delay: -8s;
  opacity: 0.15;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 0.78rem;
  color: #06b6d4;
  font-weight: 500;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
  animation: fadeInUp 0.6s ease-out;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  color: #f1f5f9;
  margin: 0 0 16px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #f59e0b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.hero-desc {
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.65;
  margin-bottom: 28px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.btn-glow {
  font-weight: 600 !important;
  letter-spacing: 0.02em;
  text-transform: none !important;
  box-shadow: 0 0 24px rgba(6, 182, 212, 0.3) !important;
  transition: box-shadow 0.3s !important;
}

.btn-glow:hover {
  box-shadow: 0 0 36px rgba(6, 182, 212, 0.5) !important;
}

.btn-outline {
  color: #94a3b8 !important;
  border-color: rgba(148, 163, 184, 0.3) !important;
  text-transform: none !important;
  font-weight: 500 !important;
  transition: all 0.3s !important;
}

.btn-outline:hover {
  border-color: #06b6d4 !important;
  color: #06b6d4 !important;
}

.hero-stats {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.45s both;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 2px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* ==================== QUOTES MARQUEE ==================== */
.quick-quotes {
  padding: 0 0 40px;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.quotes-track {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.quote-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  padding: 10px 18px;
  white-space: nowrap;
  font-size: 0.82rem;
  color: #94a3b8;
  flex-shrink: 0;
}

.quote-chip strong {
  color: #06b6d4;
  font-weight: 600;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>