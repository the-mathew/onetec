<template>
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
</template>

<script setup>
const quotes = [
  { text: 'NEO BOOKS transformó mi rutina de lectura.', author: 'Ana P.' },
  { text: 'Fácil, rápido y hermoso.', author: 'Carlos M.' },
  { text: 'La mejor plataforma de libros que he usado.', author: 'Laura G.' },
  { text: 'Organizar mi biblioteca nunca fue tan sencillo.', author: 'Diego R.' },
]
</script>

<style scoped>
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
