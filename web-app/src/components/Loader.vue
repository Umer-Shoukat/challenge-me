<template>
  <div
    class="spinner-grow"
    style="width: 5rem; height: 5rem;"
    role="status"
    v-if="loading"
  >
    <span class="sr-only">Loading...</span>
  </div>

  <slot v-else />
</template>

<script>
export default {
  name: "Loader",
  props: { loading: Boolean },
};
</script>

<style lang="scss" scoped></style>
