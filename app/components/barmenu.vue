<template>
  <div class="barmenu-container">
    <div class="menu-nav-links">
      <div
        v-for="group in groups"
        :key="group.name"
        class="menu-group-wrapper"
      >
        <!-- Button with Dropdown -->
        <v-menu
          v-if="group.submenu && group.submenu.length"
          location="bottom start"
          offset="8"
          open-on-hover
          :close-on-content-click="true"
          transition="slide-y-transition"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="nav-group-btn"
              :class="{ 'nav-group-btn--active': isGroupActive(group) }"
              rounded="lg"
            >
              <v-icon
                v-if="group.icon"
                :icon="group.icon"
                size="17"
                class="mr-1"
                :color="isGroupActive(group) ? 'cyan' : undefined"
              />
              <span class="group-title">{{ group.name }}</span>
              <v-icon
                icon="mdi-chevron-down"
                size="15"
                class="ml-1 chevron-icon"
              />
            </v-btn>
          </template>

          <v-card class="menu-dropdown-card" elevation="12">
            <!-- Header for Categories Dropdown -->
            <div v-if="group.name === 'Categorías'" class="dropdown-header">
              <div class="d-flex align-center justify-space-between">
                <span class="dropdown-header-title">
                  <v-icon icon="mdi-shape-outline" size="16" color="cyan" class="mr-1" />
                  Categorías de Lectura
                </span>
                <v-chip size="x-small" color="cyan" variant="tonal">
                  {{ categories.length }} géneros
                </v-chip>
              </div>
              <p class="dropdown-header-subtitle">
                Filtra y descubre títulos por temática
              </p>
            </div>

            <!-- List items -->
            <v-list density="compact" class="dropdown-list" nav>
              <v-list-item
                v-for="item in group.submenu"
                :key="item.value || item.title"
                :to="item.to"
                class="dropdown-item"
                rounded="lg"
                @click="onSelect(item)"
              >
                <!-- Category specific icon with colored background -->
                <template #prepend>
                  <div
                    class="item-icon-box"
                    :style="{
                      background: item.color ? `${item.color}1a` : 'rgba(6, 182, 212, 0.12)',
                      borderColor: item.color ? `${item.color}40` : 'rgba(6, 182, 212, 0.25)',
                    }"
                  >
                    <v-icon
                      :icon="item.icon || 'mdi-bookmark-outline'"
                      size="18"
                      :color="item.color || 'cyan'"
                    />
                  </div>
                </template>

                <v-list-item-title class="dropdown-item-title">
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle v-if="item.subtitle" class="dropdown-item-subtitle">
                  {{ item.subtitle }}
                </v-list-item-subtitle>

                <template #append v-if="item.badge">
                  <span class="item-badge-pill" :style="{ color: item.color || '#94a3b8' }">
                    {{ item.badge }}
                  </span>
                </template>
              </v-list-item>
            </v-list>

            <!-- Bottom action for Categories -->
            <div v-if="group.name === 'Categorías'" class="dropdown-footer">
              <v-btn
                block
                variant="tonal"
                color="cyan"
                size="small"
                rounded="lg"
                to="/categories"
                prepend-icon="mdi-view-grid-outline"
                append-icon="mdi-arrow-right"
                class="view-all-btn"
              >
                Explorar todas las categorías
              </v-btn>
            </div>
          </v-card>
        </v-menu>

        <!-- Direct Button without Dropdown -->
        <v-btn
          v-else
          :to="group.to"
          variant="text"
          class="nav-group-btn"
          rounded="lg"
          exact
        >
          <v-icon
            v-if="group.icon"
            :icon="group.icon"
            size="17"
            class="mr-1"
          />
          <span class="group-title">{{ group.name }}</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategories } from '~/composables/useCategories'

const router = useRouter()
const route = useRoute()
const { categories } = useCategories()

// Construct categories submenu dynamically from useCategories
const categorySubmenu = computed(() => {
  return categories.value.map((cat) => ({
    title: cat.title,
    subtitle: cat.description,
    value: cat.slug,
    icon: cat.icon,
    color: cat.color,
    badge: cat.badge,
    to: `/categories?cat=${cat.slug}`,
  }))
})

const groups = computed(() => [
  {
    name: 'Inicio',
    icon: 'mdi-home-variant-outline',
    to: '/',
    submenu: [
      {
        title: 'Explorar Plataforma',
        subtitle: 'Bienvenido a NEO BOOKS',
        icon: 'mdi-compass-outline',
        color: '#06b6d4',
        to: '/',
      },
      {
        title: 'Características Clave',
        subtitle: 'Herramientas avanzadas de lectura',
        icon: 'mdi-star-four-points-outline',
        color: '#8b5cf6',
        to: '/features',
      },
      {
        title: 'Testimonios',
        subtitle: 'Opiniones de nuestros lectores',
        icon: 'mdi-message-text-outline',
        color: '#10b981',
        to: '/testimonials',
      },
    ],
  },
  {
    name: 'Categorías',
    icon: 'mdi-shape-outline',
    to: '/categories',
    submenu: categorySubmenu.value,
  },
  {
    name: 'Explorar',
    icon: 'mdi-compass-outline',
    submenu: [
      {
        title: 'Funcionalidades',
        subtitle: 'Organización, sincronización y filtros',
        icon: 'mdi-view-grid-plus-outline',
        color: '#06b6d4',
        to: '/features',
      },
      {
        title: 'Biblioteca Digital',
        subtitle: 'Sube y descarga libros y documentos PDF',
        icon: 'mdi-library-shelves',
        color: '#10b981',
        to: '/library',
      },
      {
        title: 'Opiniones de la Comunidad',
        subtitle: 'Calificaciones y reseñas verificadas',
        icon: 'mdi-account-group-outline',
        color: '#8b5cf6',
        to: '/testimonials',
      },
      {
        title: 'Contacto & Soporte',
        subtitle: 'Atención personalizada para lectores',
        icon: 'mdi-email-fast-outline',
        color: '#f59e0b',
        to: '/contact',
      },
    ],
  },
])

function isGroupActive(group) {
  if (group.to && route.path === group.to) return true
  if (group.name === 'Categorías' && route.path.startsWith('/categories')) return true
  return false
}

function onSelect(item) {
  if (item.to) {
    router.push(item.to)
  }
}
</script>

<style scoped>
.barmenu-container {
  display: flex;
  align-items: center;
}

.menu-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-group-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  font-size: 0.88rem !important;
  letter-spacing: 0.01em !important;
  color: #94a3b8 !important;
  height: 38px !important;
  padding: 0 14px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: transparent !important;
}

.nav-group-btn:hover {
  color: #f1f5f9 !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.nav-group-btn--active {
  color: #06b6d4 !important;
  background: rgba(6, 182, 212, 0.1) !important;
  border: 1px solid rgba(6, 182, 212, 0.2) !important;
}

.chevron-icon {
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.nav-group-btn:hover .chevron-icon {
  opacity: 1;
}

/* Dropdown Card */
.menu-dropdown-card {
  background: rgba(13, 19, 33, 0.95) !important;
  backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(6, 182, 212, 0.1) !important;
  min-width: 320px;
  max-width: 420px;
  overflow: hidden;
  padding: 6px;
}

.dropdown-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 4px;
}

.dropdown-header-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
}

.dropdown-header-subtitle {
  font-size: 0.72rem;
  color: #64748b;
  margin: 4px 0 0;
}

.dropdown-list {
  background: transparent !important;
  padding: 4px !important;
}

.dropdown-item {
  color: #cbd5e1 !important;
  margin-bottom: 3px !important;
  padding: 8px 10px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 10px !important;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
  transform: translateX(3px);
}

.item-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  margin-right: 12px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.dropdown-item:hover .item-icon-box {
  transform: scale(1.08);
}

.dropdown-item-title {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  color: #f1f5f9;
}

.dropdown-item-subtitle {
  font-size: 0.72rem !important;
  color: #64748b !important;
  white-space: normal;
  line-height: 1.35;
  margin-top: 2px;
}

.item-badge-pill {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.dropdown-footer {
  padding: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 4px;
}

.view-all-btn {
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
}
</style>