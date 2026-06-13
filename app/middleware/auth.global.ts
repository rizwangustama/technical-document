export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')
  
  // Jika tidak punya token dan mencoba mengakses halaman selain login,
  // maka tendang kembali ke halaman login.
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Jika sudah punya token tapi mencoba mengakses halaman login,
  // maka arahkan ke dashboard.
  if (token.value && to.path === '/login') {
    return navigateTo('/')
  }
})
