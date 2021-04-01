<template>
  <auth-layout :errors="errors">
    <form @submit.prevent="resetPassword">
      <div class="form-group">
        <label for="exampleInputEmail1">Enter Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="form.password"
        />
      </div>

      <div class="form-group">
        <label for="exampleInputEmail1">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="form.confirm_password"
        />
      </div>

      <button type="submit" class="btn btn-primary mt-5">Send</button>
    </form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/layout/AuthLayout";
export default {
  name: "ResetPassword",
  components: { AuthLayout },
  data() {
    return {
      form: {
        password: "",
        confirm_password: "",
      },
      errors: [],
    };
  },
  methods: {
    async resetPassword() {
      try {
        this.errors = [];
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          if (!this.form[key]) this.errors.push(`${key} is missing`);
        });
        if (this.errors.length) return;

        const resp = await this.$axios.post("/reset-password", {
          ...this.form,
          token: this.$route.query.token,
        });

        const { msg } = resp.data;
        console.log(msg);

        this.$router.push("/login");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
