<template>
  <div class="login-container">
    <!-- Animated Orbs Background -->
    <div class="login-bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="login-content-wrapper">
      <!-- Brand & Header -->
      <div class="login-header">
        <div class="brand-badge">
          <div class="brand-icon-box">
            <v-icon icon="mdi-bookshelf" size="30" color="cyan" />
          </div>
          <div class="brand-text">
            <span class="brand-title"><span class="title-accent">NEO</span> BOOKS</span>
            <span class="brand-subtitle">Portal de Acceso Académico</span>
          </div>
        </div>
        <h1 class="login-main-title">
          Bienvenido a tu <span class="gradient-text">biblioteca digital</span>
        </h1>
        <p class="login-main-desc">
          Accede a tu plataforma de lectura y aprendizaje. Si es tu primera vez, tu cuenta se creará automáticamente.
        </p>
      </div>

      <!-- Main Login Card -->
      <div class="login-card">
        <!-- Role Selection Header ("Apartado Importante") -->
        <div class="role-selection-section">
          <div class="section-label">
            <v-icon icon="mdi-badge-account" size="18" color="cyan" class="mr-1" />
            <span>Selecciona tu perfil de ingreso</span>
            <span class="required-indicator">*Obligatorio</span>
          </div>

          <div class="roles-grid">
            <!-- Docente Role Card -->
            <div
              class="role-card"
              :class="{ 'role-card--active': selectedRole === 'docente' }"
              @click="selectRole('docente')"
              id="role-docente-btn"
              role="button"
              tabindex="0"
              @keydown.enter="selectRole('docente')"
              @keydown.space.prevent="selectRole('docente')"
            >
              <div class="role-card-indicator" v-if="selectedRole === 'docente'">
                <v-icon icon="mdi-check-circle" size="18" color="#06b6d4" />
              </div>
              <div class="role-icon-wrapper role-icon-docente">
                <v-icon icon="mdi-school" size="32" />
              </div>
              <div class="role-info">
                <div class="role-title">Docente</div>
                <div class="role-subtitle">Profesor / Instructor</div>
                <p class="role-desc">
                  Gestión de contenidos, asignación de lecturas y monitoreo de estudiantes.
                </p>
              </div>
              <div class="role-tag role-tag--docente">
                <v-icon icon="mdi-shield-crown-outline" size="14" class="mr-1" />
                Acceso Académico
              </div>
            </div>

            <!-- Estudiante Role Card -->
            <div
              class="role-card"
              :class="{ 'role-card--active': selectedRole === 'estudiante' }"
              @click="selectRole('estudiante')"
              id="role-estudiante-btn"
              role="button"
              tabindex="0"
              @keydown.enter="selectRole('estudiante')"
              @keydown.space.prevent="selectRole('estudiante')"
            >
              <div class="role-card-indicator" v-if="selectedRole === 'estudiante'">
                <v-icon icon="mdi-check-circle" size="18" color="#8b5cf6" />
              </div>
              <div class="role-icon-wrapper role-icon-estudiante">
                <v-icon icon="mdi-account-school" size="32" />
              </div>
              <div class="role-info">
                <div class="role-title">Estudiante</div>
                <div class="role-subtitle">Alumno / Lector</div>
                <p class="role-desc">
                  Acceso al catálogo completo de libros, notas de estudio y actividades.
                </p>
              </div>
              <div class="role-tag role-tag--estudiante">
                <v-icon icon="mdi-book-open-variant" size="14" class="mr-1" />
                Acceso Aprendizaje
              </div>
            </div>
          </div>
        </div>

        <div class="divider-line"></div>

        <!-- Form Section -->
        <form class="auth-form" @submit.prevent="handleAuthSubmit">
          <!-- Form Header Status -->
          <div class="form-status-bar">
            <div class="current-role-badge" :class="`badge--${selectedRole}`">
              <v-icon
                :icon="selectedRole === 'docente' ? 'mdi-school' : 'mdi-account-school'"
                size="16"
                class="mr-1"
              />
              <span>Ingresando como: <strong>{{ selectedRole === 'docente' ? 'Docente' : 'Estudiante' }}</strong></span>
            </div>

            <!-- Dynamic State Badge -->
            <div v-if="userStatus" class="user-status-pill" :class="{ 'pill--new': !userStatus.exists, 'pill--exists': userStatus.exists }">
              <v-icon :icon="userStatus.exists ? 'mdi-account-check' : 'mdi-sparkles'" size="14" class="mr-1" />
              <span>{{ userStatus.exists ? 'Usuario registrado' : 'Nuevo registro detectado' }}</span>
            </div>
          </div>

          <!-- Alert / Error message -->
          <transition name="fade">
            <div v-if="errorMessage" class="error-banner">
              <v-icon icon="mdi-alert-circle-outline" size="20" color="#f87171" class="mr-2" />
              <span>{{ errorMessage }}</span>
            </div>
          </transition>

          <!-- Username Input -->
          <div class="input-group">
            <label for="login-username" class="input-label">
              <span>Nombre de usuario</span>
              <span class="label-hint">Tu identificador</span>
            </label>
            <div class="input-wrapper">
              <v-icon icon="mdi-account-outline" size="20" class="input-icon" />
              <input
                id="login-username"
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="Ej. profesor_garcia o maria.estudiante"
                class="custom-input"
                required
                @input="onUsernameInput"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="input-group">
            <label for="login-password" class="input-label">
              <span>Contraseña</span>
              <span class="label-hint" v-if="userStatus && !userStatus.exists">
                Se guardará como tu clave
              </span>
              <span class="label-hint" v-else>
                Ingresa tu clave
              </span>
            </label>
            <div class="input-wrapper">
              <v-icon icon="mdi-lock-outline" size="20" class="input-icon" />
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Escribe tu contraseña"
                class="custom-input"
                required
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
              >
                <v-icon :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" size="18" />
              </button>
            </div>

            <!-- Contextual help notice for new users -->
            <div class="first-time-hint" v-if="!userStatus || !userStatus.exists">
              <v-icon icon="mdi-information-outline" size="15" color="#06b6d4" class="mr-1" />
              <span>
                <strong>¿Primera vez que ingresas?</strong> No te preocupes, se creará tu perfil con estos datos y la contraseña que elijas hoy.
              </span>
            </div>
          </div>

          <!-- Submit Button -->
          <v-btn
            type="submit"
            size="x-large"
            block
            rounded="lg"
            class="login-btn-submit"
            :loading="isLoading"
            id="login-submit-btn"
          >
            <template #prepend>
              <v-icon :icon="userStatus && userStatus.exists ? 'mdi-login' : 'mdi-account-plus-outline'" />
            </template>
            <span>
              {{ userStatus && userStatus.exists
                ? `Iniciar Sesión como ${selectedRole === 'docente' ? 'Docente' : 'Estudiante'}`
                : `Crear Cuenta e Ingresar como ${selectedRole === 'docente' ? 'Docente' : 'Estudiante'}`
              }}
            </span>
          </v-btn>
        </form>

        <!-- Quick Demo Profiles Helper for Quick Testing -->
        <div class="quick-demo-section">
          <div class="demo-title">
            <v-icon icon="mdi-lightning-bolt" size="14" color="amber" class="mr-1" />
            <span>Accesos rápidos de prueba</span>
          </div>
          <div class="demo-buttons">
            <button
              type="button"
              class="demo-chip"
              @click="fillDemo('profesor_carlos', 'docente123', 'docente')"
            >
              <v-icon icon="mdi-school" size="14" color="#06b6d4" class="mr-1" />
              Docente Demo
            </button>
            <button
              type="button"
              class="demo-chip"
              @click="fillDemo('ana_estudiante', 'estudiante123', 'estudiante')"
            >
              <v-icon icon="mdi-account-school" size="14" color="#8b5cf6" class="mr-1" />
              Estudiante Demo
            </button>
            <button
              v-if="username || password"
              type="button"
              class="demo-chip demo-chip--clear"
              @click="clearForm"
            >
              <v-icon icon="mdi-close" size="14" class="mr-1" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} NEO BOOKS — Plataforma de Gestión y Lectura Digital</p>
      </div>
    </div>

    <!-- Success Feedback Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="#0d1f2d"
      location="top"
      :timeout="2200"
      class="success-snackbar"
    >
      <div class="snackbar-content">
        <v-icon icon="mdi-check-circle" size="24" color="#06b6d4" class="mr-3" />
        <div>
          <div class="snackbar-title">{{ successTitle }}</div>
          <div class="snackbar-subtitle">{{ successMessage }}</div>
        </div>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'login',
})

const { login, checkUserExists } = useAuth()
const router = useRouter()

const selectedRole = ref('docente')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const showSuccessSnackbar = ref(false)
const successTitle = ref('')
const successMessage = ref('')

// Detect whether the username exists in real time
const userStatus = computed(() => {
  if (!username.value || !username.value.trim()) return null
  return checkUserExists(username.value)
})

function selectRole(role) {
  selectedRole.value = role
  errorMessage.value = ''
}

function onUsernameInput() {
  errorMessage.value = ''
  // If user exists and has a known registered role, adapt the role selector to assist the user
  if (userStatus.value && userStatus.value.exists && userStatus.value.role) {
    selectedRole.value = userStatus.value.role
  }
}

function fillDemo(user, pass, role) {
  username.value = user
  password.value = pass
  selectedRole.value = role
  errorMessage.value = ''
}

function clearForm() {
  username.value = ''
  password.value = ''
  errorMessage.value = ''
}

async function handleAuthSubmit() {
  errorMessage.value = ''

  if (!username.value.trim()) {
    errorMessage.value = 'Por favor ingresa un nombre de usuario.'
    return
  }
  if (!password.value.trim()) {
    errorMessage.value = 'Por favor ingresa tu contraseña.'
    return
  }

  isLoading.value = true

  // Short realistic feedback transition
  setTimeout(() => {
    const result = login(username.value, password.value, selectedRole.value)

    if (!result.success) {
      errorMessage.value = result.message
      isLoading.value = false
      return
    }

    // Success! Show snackbar and navigate
    successTitle.value = result.isNewUser ? '¡Cuenta Creada con Éxito!' : '¡Bienvenido de Nuevo!'
    successMessage.value = result.message
    showSuccessSnackbar.value = true

    setTimeout(() => {
      isLoading.value = false
      router.push('/')
    }, 1200)
  }, 500)
}
</script>

<style scoped>
/* ==================== CONTAINER & BACKGROUND ==================== */
.login-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #060a14;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
}

.login-bg-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.28;
  animation: orbFloat 14s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -120px;
  right: -80px;
  animation-delay: -5s;
}

.orb-3 {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, #f59e0b 0%, transparent 70%);
  top: 40%;
  left: 65%;
  animation-delay: -9s;
  opacity: 0.12;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(35px, -25px) scale(1.06); }
  66% { transform: translate(-25px, 20px) scale(0.96); }
}

/* ==================== CONTENT WRAPPER ==================== */
.login-content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

/* ==================== HEADER ==================== */
.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(17, 24, 39, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 8px 20px 8px 12px;
  margin-bottom: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.brand-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.brand-text {
  text-align: left;
}

.brand-title {
  display: block;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  color: #f1f5f9;
}

.title-accent {
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  display: block;
  font-size: 0.72rem;
  color: #94a3b8;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.login-main-title {
  font-size: clamp(1.8rem, 4vw, 2.3rem);
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.2;
  margin: 0 0 10px;
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

.login-main-desc {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 480px;
}

/* ==================== LOGIN CARD ==================== */
.login-card {
  background: rgba(13, 19, 33, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px 30px;
  backdrop-filter: blur(28px) saturate(1.5);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.05);
  transition: border-color 0.3s;
}

/* ==================== ROLE SELECTION ==================== */
.role-selection-section {
  margin-bottom: 24px;
}

.section-label {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
}

.required-indicator {
  margin-left: auto;
  font-size: 0.72rem;
  color: #06b6d4;
  font-weight: 500;
  text-transform: none;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 580px) {
  .roles-grid {
    grid-template-columns: 1fr;
  }
}

.role-card {
  position: relative;
  background: rgba(17, 24, 39, 0.65);
  border: 2px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 20px 18px;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  outline: none;
}

.role-card:hover {
  border-color: rgba(6, 182, 212, 0.35);
  transform: translateY(-3px);
  background: rgba(22, 30, 49, 0.8);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.role-card:focus-visible {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
}

.role-card--active {
  border-color: #06b6d4 !important;
  background: linear-gradient(145deg, rgba(6, 182, 212, 0.12) 0%, rgba(13, 19, 33, 0.9) 100%) !important;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.15) !important;
  transform: translateY(-2px);
}

.role-card-indicator {
  position: absolute;
  top: 14px;
  right: 14px;
  animation: popIn 0.25s ease-out;
}

@keyframes popIn {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.role-icon-wrapper {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  transition: transform 0.25s;
}

.role-card:hover .role-icon-wrapper {
  transform: scale(1.08);
}

.role-icon-docente {
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.28);
  color: #06b6d4;
}

.role-icon-estudiante {
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.28);
  color: #a78bfa;
}

.role-info {
  margin-bottom: 12px;
  width: 100%;
}

.role-title {
  font-size: 1.12rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.2;
}

.role-subtitle {
  font-size: 0.76rem;
  color: #94a3b8;
  margin-top: 2px;
}

.role-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;
  margin: 8px 0 0;
}

.role-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  margin-top: auto;
}

.role-tag--docente {
  background: rgba(6, 182, 212, 0.1);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.role-tag--estudiante {
  background: rgba(139, 92, 246, 0.1);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

/* ==================== DIVIDER ==================== */
.divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 22px 0 24px;
}

/* ==================== FORM STATUS BAR ==================== */
.form-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.current-role-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  padding: 6px 14px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

.badge--docente {
  background: rgba(6, 182, 212, 0.12);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.badge--estudiante {
  background: rgba(139, 92, 246, 0.12);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.user-status-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.76rem;
  padding: 5px 12px;
  border-radius: 100px;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}

.pill--new {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.pill--exists {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

/* ==================== ERROR BANNER ==================== */
.error-banner {
  display: flex;
  align-items: center;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 20px;
}

/* ==================== INPUTS ==================== */
.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.label-hint {
  font-size: 0.74rem;
  color: #06b6d4;
  font-weight: 400;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #64748b;
  pointer-events: none;
  transition: color 0.2s;
}

.custom-input {
  width: 100%;
  background: rgba(17, 24, 39, 0.75);
  border: 1.5px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 14px 44px 14px 44px;
  color: #f1f5f9;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

.custom-input::placeholder {
  color: #475569;
}

.custom-input:focus {
  border-color: #06b6d4;
  background: rgba(17, 24, 39, 0.95);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.18);
}

.input-wrapper:focus-within .input-icon {
  color: #06b6d4;
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.password-toggle-btn:hover {
  color: #06b6d4;
}

.first-time-hint {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  font-size: 0.77rem;
  color: #94a3b8;
  line-height: 1.4;
  padding: 8px 12px;
  background: rgba(6, 182, 212, 0.06);
  border-radius: 10px;
  border-left: 2px solid #06b6d4;
}

/* ==================== SUBMIT BUTTON ==================== */
.login-btn-submit {
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  font-size: 0.96rem !important;
  text-transform: none !important;
  margin-top: 10px;
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn-submit:hover {
  box-shadow: 0 12px 32px rgba(6, 182, 212, 0.5) !important;
  transform: translateY(-2px);
}

/* ==================== QUICK DEMO BUTTONS ==================== */
.quick-demo-section {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.demo-title {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.demo-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.demo-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 6px 12px;
  font-size: 0.76rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(6, 182, 212, 0.3);
  color: #22d3ee;
}

.demo-chip--clear {
  color: #94a3b8;
  margin-left: auto;
}

.demo-chip--clear:hover {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

/* ==================== FOOTER ==================== */
.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.75rem;
  color: #64748b;
}

/* ==================== SNACKBAR ==================== */
.snackbar-content {
  display: flex;
  align-items: center;
  padding: 4px;
}

.snackbar-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
}

.snackbar-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* ==================== ANIMATIONS ==================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
