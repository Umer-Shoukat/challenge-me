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
}
</script>

<style lang="scss" scoped></style>
