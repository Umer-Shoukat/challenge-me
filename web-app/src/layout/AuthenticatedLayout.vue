<template>
  <loader :loading="loading">
    <div class="main-container">
      <Header />
      <div class="container py-4">
        <slot />
      </div>
      <Footer />
    </div>
  </loader>
</template>

<script>
import Header from "@/layout/components/Header";
import Footer from "@/layout/components/Footer";
export default {
  name: "AuthenticatedLayout",
  components: { Header, Footer },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    min-height: calc(100vh - 96px);
  }
}
</style>
