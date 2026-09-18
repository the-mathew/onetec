<template>
  <section id="testimonials" class="testimonials">
    <div class="container">
      <h2>Lo que dicen nuestros usuarios</h2>
      <div class="list">
        <blockquote v-for="(t,i) in testimonials" :key="i">
          <p>“{{ t.quote }}”</p>
          <footer>— {{ t.author }}</footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { quote: 'NEO BOOKS me ayudó a organizar mi lectura anual.', author: 'Ana P.' },
  { quote: 'Fácil de usar y con funciones poderosas.', author: 'Carlos M.' }
]
</script>

<style scoped>
.testimonials{padding:48px 0;background:#f7fafc}
.list{display:flex;flex-direction:column;gap:12px}
blockquote{background:#fff;padding:16px;border-left:4px solid #06b6d4;border-radius:6px}
footer{margin-top:8px;font-size:0.9rem;color:#555}
</style>
