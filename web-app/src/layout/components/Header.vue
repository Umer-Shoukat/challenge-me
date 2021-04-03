<template>
  <div class="bg-light">
    <nav class="navbar navbar-light ">
      <router-link class="navbar-brand" to="/">Header</router-link>
      <button type="button" class="btn btn-outline-danger" @click="logout">
        Logout
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Header",
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
