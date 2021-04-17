<template>
  <v-dialog
    v-model="dialog"
    overlay-color="#A1AFD3"
    overlay-opacity=".82"
    :retain-focus="false"
    :max-width="modalOptions.maxWidth"
    :persistent="modalOptions.persistent"
    :scrollable="modalOptions.scrollable"
    :fullscreen="modalOptions.fullscreen"
  >
    <v-card class="relative">
      <v-card-title>{{ modalOptions.title }}</v-card-title>

      <v-card-text>
        <component :is="component" v-bind="props" />
      </v-card-text>

      <!-- close icon -->
      <div class="close-icon">
        <v-icon @click="CLOSE_MODAL()"> mdi-close </v-icon>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('globalModal')

// all global components
import modalComponents from './modalComponents'

export default {
  name: 'global-modal',
  data() {
    return {}
  },
  components: {
    ...modalComponents,
  },
  computed: {
    ...mapState(['activeModal', 'component', 'modalOptions', 'props']),
    dialog: {
      get() {
        return !!this.activeModal
      },
      set(val) {
        this.SET_ACTIVE_MODAL({ active: val })
      },
    },
  },
  methods: {
    ...mapMutations(['SET_ACTIVE_MODAL', 'CLOSE_MODAL']),
  },
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
