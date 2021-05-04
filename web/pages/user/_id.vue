<template>
  <div>
    <v-card class="mb-5" :loading="loading">
      <v-card-title>User Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="6">
            <avatar
              :src="user.avatar"
              size="200"
              nameSize="4"
              :alt="user.name"
            />
          </v-col>

          <v-col md="6">
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-account </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> {{ user.name }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-mail </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> {{ user.email }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-alarm </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> {{ user.dob }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="goToChat">
                <v-list-item-icon>
                  <v-icon> mdi-chat </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> Chat with him </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card :loading="loading">
      <v-card-title>User Teams</v-card-title>
      <v-card-text>
        <v-row v-if="teams.length">
          <v-col
            v-for="team in teams"
            :key="team._id"
            lg="3"
            md="4"
            sm="6"
            cols="12"
          >
            <TeamCard :team="team" />
          </v-col>
        </v-row>

        <h1 v-else>User don't have any team</h1>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import TeamCard from '~/components/cards/team-card'
export default {
  name: 'user-details',
  components: {
    TeamCard,
  },
  data: () => ({
    loading: false,
  }),
  async asyncData({ params, $axios }) {
    try {
      const resp = await $axios.get(`user/${params.id}`)
      const { user, teams } = resp.data
      return {
        user,
        teams,
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async goToChat() {
      try {
        this.loading = true
        const user_id_1 = this.$auth.user._id
        const user_id_2 = this.user._id

        const resp = await this.$axios.post('chat-rooms/check-room', {
          user_id_1,
          user_id_2,
        })

        const { room_id } = resp.data.room

        this.$router.push(`/chats/${room_id}`)

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
