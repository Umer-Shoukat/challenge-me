<template>
  <auth-layout :errors="errors">
    <form @submit.prevent="sendOTP">
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

      <button type="submit" class="btn btn-primary mt-5">Send OTP</button>
    </form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/layout/AuthLayout";
export default {
  name: "ForgotPassword",
  components: { AuthLayout },
  data() {
    return {
      form: {
        email: "",
      },
      errors: [],
    };
  },
  methods: {
    async sendOTP() {
      try {
        this.errors = [];
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          if (!this.form[key]) this.errors.push(`${key} is missing`);
        });
        if (this.errors.length) return;

        const resp = await this.$axios.post("send-otp", this.form);
        console.log(resp.data.msg);
        this.$router.push(`/verify-otp?email=${this.form.email}`);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
