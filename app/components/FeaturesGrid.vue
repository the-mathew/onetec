<template>
  <section id="features" class="features">
    <div class="container">
      <h2>Nuestras características</h2>
      <div class="grid">
        <div class="card" v-for="(f, i) in features" :key="i">
          <div class="icon">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: '📚', title: 'Organiza tu biblioteca', desc: 'Crea colecciones y etiquetas para encontrar libros rápido.' },
  { icon: '🔍', title: 'Búsqueda avanzada', desc: 'Filtra por autor, tema o popularidad con facilidad.' },
  { icon: '🤝', title: 'Comparte con amigos', desc: 'Recomienda y comparte listas de lectura en segundos.' }
]
</script>

<style scoped>
.features{padding:48px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:20px}
.card{background:#fff;padding:18px;border-radius:8px;box-shadow:0 2px 8px rgba(2,6,23,0.06);text-align:center}
.icon{font-size:28px;margin-bottom:8px}
</style>
