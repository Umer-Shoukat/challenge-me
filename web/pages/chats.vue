<template>
  <div class="chat-container" :class="{ 'is-empty': !channelList.length }">
    <template v-if="channelList.length">
      <v-card>
        <v-list>
          <v-list-item
            v-for="(channel, i) in channelList"
            :key="i"
            :to="`/chats/${channel.id}`"
            router
            exact
          >
            <v-list-item-avatar>
              <avatar :alt="channel.title" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="channel.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card>
        <v-card-text class="h-100 p-0">
          <nuxt-child />
        </v-card-text>
      </v-card>
    </template>

    <v-card class="h-100" v-else>
      <v-card-text class="center-center">
        <h1>You don't have any recent chats yet</h1>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'chat',
  data: () => ({
    channelList: [],
  }),
  computed: {},
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 30% 70%;
  height: calc(100vh - 130px);

  &.is-empty {
    grid-template-columns: 1fr;
  }
}
</style>
