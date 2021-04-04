<template>
  <div class="bg-light">
    <nav class="navbar navbar-light ">
      <router-link class="navbar-brand" to="/">Header</router-link>
      <div class="d-flex align-items-center">
        <p class="name mb-0 text-bold mr-5">{{ user.name }}</p>
        <button type="button" class="btn btn-outline-danger" @click="logout">
          Logout
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "Header",
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async logout() {
      try {
        await this.$axios.get("logout");
        localStorage.removeItem("token");
        this.$store.commit("user/SET_USER", null);
        this.$router.push("/login");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  max-width: 1300px;
  margin: 0 auto;
}
</style>
