<template>
  <auth-layout :errors="errors">
    <form @submit.prevent="sendOTP">
      <div class="form-group">
        <label for="exampleInputEmail1">Enter OTP</label>
        <input
          type="number"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="form.otp_code"
        />
      </div>

      <button type="submit" class="btn btn-primary mt-5">Send</button>
    </form>
  </auth-layout>
</template>

<script>
import AuthLayout from "@/layout/AuthLayout";
export default {
  name: "VerifyOTP",
  components: { AuthLayout },
  data() {
    return {
      form: {
        otp_code: "",
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

        const resp = await this.$axios.post("verify-otp", {
          ...this.form,
          email: this.$route.query.email,
        });

        const { otp_verified, token } = resp.data;

        if (otp_verified)
          return this.$router.push(`reset-password?token=${token}`);

        this.errors.push("INcorrect OTP");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
