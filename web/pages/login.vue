<template>
  <v-card :loading="loading">
    <v-card-title>Login</v-card-title>
    <v-card-text @keypress.enter="login">
      <v-text-field
        label="Enter Email"
        :rules="rules"
        hide-details="auto"
        v-model="form.email"
        placeholder=" "
        type="email"
      ></v-text-field>

      <v-text-field
        placeholder=" "
        label="Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.password"
        class="mt-5"
        :type="showPass ? 'text' : 'password'"
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPass = !showPass"
        :name="Math.random()"
      ></v-text-field>

      <p class="d-flex align-items-center justify-content-between mt-3">
        <nuxt-link to="/forgot-password">Forgot Password</nuxt-link>

        <nuxt-link to="/register"
          >Don't have an account? Create One...</nuxt-link
        >
      </p>

      <v-btn
        depressed
        color="primary"
        class="mt-5"
        :disabled="loading"
        :loading="loading"
        @click="login"
      >
        Login
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'login',
  layout: 'auth-layout',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      showPass: false,
      loading: false,
    }
  },
  computed: {
    rules() {
      return [(value) => !!value || 'Required.']
    },
  },
  methods: {
    async login() {
      try {
        this.loading = true
        await this.$auth.loginWith('local', { data: this.form })
        this.$router.push('/')
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
