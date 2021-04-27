<template>
  <v-app dark>
    <loader :loading="loading">
      <slot />
    </loader>
    <client-only>
      <notifications group="foo"></notifications>
      <global-modal />
    </client-only>
  </v-app>
</template>

<script>
import GlobalModal from '~/components/global-modal/global-modal'

import { createNamespacedHelpers } from 'vuex'
const appModule = createNamespacedHelpers('app')
export default {
  name: 'AppLayout',
  components: { GlobalModal },
  computed: {
    ...appModule.mapState(['loading']),
  },
  methods: {
    ...appModule.mapMutations(['SET_WINDOW_SIZE']),
    windowSizeHandler() {
      this.SET_WINDOW_SIZE({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    },
  },
  mounted() {
    this.windowSizeHandler()
  },
  created() {
    if (process.browser) {
      window.addEventListener('resize', this.windowSizeHandler, false)
    }

    this.$socket.emit('user')
  },
}
</script>

<style lang="scss" scoped></style>
