<template>
  <section class="hero">
    <div class="container">
      <h1>Bienvenido a NEO BOOKS</h1>
      <p class="lead">Tu biblioteca digital de confianza — descubre, organiza y comparte tus lecturas favoritas.</p>
      <div class="actions">
        <a class="btn primary" href="#features">Conocer más</a>
        <a class="btn" href="#contact">Contáctanos</a>
      </div>
    </div>
  </section>
</template>

<script setup>
// Hero content for the homepage
</script>

<style scoped>
.hero{padding:80px 0;background:linear-gradient(180deg,#0f172a 0%,#071129 100%);color:#fff}
.hero .container{max-width:900px;margin:0 auto;text-align:center;padding:0 16px}
.hero h1{font-size:2.4rem;margin:0 0 12px}
.hero .lead{opacity:0.9;margin-bottom:20px}
.actions{display:flex;gap:12px;justify-content:center}
.btn{display:inline-block;padding:10px 16px;border-radius:8px;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none}
.btn.primary{background:#06b6d4;color:#072; background:#06b6d4}
</style>
