<template>
  <v-card :loading="loading">
    <v-card-text>
      <h1>Login</h1>
      <v-text-field
        label="Enter Email"
        :rules="rules"
        hide-details="auto"
        v-model="form.email"
      ></v-text-field>

      <v-text-field
        label="Password"
        :rules="rules"
        hide-details="auto"
        v-model="form.password"
        type="password"
      ></v-text-field>

      <v-btn
        depressed
        color="primary"
        class="mt-5"
        :disabled="loading"
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
        await this.$auth.loginWith('local', { data: this.form })
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
