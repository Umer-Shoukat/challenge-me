<template>
  <div :style="defaultStyle" :class="{ 'loader--center': center }">
    <div v-show="!loading" class="h-100">
      <slot />
    </div>
    <div v-if="loading && overlay">
      <v-overlay :opacity="opacity" color="#fefefe">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </div>
    <div v-if="loading && !overlay" class="loader-spinner-wrapper">
      <v-progress-circular indeterminate size="64" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    center: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [String, Number],
      default: 'auto',
    },
    opacity: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    defaultStyle() {
      const css = {
        height:
          typeof this.height === 'string' ? this.height : `${this.height}px`,
      }
      return this.loading ? css : null
    },
  },
}
</script>

<style scoped lang="scss">
.loader--center {
  .loader-spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
