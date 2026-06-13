<template>
  <div class="login-wrapper d-flex align-center justify-center bg-background">
    <!-- Animated background blobs untuk estetika modern -->
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>

    <v-card
      class="login-card rounded-xl elevation-24 pa-8 pa-sm-12 glass"
      width="100%"
      max-width="480"
    >
      <div class="text-center mb-8">
        <div class="logo-container mx-auto mb-6 d-flex align-center justify-center">
          <img :src="'/images/logo.png'" alt="Logo" style="width: 70px; height: 70px; object-fit: contain;" />
        </div>
        <h1 class="text-h4 font-weight-black mb-2 text-gradient">Welcome Back</h1>
        <p class="text-body-1 text-medium-emphasis">Silakan masuk ke akun Anda</p>
      </div>

      <v-form @submit.prevent="handleLogin" v-model="isFormValid">
        <v-text-field
          v-model="email"
          label="Email Address"
          placeholder="admin@example.com"
          prepend-inner-icon="tabler-mail"
          variant="outlined"
          color="primary"
          density="comfortable"
          class="mb-2"
          :rules="[v => !!v || 'Email wajib diisi', v => /.+@.+\..+/.test(v) || 'Format email tidak valid']"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          placeholder="Masukkan sandi rahasia"
          prepend-inner-icon="tabler-lock"
          :append-inner-icon="showPassword ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          color="primary"
          density="comfortable"
          class="mb-6"
          :rules="[v => !!v || 'Password wajib diisi']"
          required
        ></v-text-field>

        <v-expand-transition>
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-6 rounded-lg text-body-2"
            closable
            @click:close="errorMessage = ''"
            icon="tabler-alert-circle"
          >
            {{ errorMessage }}
          </v-alert>
        </v-expand-transition>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          rounded="pill"
          block
          class="rounded-lg text-button font-weight-bold login-btn"
          :loading="loading"
          elevation="4"
        >
          SIGN IN
          <v-icon end icon="tabler-arrow-right" class="ml-2" />
        </v-btn>
      </v-form>

      <div class="text-center mt-8">
        <v-divider class="mb-4"></v-divider>
        <p class="text-caption text-medium-emphasis">
          Petunjuk Demo:<br>
          <span class="font-weight-bold text-primary">admin@example.com</span> / <span class="font-weight-bold text-primary">password123</span>
        </p>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'

// Gunakan layout blank agar sidebar tidak muncul
definePageMeta({
  layout: 'blank'
})

useHead({
  title: 'Sign In | NuxDash'
})

import { authService } from '~/services/auth.service'

const router = useRouter()
const isFormValid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Nuxt useCookie untuk menyimpan token secara otomatis ke browser cookies
const authToken = useCookie('auth_token', { maxAge: 60 * 60 * 24, path: '/' }) // 24 hours
const authUser = useCookie('auth_user', { maxAge: 60 * 60 * 24, path: '/' })

async function handleLogin() {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response: any = await authService.login({
      email: email.value,
      password: password.value
    })

    if (response.status) {
      // Simpan JWT token dan data user ke dalam Cookie
      authToken.value = response.data.token
      authUser.value = JSON.stringify(response.data.user)

      // Beri sedikit jeda animasi lalu redirect ke dashboard
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      errorMessage.value = response.message || 'Login failed'
    }
  } catch (error: any) {
    // Tangkap error 400/401 dari API Axios
    errorMessage.value = error.response?.data?.message || error.message || 'Terjadi kesalahan koneksi dengan server'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '../assets/scss/pages/login';
</style>
