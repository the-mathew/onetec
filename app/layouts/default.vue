<template>
  <v-app class="app-shell" :theme="'dark'">
    <!-- App Bar -->
    <v-app-bar
      class="app-bar-glass"
      flat
      density="comfortable"
    >
      <v-app-bar-nav-icon
        class="menu-toggle"
        @click="drawer = !drawer"
      />
      <v-app-bar-title class="app-title">
        <span class="title-accent">NEO</span> BOOKS
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        icon="mdi-magnify"
        variant="text"
        class="bar-icon"
      />
      <v-btn
        icon="mdi-bell-outline"
        variant="text"
        class="bar-icon"
      />

      <!-- User Role and Name Indicator -->
      <div v-if="currentUser" class="user-chip-container d-none d-sm-flex align-center mr-2">
        <v-chip
          size="small"
          :color="currentUser.role === 'docente' ? 'cyan' : 'purple'"
          variant="tonal"
          class="user-badge-chip"
        >
          <v-icon
            :icon="currentUser.role === 'docente' ? 'mdi-school' : 'mdi-account-school'"
            start
            size="15"
          />
          <span class="role-chip-text">
            <strong>{{ currentUser.role === 'docente' ? 'Docente' : 'Estudiante' }}:</strong> {{ currentUser.username }}
          </span>
        </v-chip>
      </div>

      <!-- User Avatar and Logout Menu -->
      <v-menu location="bottom end" transition="scale-transition">
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props" class="avatar-action-btn">
            <v-avatar size="34" class="avatar-glow">
              <v-icon :icon="currentUser?.role === 'docente' ? 'mdi-school' : 'mdi-account-circle'" size="20" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact" class="user-dropdown-menu">
          <v-list-item
            v-if="currentUser"
            :title="currentUser.username"
            :subtitle="currentUser.role === 'docente' ? 'Perfil Docente' : 'Perfil Estudiante'"
            :prepend-icon="currentUser.role === 'docente' ? 'mdi-school' : 'mdi-account-school'"
            class="user-info-item"
          />
          <v-divider v-if="currentUser" class="my-1 dropdown-divider" />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            class="logout-dropdown-item"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      class="drawer-glass"
      :rail="rail"
      :permanent="lgAndUp"
      :temporary="!lgAndUp"
      @mouseenter="rail = false"
      @mouseleave="rail = lgAndUp"
    >
      <!-- Brand -->
      <div class="drawer-brand" v-if="!rail">
        <div class="brand-icon-wrap">
          <v-icon icon="mdi-bookshelf" size="28" color="cyan" />
        </div>
        <div>
          <div class="brand-name"><span class="title-accent">NEO</span> BOOKS</div>
          <div class="brand-sub">Biblioteca Digital</div>
        </div>
      </div>
      <div class="drawer-brand drawer-brand--rail" v-else>
        <v-icon icon="mdi-bookshelf" size="26" color="cyan" />
      </div>

      <v-divider class="divider-glow" />

      <!-- Navigation Items -->
      <v-list nav density="comfortable" class="nav-list">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="nav-item"
          active-class="nav-item--active"
          exact
        />
      </v-list>

      <template #append>
        <v-divider class="divider-glow" />
        <v-list nav density="comfortable">
          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="Configuración"
            rounded="lg"
            class="nav-item"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            rounded="lg"
            class="nav-item nav-item--logout"
            @click="handleLogout"
          />
        </v-list>
        <div class="drawer-footer" v-if="!rail">
          <small>© {{ new Date().getFullYear() }} NEO BOOKS</small>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { lgAndUp } = useDisplay()
const drawer = ref(true)
const rail = ref(true)

const { currentUser, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}

const navItems = [
  { title: 'Inicio', icon: 'mdi-home-variant', to: '/' },
  { title: 'Características', icon: 'mdi-star-four-points', to: '/features' },
  { title: 'Testimonios', icon: 'mdi-message-text-outline', to: '/testimonials' },
  { title: 'Contacto', icon: 'mdi-email-outline', to: '/contact' },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg-deep: #060a14;
  --bg-surface: #0d1321;
  --bg-card: #111827;
  --accent-cyan: #06b6d4;
  --accent-violet: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #06b6d4, #8b5cf6);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --glass-bg: rgba(13, 19, 33, 0.85);
  --glass-border: rgba(255, 255, 255, 0.06);
}

* {
  font-family: 'Inter', sans-serif !important;
}

body {
  background: var(--bg-deep) !important;
}

.app-shell {
  background: var(--bg-deep) !important;
}
</style>

<style scoped>
/* App Bar */
.app-bar-glass {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--glass-border) !important;
}

.app-title {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  color: var(--text-primary);
}

.title-accent {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.menu-toggle {
  color: var(--text-secondary);
  transition: color 0.2s;
}

.menu-toggle:hover {
  color: var(--accent-cyan);
}

.bar-icon {
  color: var(--text-secondary) !important;
  transition: color 0.25s;
}

.bar-icon:hover {
  color: var(--accent-cyan) !important;
}

.avatar-glow {
  border: 2px solid transparent;
  background-image: var(--accent-gradient);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  transition: box-shadow 0.3s;
}

.avatar-glow:hover {
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.35);
}

/* Drawer */
.drawer-glass {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(24px) saturate(1.4);
  border-right: 1px solid var(--glass-border) !important;
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 16px;
}

.drawer-brand--rail {
  justify-content: center;
  padding: 20px 0 16px;
}

.brand-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  flex-shrink: 0;
}

.brand-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.brand-sub {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 1px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.divider-glow {
  border-color: var(--glass-border) !important;
  opacity: 1;
}

/* Navigation */
.nav-list {
  padding: 8px !important;
}

.nav-item {
  color: var(--text-secondary) !important;
  margin-bottom: 2px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
}

.nav-item:hover {
  color: var(--text-primary) !important;
  background: rgba(255, 255, 255, 0.04) !important;
}

.nav-item--active {
  color: var(--accent-cyan) !important;
  background: rgba(6, 182, 212, 0.1) !important;
  border: 1px solid rgba(6, 182, 212, 0.15);
}

.nav-item--active :deep(.v-icon) {
  color: var(--accent-cyan) !important;
}

/* Footer */
.drawer-footer {
  padding: 12px 16px;
  text-align: center;
  color: var(--text-secondary);
  opacity: 0.5;
  font-size: 0.72rem;
}

/* Main */
.main-content {
  background: var(--bg-deep);
  min-height: 100vh;
}

/* User Profile & Menu Styles */
.user-chip-container {
  display: flex;
}

.user-badge-chip {
  background: rgba(13, 19, 33, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.role-chip-text {
  font-size: 0.78rem;
  letter-spacing: 0.01em;
}

.avatar-action-btn {
  margin-left: 4px;
}

.user-dropdown-menu {
  background: #0d1321 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 14px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
  padding: 6px !important;
}

.user-info-item {
  border-radius: 8px !important;
}

.dropdown-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.logout-dropdown-item {
  color: #f87171 !important;
  border-radius: 8px !important;
  transition: background 0.2s;
}

.logout-dropdown-item:hover {
  background: rgba(239, 68, 68, 0.12) !important;
}

.nav-item--logout:hover {
  color: #f87171 !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

.nav-item--logout:hover :deep(.v-icon) {
  color: #f87171 !important;
}
</style>
