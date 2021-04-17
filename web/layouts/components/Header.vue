<template>
  <v-app-bar :clipped-left="false" fixed app>
    <v-app-bar-nav-icon
      @click.stop="$store.commit('app/SET_DRAWER', !drawerVal)"
    />
    <v-avatar color="red" class="mr-3">
      <span class="white--text headline capitilize" v-if="!$auth.user.avatar">{{
        $auth.user.name | avatarName
      }}</span>
      <img v-else src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
    </v-avatar>
    <v-toolbar-title v-text="$auth.user.name" />

    <v-spacer></v-spacer>

    <v-btn color="secondary" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    drawerVal() {
      return this.$store.state.app.drawer
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="scss" scoped></style>
