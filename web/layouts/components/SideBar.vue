<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="false"
    :clipped="false"
    fixed
    app
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Inspire',
        //   to: '/inspire',
        // },
        {
          icon: 'mdi-group',
          title: 'Teams',
          to: '/teams',
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/user/profile',
        },
      ],
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.app.drawer
      },
      set(value) {
        this.$store.commit('app/SET_DRAWER', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
