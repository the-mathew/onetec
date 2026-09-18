export default defineNuxtRouteMiddleware((to) => {
  // Only execute on client side since authentication state is persisted in localStorage
  if (import.meta.server) return

  const { isAuthenticated, checkAuth } = useAuth()
  checkAuth()

  // If user is not authenticated and is trying to access protected routes
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If user is already authenticated and visits the login page, redirect to home
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
