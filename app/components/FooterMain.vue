<template>
  <footer class="site-footer">
    <div class="container">
      <p>© {{ new Date().getFullYear() }} NEO BOOKS — Todos los derechos reservados.</p>
      <nav>
        <a href="/privacy">Privacidad</a> · <a href="/terms">Términos</a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
// simple footer
</script>

<style scoped>
.site-footer{padding:18px 0;background:#0b1220;color:#cbd5e1}
.site-footer .container{display:flex;justify-content:space-between;align-items:center;max-width:1100px;margin:0 auto;padding:0 16px}
.site-footer a{color:inherit}
</style>
