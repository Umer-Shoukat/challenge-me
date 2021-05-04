<template>
  <loader :loading="loading">
    <div class="chat-container" :class="{ 'is-empty': !rooms.length }">
      <template v-if="rooms.length">
        <v-card>
          <v-list>
            <v-list-item
              v-for="(channel, i) in rooms"
              :key="i"
              :to="`/chats/${channel.room_id}`"
              router
              exact
            >
              <v-list-item-avatar>
                <avatar :alt="channel.title" :src="channel.avatar" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="channel.title" />
                <v-list-item-subtitle v-text="channel.message" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card>
          <v-card-text class="h-100 p-0">
            <nuxt-child v-if="$route.params.id" />
            <div class="center-center" v-if="!$route.params.id">
              <h1>Totally empty</h1>
            </div>
          </v-card-text>
        </v-card>
      </template>

      <v-card class="h-100" v-else>
        <v-card-text class="center-center">
          <h1>You don't have any recent chats yet</h1>
        </v-card-text>
      </v-card>
    </div>
  </loader>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState } = createNamespacedHelpers('chatroom')
export default {
  name: 'chat',
  data: () => ({}),
  computed: {
    ...mapGetters(['rooms']),
    ...mapState(['loading']),
  },
  async asyncData({ store }) {
    await store.dispatch('chatroom/GET_ALL_CHATROOM')
    return true
  },
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: minmax(150px, 300px) 1fr;
  height: calc(100vh - 130px);

  &.is-empty {
    grid-template-columns: 1fr;
  }
}
</style>
