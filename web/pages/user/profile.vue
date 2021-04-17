<template>
  <div>
    <v-card>
      <v-card-title>Profile Deails</v-card-title>

      <v-card-text>
        <div class="image-container">
          <v-avatar color="red" size="250px">
            <v-img
              v-if="$auth.user.avatar"
              :src="$auth.user.avatar"
              :lazy-src="$auth.user.avatar"
              aspect-ratio="1"
              round
              class="grey lighten-2"
              max-height="250px"
              max-width="250px"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <span
              class="white--text headline capitilize"
              style="font-size: 4.5rem !important"
              v-else
              >{{ $auth.user.name | avatarName }}</span
            >
          </v-avatar>

          <!-- place holder image -->
          <v-btn
            class="mx-2"
            fab
            dark
            color="primary"
            @click="openCropperModal"
          >
            <v-icon dark> mdi-cloud-upload </v-icon>
          </v-btn>
        </div>
        <!-- <v-btn @click="openCropperModal">Show Modal</v-btn> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'profile',

  data() {
    return {}
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
  },
  created() {
    console.log(this.$auth.user)
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
}
</style>
