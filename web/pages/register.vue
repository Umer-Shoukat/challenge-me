<template>
  <v-card :loading="loading">
    <v-card-title>Register</v-card-title>
    <v-card-text @keypress.enter="register">
      <v-text-field
        label="Enter Username"
        :rules="rules"
        hide-details="auto"
        v-model="form.name"
      ></v-text-field>

      <v-text-field
        label="Enter Email"
        :rules="rules"
        hide-details="auto"
        v-model="form.email"
        class="mt-5"
      ></v-text-field>

      <v-text-field
        label="Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.password"
        type="password"
        class="mt-5"
      ></v-text-field>

      <v-text-field
        label="Confirm Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.consfirmPassword"
        type="password"
        class="mt-5"
      ></v-text-field>

      <p class="text-right mt-3">
        <nuxt-link to="/login">Already have an account? Sign in...</nuxt-link>
      </p>

      <v-card-actions>
        <v-btn
          depressed
          color="primary"
          class="mt-5"
          :disabled="loading"
          :loading="loading"
          @click="register"
        >
          Register
        </v-btn>
      </v-card-actions>
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
        consfirmPassword: '',
        name: '',
        dob: '11/09/1998',
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
    async register() {
      try {
        this.loading = true
        await this.$axios.post('register', this.form)
        await this.$auth.loginWith('local', { data: this.form })
        this.$router.push('/')
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
