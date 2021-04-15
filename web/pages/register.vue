<template>
  <v-card :loading="loading">
    <v-card-title>Register</v-card-title>
    <v-card-text>
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
      ></v-text-field>

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
        v-model="form.consfirmPassword"
        type="password"
      ></v-text-field>

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
