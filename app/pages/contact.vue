<template>
  <div class="page-contact">
    <div class="page-header">
      <div class="header-badge">
        <v-icon icon="mdi-email-fast-outline" size="16" color="#f59e0b" />
        <span>Contáctanos</span>
      </div>
      <h1>¿Tienes alguna <span class="gradient-text">pregunta</span>?</h1>
      <p class="page-desc">
        Envíanos un mensaje y te responderemos en menos de 24 horas. Estamos aquí para ayudarte.
      </p>
    </div>

    <div class="contact-layout">
      <!-- Contact Info -->
      <div class="contact-info">
        <div class="info-card" v-for="info in contactInfo" :key="info.label">
          <div class="info-icon" :style="{ background: info.bg }">
            <v-icon :icon="info.icon" size="22" :color="info.color" />
          </div>
          <div>
            <div class="info-label">{{ info.label }}</div>
            <div class="info-value">{{ info.value }}</div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form class="contact-form" @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="contact-name">Nombre</label>
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            placeholder="Tu nombre completo"
            required
          />
        </div>
        <div class="form-group">
          <label for="contact-email">Email</label>
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="contact-subject">Asunto</label>
          <input
            id="contact-subject"
            v-model="form.subject"
            type="text"
            placeholder="¿Sobre qué quieres hablar?"
          />
        </div>
        <div class="form-group">
          <label for="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            placeholder="Cuéntanos los detalles..."
            rows="5"
            required
          ></textarea>
        </div>
        <v-btn
          type="submit"
          color="cyan"
          size="large"
          rounded="lg"
          block
          class="submit-btn"
          prepend-icon="mdi-send"
          :loading="sending"
        >
          Enviar mensaje
        </v-btn>

        <v-snackbar v-model="showSuccess" color="teal" timeout="4000" location="top">
          <v-icon icon="mdi-check-circle" class="mr-2" />
          ¡Gracias {{ form.name || '' }}! Tu mensaje fue enviado correctamente.
        </v-snackbar>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const sending = ref(false)
const showSuccess = ref(false)

const contactInfo = [
  {
    icon: 'mdi-map-marker-outline',
    label: 'Ubicación',
    value: 'Ciudad de México, MX',
    bg: 'rgba(6, 182, 212, 0.1)',
    color: '#06b6d4',
  },
  {
    icon: 'mdi-email-outline',
    label: 'Email',
    value: 'contacto@neobooks.com',
    bg: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
  },
  {
    icon: 'mdi-clock-outline',
    label: 'Horario',
    value: 'Lun - Vie, 9:00 - 18:00',
    bg: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
  },
]

async function onSubmit() {
  sending.value = true
  // Simulate send
  await new Promise(r => setTimeout(r, 1200))
  sending.value = false
  showSuccess.value = true
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>

<style scoped>
.page-contact {
  padding: 48px 28px 60px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.18);
  border-radius: 100px;
  padding: 5px 14px;
  font-size: 0.76rem;
  color: #f59e0b;
  font-weight: 500;
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 10px;
}

.gradient-text {
  background: linear-gradient(135deg, #f59e0b, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Contact Layout */
.contact-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 720px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
  transition: border-color 0.3s;
}

.info-card:hover {
  border-color: rgba(6, 182, 212, 0.15);
}

.info-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.info-label {
  font-size: 0.72rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 0.88rem;
  color: #f1f5f9;
  font-weight: 500;
  margin-top: 1px;
}

/* Form */
.contact-form {
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 32px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  background: rgba(6, 10, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #f1f5f9;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-sizing: border-box;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #475569;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.08);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  margin-top: 4px;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.25) !important;
}

.submit-btn:hover {
  box-shadow: 0 0 32px rgba(6, 182, 212, 0.4) !important;
}
</style>
