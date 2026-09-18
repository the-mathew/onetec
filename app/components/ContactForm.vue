<template>
  <section id="contact" class="contact">
    <div class="container">
      <h2>Contacto</h2>
      <form @submit.prevent="onSubmit" class="contact-form">
        <input v-model="name" placeholder="Nombre" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <textarea v-model="message" placeholder="Mensaje" required></textarea>
        <button type="submit">Enviar</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function onSubmit () {
  // placeholder behavior: show a browser alert
  alert(`Gracias ${name.value}, recibimos tu mensaje.`)
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<style scoped>
.contact{padding:48px 0}
.contact-form{display:flex;flex-direction:column;gap:10px;max-width:560px}
input,textarea{padding:10px;border-radius:6px;border:1px solid #d1d5db}
button{background:#06b6d4;color:#fff;padding:10px;border-radius:6px;border:0}
</style>
