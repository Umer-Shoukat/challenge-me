<template>
  <app-layout dark>
    <v-main>
      <div class="full-center">
        <div class="auth-container">
          <nuxt />
        </div>
      </div>
    </v-main>
  </app-layout>
</template>

<script>
import AppLayout from './app-layout'
export default {
  name: 'auth-layout',
  components: { AppLayout },
  middleware: ['auth-page'],
}
</script>

<style lang="scss" scoped>
.full-center {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.auth-container {
  width: 650px;

  @media (max-width: 769px) {
    width: 90%;
  }
}
</style>
