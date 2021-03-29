<template>
  <auth-layout :errors="errors">
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="form.email"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="form.password"
        />
      </div>

      <div class="text-right">
        <router-link to="register"
          >Don't have account Register yourself..</router-link
        >
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/layout/AuthLayout";
export default {
  name: "Login",
  components: { AuthLayout },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errors: [],
    };
  },
  methods: {
    async login() {
      try {
        this.errors = [];
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          if (!this.form[key]) this.errors.push(`${key} is missing`);
        });
        if (this.errors.length) return;

        const resp = await this.$axios.post("login", this.form);
        const { user, token } = resp.data;
        localStorage.setItem("token", token);
        this.$store.commit("user/SET_USER", user);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
