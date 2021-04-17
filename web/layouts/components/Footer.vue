<template>
  <v-footer :absolute="true" class="footer">
    <span>&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
.footer {
  justify-content: flex-end;
}
</style>
