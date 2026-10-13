<template>
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
</template>

<script setup>
const stats = [
  { value: '12K+', label: 'Usuarios' },
  { value: '50K+', label: 'Libros' },
  { value: '4.9★', label: 'Rating' },
  { value: '99%', label: 'Uptime' },
]
</script>

<style scoped>
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
</style>
