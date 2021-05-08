<template>
  <loader :loading="loading">
    <div class="chat-container" :class="{ 'is-empty': !rooms.length }">
      <template v-if="rooms.length">
        <v-card>
          <v-list>
            <v-list-item
              v-for="(channel, i) in rooms"
              :key="i"
              :to="`/${chatPrefix}/${channel.room_id}`"
              router
              exact
            >
              <avatar
                :alt="channel.title"
                :src="channel.avatar"
                :active="channel.active"
                size="40"
              />
              <v-list-item-content class="ml-3">
                <v-list-item-title v-text="channel.title" />
                <v-list-item-subtitle>
                  <p
                    class="mb-0 d-flex align-items-center justify-content-between"
                    style="max-width: 200px"
                  >
                    {{ channel.message }}

                    <span
                      class="badge primary"
                      v-if="channel.unread_msg_count"
                      >{{
                        channel.unread_msg_count > 9
                          ? '9+'
                          : channel.unread_msg_count
                      }}</span
                    >
                  </p>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card v-if="windowWidth > 769">
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
const appModule = createNamespacedHelpers('app')
// mixin
import appSetting from '~/mixins/app-setting'
export default {
  name: 'chat',
  mixins: [appSetting],
  data: () => ({
    chatPrefix: 'chats',
  }),
  computed: {
    ...mapGetters(['rooms']),
    ...mapState(['loading']),
    ...appModule.mapState(['windowWidth']),
  },
  async asyncData({ store }) {
    await store.dispatch('chatroom/GET_ALL_CHATROOM')
    return true
  },
  created() {
    if (this.windowWidth < 769) {
      this.chatPrefix = 'mob/chat'
    }
  },

  watch: {
    windowWidth(val, old) {
      if (val && val < 769) {
        this.chatPrefix = 'mob/chat'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: minmax(150px, 300px) 1fr;
  height: calc(100vh - 130px);

  @media (max-width: 769px) {
    grid-template-columns: 1fr;
  }

  &.is-empty {
    grid-template-columns: 1fr;
  }
}
.badge {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: grid;
  place-items: center;
  font-size: 10px;
  line-height: 1.5;
}
</style>
