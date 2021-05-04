<template>
  <app-layout>
    <side-bar />
    <Header />
    <v-main>
      <v-container class="pb-10">
        <nuxt />
      </v-container>
    </v-main>
    <Footer />
  </app-layout>
</template>

<script>
import AppLayout from './app-layout'
import Header from '~/layouts/components/Header'
import SideBar from '~/layouts/components/SideBar'
import Footer from '~/layouts/components/Footer'

export default {
  components: { AppLayout, Header, SideBar, Footer },
  middleware: 'auth',
  data() {
    return {}
  },

  created() {
    if (process.browser) {
      this.$nuxtSocket({}).emit('user-logged-in', this.$auth.user)
    }
  },
}
</script>
