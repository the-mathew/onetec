interface StoredUser {
  username: string
  password: string
  role: 'docente' | 'estudiante'
}

interface AuthUser {
  username: string
  role: 'docente' | 'estudiante'
}

const STORAGE_KEY = 'neobooks_users'
const SESSION_KEY = 'neobooks_session'

// Global reactive state (shared across components)
const currentUser = ref<AuthUser | null>(null)
const isAuthenticated = ref(false)

function getStoredUsers(): StoredUser[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function saveSession(user: AuthUser) {
  if (import.meta.server) return
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  if (import.meta.server) return
  localStorage.removeItem(SESSION_KEY)
}

function loadSession(): AuthUser | null {
  if (import.meta.server) return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useAuth() {
  // Restore session on first load
  if (!isAuthenticated.value) {
    const saved = loadSession()
    if (saved) {
      currentUser.value = saved
      isAuthenticated.value = true
    }
  }

  function checkUserExists(username: string) {
    if (!username || !username.trim()) return null
    const users = getStoredUsers()
    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    )
    return found ? { exists: true, role: found.role } : { exists: false, role: null }
  }

  /**
   * Attempts to log in. If user doesn't exist, registers them automatically.
   * Returns { success, message, isNewUser }
   */
  function login(username: string, password: string, role: 'docente' | 'estudiante') {
    const cleanUsername = username.trim()
    const cleanPassword = password.trim()

    if (!cleanUsername || !cleanPassword) {
      return {
        success: false,
        message: 'Por favor completa todos los campos requeridos.',
        isNewUser: false,
      }
    }

    const users = getStoredUsers()
    const existing = users.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    )

    if (existing) {
      // User exists — validate password
      if (existing.password !== cleanPassword) {
        return {
          success: false,
          message: 'Contraseña incorrecta. Por favor verifica tus credenciales.',
          isNewUser: false,
        }
      }
      // Password correct
      const authUser: AuthUser = { username: existing.username, role: existing.role }
      currentUser.value = authUser
      isAuthenticated.value = true
      saveSession(authUser)
      return {
        success: true,
        message: `¡Bienvenido de nuevo, ${existing.username}!`,
        isNewUser: false,
      }
    }

    // User doesn't exist — register automatically
    const newUser: StoredUser = { username: cleanUsername, password: cleanPassword, role }
    users.push(newUser)
    saveStoredUsers(users)

    const authUser: AuthUser = { username: cleanUsername, role }
    currentUser.value = authUser
    isAuthenticated.value = true
    saveSession(authUser)

    return {
      success: true,
      message: `¡Cuenta creada exitosamente! Bienvenido a NEO BOOKS, ${cleanUsername}.`,
      isNewUser: true,
    }
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    clearSession()
  }

  function checkAuth(): boolean {
    if (isAuthenticated.value) return true
    const saved = loadSession()
    if (saved) {
      currentUser.value = saved
      isAuthenticated.value = true
      return true
    }
    return false
  }

  return {
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth,
    checkUserExists,
  }
}
