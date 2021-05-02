<template>
  <loader :loading="loading2" class="h-100">
    <div class="message-container" v-if="activeRoom">
      <header class="header">
        <avatar :alt="activeRoom.title" size="40" :src="activeRoom.avatar" />
        <h1 class="ml-5">{{ activeRoom.title }}</h1>
      </header>

      <client-only>
        <perfect-scrollbar class="message-logs" ref="chatLogPS">
          <ul class="messages" ref="chatLog" v-show="messages.length">
            <li
              class="message d-flex"
              :class="{ 'current-user': msg.from == $auth.user._id }"
              v-for="msg in messages"
              :key="msg._id"
            >
              <avatar
                v-if="!!isOther(msg)"
                :src="isOther(msg).avatar"
                :alt="isOther(msg).name"
                :color="isOther(msg).color"
                class="avatar"
                style="margin-right: 0.8rem; position: relative; top: -7px"
              />
              <p class="message-content">
                <span
                  class="name d-block"
                  v-if="!!isOther(msg)"
                  :style="{ color: isOther(msg).color }"
                >
                  {{ isOther(msg).name }}
                </span>
                {{ msg.message }}

                <span class="time">{{
                  $dayjs(msg.time).format('hh:mm a')
                }}</span>
              </p>
            </li>
          </ul>
          <div v-if="!messages.length" class="center-center">
            <h1>STart the conversation</h1>
          </div>
        </perfect-scrollbar>
      </client-only>

      <footer class="message-input">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="message"
              append-outer-icon="mdi-send"
              prepend-icon="mdi-emoticon"
              filled
              label="Message"
              type="text"
              @click:append-outer="sendMessage"
              @click:prepend="changeIcon"
              @keydown.enter="sendMessage"
            ></v-text-field>
          </v-col>
        </v-row>
      </footer>
    </div>
  </loader>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations,
} = createNamespacedHelpers('chatroom')
export default {
  name: 'chat-container',
  data() {
    return {
      message: '',
    }
  },
  computed: {
    ...mapState(['loading2', 'messages']),
    ...mapGetters(['activeRoom']),
  },
  methods: {
    ...mapActions(['GET_SINGLE_ROOM', 'LEAVE_ROOM', 'SEND_MESSAGE']),
    ...mapMutations([
      'ADD_NEW_MESSAGE',
      'ADD_NEW_MEMBER',
      'CLEAR_MESSAGES',
      'RESET_STATE',
    ]),
    sendMessage() {
      this.SEND_MESSAGE({
        _id: Date.now() + Math.random(),
        from: this.$auth.user._id,
        to: this.$route.params.id,
        room_id: this.$route.params.id,
        message: this.message,
        media: [],
        time: new Date(),
      })
      this.message = null
      this.scrollToBottom()
    },
    isOther({ from }) {
      if (from === this.$auth.user._id) return false

      const { members } = this.activeRoom
      const user = members.find((u) => u._id === from)

      if (!user) return false

      return {
        name: user.name,
        avatar: user.avatar,
        color: user.color,
      }
    },
    changeIcon() {
      console.log('emoji clicked')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight
      })
    },
    async getRoom() {
      await this.GET_SINGLE_ROOM(this.$route.params.id)
      if (process.browser) {
        this.RESET_STATE()
        this.CLEAR_MESSAGES()
        this.$socket.emit('join-room', {
          room_id: this.$route.params.id,
          user: this.$auth.user,
        })

        // listeneing for new mssages
        this.$socket.on('new-message', (msg) => {
          console.log('A NEW MESSAGE...!!!')
          this.ADD_NEW_MESSAGE(msg)
          this.scrollToBottom()
        })

        this.$socket.on('new-user-join', (user) => {
          this.ADD_NEW_MEMBER(user)
        })
      }
    },
  },
  mounted() {
    this.scrollToBottom()
  },
  created() {
    this.getRoom()
  },
  watch: {
    '$route.params.id'(val, old) {
      if (val && val !== old) {
        this.$socket.emit('leave-room', old)

        this.$socket.disconnect()
        this.$socket.connect()
        this.getRoom(this.$route.params.id)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$header-height: 50px;
$border-radius: 10px;
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .header {
    min-height: header-height;
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #fefefe;
  }

  .message-logs {
    flex: 1;
    padding: 1rem;
    max-height: calc(100vh - 130px - 60px - 100px);
    overflow-y: auto;
    // messages
    .messages {
      list-style: none;
      padding: 0;
      margin: 0;

      .message {
        text-align: left;

        .message-content {
          position: relative;
          margin: 0;
          padding: 0.5rem 1rem 1.3rem 0.7rem;
          margin-bottom: 0.7rem;
          font-size: 1rem;
          display: inline-block;
          background-color: #333;
          border-radius: $border-radius;
          border-top-left-radius: 0;
          max-width: 70%;
          min-width: 70px;

          .time {
            position: absolute;
            bottom: 0;
            left: 1.2rem;
            font-size: 10px;
          }
        }

        &.current-user {
          justify-content: flex-end;
          text-align: right;

          .message-content {
            background: #5d5d5d;
            border-radius: $border-radius;
            border-top-right-radius: 0;

            .time {
              left: unset;
              right: 1.1rem;
            }
          }
        }
      }
    }
  }

  .message-input {
    padding: 1rem;
    border-top: 1px solid #fefefe;

    &::v-deep .v-text-field__details {
      display: none;
    }
  }
}
</style>
