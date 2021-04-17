<template>
  <v-card :loading="loading">
    <v-card-title>Enter Your Email to get OTP</v-card-title>
    <v-card-text @keypress.enter="forgotPassword">
      <v-text-field
        label="Enter Your Email"
        :rules="rules"
        hide-details="auto"
        v-model="form.email"
      ></v-text-field>

      <v-card-actions>
        <v-btn
          depressed
          color="primary"
          class="mt-5"
          :disabled="loading"
          :loading="loading"
          @click="forgotPassword"
        >
          Send Email
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'forgot-password',
  layout: 'auth-layout',
  data() {
    return {
      form: {
        email: '',
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
    async forgotPassword() {
      try {
        this.loading = true
        await this.$axios.post('send-otp', this.form)
        this.$router.push(`/verify-otp?email=${this.form.email}`)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
