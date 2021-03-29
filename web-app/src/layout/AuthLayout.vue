<template>
  <div class="auth-container">
    <div class="auth-content card">
      <div class="card-body">
        <div
          class="alert alert-danger mb-2"
          role="alert"
          v-for="error in errors"
          :key="error"
        >
          {{ error }}
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    if (this.user) this.$router.push("/");
  },
};
</script>

<style lang="scss" scoped>
.auth-container {
  min-height: 100vh;
  min-width: 100vw;

  display: grid;
  place-items: center;

  .auth-content {
    background-color: #fff;
    border-radius: 8px;
    max-width: 1000px;
    width: 90%;
    text-align: left;
  }
}
</style>
