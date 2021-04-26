<template>
  <loader :loading="loading">
    <div class="mb-5 d-flex align-items-center justify-content-between">
      <v-btn color="accent" to="/teams">
        <v-icon left> mdi-keyboard-backspace </v-icon>
        Back
      </v-btn>

      <div v-if="$auth.user._id === team.leader._id">
        <v-btn color="primary" :to="`/teams/edit/${$route.params.id}`">
          <v-icon left> mdi-mode-edit </v-icon>
          Edit
        </v-btn>

        <v-btn color="danger" to="/teams" class="ml-3">
          <v-icon left> mdi-delete </v-icon>
          Delete
        </v-btn>
      </div>
    </div>
    <div class="images-container">
      <div class="background-image">
        <v-img
          lazy-src="https://picsum.photos/900/300"
          :src="backgroundImage"
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
      <v-avatar color="red" size="150px" class="team-image">
        <v-img
          lazy-src="https://picsum.photos/150/150"
          :src="teamImage"
          height="150"
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
      </v-avatar>
    </div>

    <div class="text-right mt-5">
      <v-btn
        v-if="hasJoined && !isLeader"
        :disabled="hasRequested"
        @click="joinTeam"
        class="ml-auto"
        >{{ hasRequested ? 'Request Pending' : 'Join Team' }}</v-btn
      >
    </div>

    <v-card class="team-description">
      <v-card-title>
        <h1>{{ team.name }}</h1>
      </v-card-title>
      <v-card-text>
        {{ team.description }}
      </v-card-text>
    </v-card>

    <v-card class="mt-5 detail">
      <div class="detail-item">
        <h3 class="detail-label">Players Joined</h3>
        <div class="detail-value">
          {{ `${team.players_list.length} / ${team.players_limit}` }}
        </div>
      </div>

      <div class="detail-item">
        <h3 class="detail-label">Private</h3>
        <div class="detail-value">
          {{ team.isPrivate ? 'Yes' : 'No' }}
        </div>
      </div>
    </v-card>

    <v-row class="mt-5">
      <v-col v-if="!isLeader">
        <v-card>
          <v-card-title class="pb-0">Team Leader</v-card-title>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <avatar :src="team.leader.avatar" :alt="team.leader.name" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  v-html="team.leader.name"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="team.leader.dob"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-if="!isLeader">
        <v-card>
          <v-card-title class="pb-0">Players List</v-card-title>
          <v-list two-line>
            <template v-if="team.players_list.length">
              <v-list-item v-for="user in team.players_list" :key="user.name">
                <v-list-item-avatar>
                  <avatar :src="user.avatar" :alt="user.name" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="user.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="user.dob"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>
                  No Player Available at the moment
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="isLeader">
        <v-card>
          <v-card-title class="pb-0">Players List</v-card-title>
          <v-list two-line v-if="team.players_list.length">
            <template v-for="user in team.players_list">
              <v-list-group :key="user.name" :value="false">
                <template v-slot:activator>
                  <v-list-item>
                    <v-list-item-avatar>
                      <avatar :src="user.avatar" :alt="user.name" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-html="user.name"></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="user.dob"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div
                        class="d-flex align-items-center justify-content-between mx-5"
                      >
                        <v-btn
                          @click="removePlayer(user)"
                          text
                          icon
                          color="red lighten-2"
                        >
                          <v-icon>mdi-thumb-down</v-icon>
                        </v-btn>

                        <v-btn
                          @click="viewPlayer(user)"
                          text
                          icon
                          color="success lighten-2"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>
                No Request Available at the moment
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="isLeader">
        <v-card>
          <v-card-title class="pb-0">Request List</v-card-title>
          <v-list two-line v-if="team.request_list.length">
            <template v-for="user in team.request_list">
              <v-list-group :key="user.name" :value="false">
                <template v-slot:activator>
                  <v-list-item>
                    <v-list-item-avatar>
                      <avatar :src="user.avatar" :alt="user.name" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-html="user.name"></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="user.dob"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div
                        class="d-flex align-items-center justify-content-between mx-5"
                      >
                        <v-btn
                          @click="acceptPlayer(user)"
                          text
                          icon
                          color="blue lighten-2"
                        >
                          <v-icon>mdi-thumb-up</v-icon>
                        </v-btn>

                        <v-btn
                          @click="rejectPlayer(user)"
                          text
                          icon
                          color="red lighten-2"
                        >
                          <v-icon>mdi-thumb-down</v-icon>
                        </v-btn>

                        <v-btn
                          @click="viewPlayer(user)"
                          text
                          icon
                          color="success lighten-2"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>
                No Request Available at the moment
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="my-5" v-if="isLeader">
      <v-card-title>Team Rules</v-card-title>
      <v-card-text> hello </v-card-text>
    </v-card>
  </loader>
</template>

<script>
import imagesPlaceholder from '~/constants/imagesPlaceholder'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('team')
export default {
  name: 'team',
  computed: {
    ...mapState(['loading', 'team']),
    backgroundImage() {
      const { backgroundImage } = this.team.images
      return backgroundImage
        ? backgroundImage
        : imagesPlaceholder.teamBackground
    },
    teamImage() {
      const { image } = this.team.images
      return image ? image : imagesPlaceholder.teamProfile
    },
    hasJoined() {
      const { players_list } = this.team
      const inTeam = players_list.find((req) => req._id === this.$auth.user._id)
      if (inTeam) return false
      return true
    },
    hasRequested() {
      const { request_list } = this.team
      const inReq = request_list.find(
        (user) => user._id === this.$auth.user._id
      )
      if (inReq) return true
      return false
    },
    isLeader() {
      return this.$auth.user._id === this.team.leader._id
    },
  },
  async asyncData({ params, store }) {
    return store.dispatch('team/FETCH_SINGLE_TEAM', params.id)
  },
  methods: {
    ...mapMutations(['SET_TEAM_LOADING', 'SET_TEAM']),
    async joinTeam() {
      try {
        this.SET_TEAM_LOADING(true)
        const resp = await this.$axios.post('team-request-to-join', {
          team_id: this.team._id,
        })
        const { team } = resp.data
        this.SET_TEAM(team)
        this.SET_TEAM_LOADING(false)
      } catch (err) {
        this.SET_TEAM_LOADING(false)
        console.log(err)
      }
    },
    async acceptPlayer(user) {
      try {
        this.SET_TEAM_LOADING(true)
        await this.$axios.post('team-accept-player', {
          team_id: this.team._id,
          user_id: user._id,
        })

        const team = { ...this.team }
        team.players_list = [...this.team.players_list, user]
        team.request_list = this.team.request_list.filter(
          (u) => u._id !== user._id
        )
        this.SET_TEAM(team)
        this.SET_TEAM_LOADING(false)
      } catch (err) {
        console.log(err)
        this.SET_TEAM_LOADING(false)
      }
    },
    async rejectPlayer({ _id }) {
      try {
        this.SET_TEAM_LOADING(true)
        const resp = await this.$axios.post('team-reject-player', {
          user_id: _id,
          team_id: this.team._id,
        })

        const { team } = resp.data
        this.SET_TEAM(team)
        this.SET_TEAM_LOADING(false)
      } catch (err) {
        console.log(err)
        this.SET_TEAM_LOADING(false)
      }
    },
    async removePlayer({ _id }) {
      try {
        this.SET_TEAM_LOADING(true)

        const resp = await this.$axios.post('team-remove-player', {
          user_id: _id,
          team_id: this.team._id,
        })

        const { team } = resp.data
        this.SET_TEAM(team)
        this.SET_TEAM_LOADING(false)
      } catch (err) {
        console.log(err)
        this.SET_TEAM_LOADING(false)
      }
    },
    viewPlayer(user) {
      console.log('view player', user)
    },
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

.team-description {
  margin-top: 5.5rem;
}

.detail {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
  &-item {
    text-align: center;
  }

  &-label {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #636363;
  }
  &-value {
    padding-top: 0.5rem;
  }
}
</style>
