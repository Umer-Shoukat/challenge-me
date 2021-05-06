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
    return {
      socket: null,
    }
  },

  async mounted() {
    const currentToken = await this.$fire.messaging.getToken()
    console.log(currentToken)

    console.log(this.$auth.user._id)
    this.socket.emit('update-push-noti-id', {
      token: currentToken,
      user_id: this.$auth.user._id,
    })

    this.$fire.messaging.onMessage((payload) => {
      console.info('Message received: ', payload)
    })
    this.$fire.messaging.onTokenRefresh(async () => {
      const refreshToken = await this.$fire.messaging.getToken()
      this.socket.emit('update-push-noti-id', refreshToken)

      console.log('Token Refreshed', refreshToken)
    })
  },

  created() {
    if (process.browser) {
      this.socket = this.$nuxtSocket({})
      this.socket.emit('user-logged-in', this.$auth.user)
    }
  },
}
</script>
