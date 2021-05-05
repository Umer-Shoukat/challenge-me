<template>
  <v-app-bar :clipped-left="false" fixed app>
    <v-app-bar-nav-icon
      @click.stop="$store.commit('app/SET_DRAWER', !drawerVal)"
    />

    <avatar
      class="mr-3"
      :src="$auth.user.avatar"
      :alt="$auth.user.name"
      nameSize="1.2"
      size="40"
    />
    <v-toolbar-title class="capitilize" v-text="$auth.user.name" />

    <v-spacer></v-spacer>

    <v-btn
      color="secondary"
      @click="logout"
      :disabled="loading"
      :loading="loading"
      >Logout</v-btn
    >
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    drawerVal() {
      return this.$store.state.app.drawer
    },
  },
  methods: {
    async logout() {
      try {
        this.loading = true
        await this.$auth.logout()
        this.$router.push('/login')
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
