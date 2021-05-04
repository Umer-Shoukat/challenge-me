<template>
  <div>
    <v-card>
      <v-card-title>Profile Deails</v-card-title>

      <v-card-text>
        <div class="image-container">
          <avatar
            size="250"
            :src="$auth.user.avatar"
            :alt="$auth.user.name"
            nameSize="4.5"
          />

          <!-- place holder image -->
          <v-btn
            class="floating-btn"
            dark
            color="primary"
            @click="openCropperModal"
            absolute
            fab
            bottom
            right
            small
          >
            <v-icon dark> mdi-cloud-upload </v-icon>
          </v-btn>
        </div>

        <loader :loading="loading" height="300px">
          <ul class="collection">
            <li class="collection-item">
              <span class="text">ID:</span>
              <strong>{{ $auth.user._id }}</strong>
            </li>
            <li class="collection-item">
              <span class="text">Name:</span>
              <strong>{{ $auth.user.name }}</strong>
            </li>
            <li class="collection-item">
              <span class="text">Email: </span
              ><strong>{{ $auth.user.email }}</strong>
            </li>
            <li class="collection-item">
              <span class="text">Date of birth:</span>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Birthday date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="date"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu>
            </li>
          </ul>
        </loader>

        <!-- <v-btn @click="logoutAll" color="error">Logout from all devices</v-btn> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'profile',

  data() {
    return {
      date: null,
      menu: false,
      loading: false,
    }
  },
  methods: {
    openCropperModal() {
      this.$store.commit('globalModal/SET_ACTIVE_MODAL', {
        active: true,
        component: 'Cropper',
        props: {
          uploadEndPoint: 'upload-avatar',
          fieldName: 'avatar',
        },
      })
    },
    async save(date) {
      this.$refs.menu.save(date)
      try {
        this.loading = true
        const resp = await this.$axios.patch('user', {
          dob: this.date,
        })
        const { user } = resp.data
        this.$auth.setUser(user)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    async logoutAll() {
      try {
        this.$store.commit('app/SET_GLOBAL_LOADING', true)
        await this.$axios.get('logout-all')
        localStorage.removeItem('auth._token.local')
        localStorage.removeItem('auth._token_expiration.local')
        this.$router.push('/login')
        this.$store.commit('app/SET_GLOBAL_LOADING', false)
      } catch (err) {
        this.$store.commit('app/SET_GLOBAL_LOADING', false)
        console.log(err)
      }
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  created() {
    if (this.$auth.user.dob) {
      this.date = this.$dayjs(this.$auth.user.dob).format('YYYY-MM-DD')
    } else {
      this.date = this.$dayjs().format('YYYY-MM-DD')
    }
  },
}
</script>

<style lang="scss" scoped>
.image-container {
  max-height: 250px;
  max-width: 250px;
  position: relative;
  // border-radius: 50%;
  // overflow: hidden;

  .floating-btn {
    bottom: 0.5rem !important;
  }
}

.collection {
  padding: 0;
  margin: 0;
  list-style: none;
  margin-top: 2rem;

  &-item {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;

    span.text {
      margin-right: 1rem;
    }
  }
}
</style>
