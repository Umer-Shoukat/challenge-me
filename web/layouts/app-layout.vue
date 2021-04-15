<template>
  <v-app dark>
    <slot />
    <notifications group="foo"></notifications>
  </v-app>
</template>

<script>
export default {
  name: 'AppLayout',
}
</script>

<style lang="scss" scoped></style>
