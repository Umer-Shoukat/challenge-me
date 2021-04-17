<template>
  <v-card :loading="loading">
    <v-card-title>Verify Code</v-card-title>
    <v-card-text @keypress.enter="verifyOtTP">
      <v-text-field
        label="Email"
        :rules="rules"
        hide-details="auto"
        disabled
        v-model="form.email"
        type="email"
      ></v-text-field>

      <v-text-field
        label="Enter Code to verify"
        :rules="rules"
        hide-details="auto"
        v-model="form.otp_code"
        type="text"
        class="text-center OTP"
      ></v-text-field>

      <v-card-actions>
        <v-btn
          depressed
          color="primary"
          class="mt-5"
          :disabled="loading"
          :loading="loading"
          @click="verifyOtTP"
        >
          Verify
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'verify-otp',
  layout: 'auth-layout',
  data() {
    return {
      form: {
        email: '',
        otp_code: '',
      },
      loading: false,
    }
  },
  computed: {
    rules() {
      return [(value) => !!value || 'Required.']
    },
  },
  methods: {
    async verifyOtTP() {
      try {
        this.loading = true
        const resp = await this.$axios.post('verify-otp', this.form)
        const { token } = resp.data
        this.$router.push(`/reset-password?token=${token}`)

        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
  },
  created() {
    // if (!this.$route.query.email) return this.$router.push('/login')
    this.form.email = this.$route.query.email
  },
}
</script>

<style lang="scss" scoped></style>
