<template>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/">NEO BOOKS</a>
      <nav>
        <ul class="nav-list">
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Simple header component
</script>

<style scoped>
.site-header{background:#0f172a;color:#fff;padding:16px 0}
.container{display:flex;align-items:center;justify-content:space-between;max-width:1100px;margin:0 auto;padding:0 16px}
.brand{font-weight:700;font-size:1.1rem;color:inherit;text-decoration:none}
.nav-list{list-style:none;display:flex;gap:12px;margin:0;padding:0}
.nav-list a{color:rgba(255,255,255,0.9);text-decoration:none}
</style>
