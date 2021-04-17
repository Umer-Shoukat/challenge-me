<template>
  <v-card :loading="loading">
    <v-card-title>Reset Password</v-card-title>
    <v-card-text @keypress.enter="resetPassword">
      <v-text-field
        label="Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.password"
        type="password"
      ></v-text-field>

      <v-text-field
        label="Confirm Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.confirmPassword"
        type="password"
      ></v-text-field>

      <v-card-actions>
        <v-btn
          depressed
          color="primary"
          class="mt-5"
          :disabled="loading"
          :loading="loading"
          @click="resetPassword"
        >
          Reset Password
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'reset-password',
  layout: 'auth-layout',
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
        token: '',
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
    async resetPassword() {
      const { password, confirmPassword } = this.form
      if (password !== confirmPassword)
        return this.$notify({
          group: 'foo',
          title: 'Error',
          text: 'Password do not matched',
          type: 'error',
        })
      try {
        this.loading = true
        await this.$axios.post('reset-password', this.form)
        this.$router.push(`/login`)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
  },
  created() {
    this.form.token = this.$route.query.token
  },
}
</script>

<style lang="scss" scoped></style>
