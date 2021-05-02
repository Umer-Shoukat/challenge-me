<template>
  <div>
    <input
      type="file"
      class="d-none"
      ref="backgroundImage"
      @change="(e) => getImageFromInput('backgroundImage', e)"
    />
    <input
      type="file"
      class="d-none"
      ref="teamImage"
      @change="(e) => getImageFromInput('teamImage', e)"
    />

    <v-card :loading="loading">
      <v-card-title>Add Team Images</v-card-title>
      <div class="images-container">
        <div class="background-image" @click="$refs.backgroundImage.click()">
          <v-img
            lazy-src="https://picsum.photos/900/300"
            :src="
              imagesSrc.backgroundImage
                ? imagesSrc.backgroundImage
                : teamBackgroundPlaceholder
            "
            height="300"
            cover
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
        </div>
        <v-avatar
          color="red"
          size="150px"
          class="team-image"
          @click="$refs.teamImage.click()"
        >
          <v-img
            lazy-src="https://picsum.photos/150/150"
            :src="imagesSrc.image ? imagesSrc.image : teamPlaceholder"
            height="150"
            contain
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
        </v-avatar>
      </div>
    </v-card>

    <v-card class="input-container" :loading="loading">
      <v-card-title>Add Team Details</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Team Name"
          type="text"
          filled
        ></v-text-field>

        <v-textarea
          v-model="form.description"
          auto-grow
          filled
          label="Team Description"
          rows="2"
        ></v-textarea>

        <v-select
          :items="total_players"
          filled
          v-model="form.players_limit"
          label="Total players can join the team"
        ></v-select>

        <v-switch
          v-model="form.isPrivate"
          inset
          label="Private Team"
        ></v-switch>
      </v-card-text>
    </v-card>

    <v-card class="mt-8" :loading="loading">
      <v-card-title>Add Team Rules</v-card-title>
      <v-card-text>
        <v-sheet class="pa-5">
          <v-switch
            v-model="form.rules.co_leader_accept_request"
            inset
            label="Co-leaders can accept the team joining request for other players"
          ></v-switch>

          <v-switch
            v-model="form.rules.co_leader_reject_request"
            inset
            label="Co-leaders can reject the team joining request for other players"
          ></v-switch>

          <v-switch
            v-model="form.rules.co_leader_make_co_leader"
            inset
            label="Co-leaders can make other team players to  co-loeader"
          ></v-switch>

          <v-switch
            v-model="form.rules.co_leader_remove_co_leader"
            inset
            label="Co-leaders can remove other co-leader"
          ></v-switch>

          <v-switch
            v-model="form.rules.co_leader_remove_player"
            inset
            label="Co-leaders can remove team player from the team"
          ></v-switch>

          <v-switch
            v-model="form.rules.co_leader_update_team"
            inset
            label="Co-leaders can make changes to the team or update the team"
          ></v-switch>
        </v-sheet>

        <v-select
          :items="maxCoLeaders"
          filled
          v-model="form.rules.max_co_leader"
          label="Maximum number of co-loeaders"
        ></v-select>
      </v-card-text>
    </v-card>

    <div class="text-right mt-8 mb-10">
      <v-btn
        :loading="loading"
        :disabled="loading || !validInputs"
        @click="createTeam"
        >Update Team</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-team',
  data() {
    return {
      loading: true,
      form: {
        _id: '',
        name: '',
        description: '',
        isPrivate: true,
        players_limit: 8,
        rules: {
          co_leader_accept_request: false,
          co_leader_reject_request: false,
          co_leader_make_co_leader: false,
          co_leader_remove_co_leader: false,
          co_leader_remove_player: false,
          co_leader_update_team: false,
          max_co_leader: 0,
        },
      },

      images: {
        image: null,
        backgroundImage: null,
      },
      imagesSrc: {
        image: null,
        backgroundImage: null,
      },
      imageType: null,
      teamBackgroundPlaceholder: 'https://picsum.photos/900/300',
      teamPlaceholder: 'https://picsum.photos/150/150',
    }
  },
  computed: {
    validInputs() {
      if (!this.form.name || !this.form.description) return false
      return true
    },
    total_players() {
      return [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    maxCoLeaders() {
      return [1, 2, 3, 4]
    },
  },
  methods: {
    getImageFromInput(imageType, event) {
      const { files } = event.target
      if (files && files[0]) {
        this.addFileToCropper(imageType, files[0])
      }
    },
    addFileToCropper(imageType, file) {
      this.imageType = imageType
      let stencilHeight = 250
      let stencilWidth = 250
      let aspectRatio = 1
      let rounded = true

      if (imageType === 'backgroundImage') {
        stencilHeight = 500
        stencilWidth = 1500
        aspectRatio = 3 / 1
        rounded = false
      }

      this.$store.commit('globalModal/SET_ACTIVE_MODAL', {
        active: true,
        component: 'Cropper',
        props: {
          imageFile: file,
          emitFile: true,
          stencilHeight,
          stencilWidth,
          aspectRatio,
          rounded,
        },
      })
    },
    setCroppedImages({ blob, src }) {
      if (this.imageType === 'backgroundImage') {
        this.images.backgroundImage = blob
        this.imagesSrc.backgroundImage = src
      } else if (this.imageType === 'teamImage') {
        this.images.image = blob
        this.imagesSrc.image = src
      }
      this.imageType = null
      this.$store.commit('globalModal/CLEAR_CROPPER_PAYLOAD')
    },
    async createTeam() {
      try {
        console.log('hello world')
        this.loading = true

        const teamResp = await this.$axios.patch('team', this.form)
        console.log(teamResp)
        const { team } = teamResp.data

        const { image, backgroundImage } = this.images
        if (image || backgroundImage) {
          const fd = new FormData()

          fd.append('team_id', team._id)
          if (image) fd.append('image', image)
          if (backgroundImage) fd.append('backgroundImage', backgroundImage)

          await this.$axios.post('save-team-images', fd, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }

        this.loading = false
        this.$router.push(`/teams/${this.$route.params.id}`)
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    async fetchTeam() {
      try {
        const resp = await this.$axios.get(`team/${this.$route.params.id}`)
        const { team } = resp.data
        const { background_url, image_url } = team

        for (const key in this.form) {
          if (Object.hasOwnProperty.call(this.form, key)) {
            this.form[key] = team[key]
          }
        }

        if (team.leader._id !== this.$auth.user._id) {
          return this.$router.push('/teams')
        }

        this.imagesSrc.image = image_url
        this.imagesSrc.backgroundImage = background_url
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'globalModal/SET_CROPPER_PAYLOAD') {
        this.setCroppedImages(state.globalModal.cropperPayload)
      }
    })
    this.fetchTeam()
  },
}
</script>

<style lang="scss" scoped>
.images-container {
  position: relative;
  .background-image {
    min-height: 300px;
    // background: blue;
  }
  .team-image {
    position: absolute;
    transform: translate(22%, -50%);
  }
}
.input-container {
  margin-top: 5.5rem;
}
</style>
