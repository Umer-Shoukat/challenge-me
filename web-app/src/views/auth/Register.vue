<template>
  <auth-layout :errors="errors">
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="exampleInputEmail1">User Name</label>
        <input
          type="test"
          class="form-control"
          id="exampleInputEmail1"
          v-model="form.name"
          aria-describedby="emailHelp"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          v-model="form.email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputEmail1"
          v-model="form.password"
          aria-describedby="emailHelp"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="form.confirmPassword"
        />
      </div>

      <div class="text-right">
        <router-link to="/login"
          >Already have an account Logged in here...</router-link
        >
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/layout/AuthLayout";
export default {
  components: {
    AuthLayout,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        // todo:: will add the DOB functionality
        dob: new Date(),
      },
      errors: [],
    };
  },
  methods: {
    async registerUser() {
      try {
        this.errors = [];
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          if (!this.form[key]) this.errors.push(`${key} is missing`);
        });
        const { password, confirmPassword } = this.form;
        if (password !== confirmPassword)
          this.errors.push("Your Password do not Match");
        if (this.errors.length) return;
        const resp = await this.$axios.post("register", this.form);
        const { token, user } = resp.data;
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
