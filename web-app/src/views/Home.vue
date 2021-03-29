<template>
  <div class="container">
    <h1 class="heading">Hello world</h1>

    <button class="btn btn-danger" @click="logout">Logout</button>

    <pre>
      {{ user }}
    </pre>
  </div>
</template>

<script>
// @ is an alias to /src
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "Home",
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
