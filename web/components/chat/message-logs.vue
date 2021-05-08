<template>
  <loader :loading="loading2" class="h-100">
    <div class="message-container" v-if="activeRoom">
      <header class="header">
        <div
          class="d-flex align-items-center cursor-pointer"
          @click="goToDetails"
        >
          <avatar
            :alt="activeRoom.title"
            size="40"
            :src="activeRoom.avatar"
            :active="activeRoom.active"
          />
          <div class="ml-5">
            <h1>{{ activeRoom.title }}</h1>
            <p
              class="subtitle sm mb-0"
              v-if="!activeRoom.active && activeRoom.lastActive"
            >
              Last active {{ $dayjs(activeRoom.lastActive).format('LT') }}
            </p>
          </div>
        </div>

        <v-spacer></v-spacer>
        <v-icon @click="showMembers">mdi-help</v-icon>
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
                :active="isOther(msg).active"
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

      <footer class="message-input relative">
        <div
          v-if="showEmojiContainer"
          @click="showEmojiContainer = false"
          class="overlay"
        ></div>
        <div class="emiji-picker" v-if="showEmojiContainer">
          <Picker
            :data="emojiIndex"
            set="twitter"
            @select="showEmoji"
            native
            :showPreview="false"
            ref="emoji-picker"
          />
        </div>

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
              hide-details
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

// emoji
import data from 'emoji-mart-vue-fast/data/all.json'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
let emojiIndex = new EmojiIndex(data)

import 'emoji-mart-vue-fast/css/emoji-mart.css'

// mixin
import appSetting from '~/mixins/app-setting'
export default {
  name: 'chat-container',
  mixins: [appSetting],
  components: {
    Picker,
  },
  data() {
    return {
      message: '',
      socket: '',
      emojiIndex: emojiIndex,
      showEmojiContainer: false,
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
      'READ_ALL_MESSAGES',
    ]),
    showEmoji(emoji) {
      if (!emoji.native) return
      this.message = this.message + emoji.native
    },
    changeIcon() {
      this.showEmojiContainer = true
    },
    sendMessage() {
      if (!this.message) return
      const msg = {
        _id: Date.now() + Math.random(),
        from: this.$auth.user._id,
        to: this.$route.params.id,
        room_id: this.$route.params.id,
        message: this.message,
        media: [],
        time: new Date(),
      }
      this.SEND_MESSAGE(msg)
      this.socket.emit('send-message', { msg })
      this.message = null
      this.showEmojiContainer = false
      this.scrollToBottom()
    },
    isOther({ from }) {
      if (from === this.$auth.user._id) return false

      const { members } = this.activeRoom
      const user = members.find((u) => u._id === from)

      if (!user)
        return {
          name: 'REMOVED',
          avatar: '',
          color: 'dark',
        }

      return {
        name: user.name,
        avatar: user.avatar,
        color: user.color,
        active: user.active,
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatLogPS && this.$refs.chatLog) {
          this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight
        }
      })
    },
    async getRoom() {
      this.RESET_STATE()
      this.CLEAR_MESSAGES()
      await this.GET_SINGLE_ROOM(this.$route.params.id)
      this.READ_ALL_MESSAGES(this.$route.params.id)
      // scroll to bottom
      this.scrollToBottom()
      // initializing socket
      this.socket = this.$nuxtSocket({})
      this.socket.emit('join-room', {
        room_id: this.$route.params.id,
        user: this.$auth.user,
      })

      this.socket.on('new-user-join', (user) => {
        this.ADD_NEW_MEMBER(user)
      })

      this.socket.on('new-message', (msg) => {
        this.ADD_NEW_MESSAGE(msg)
        this.scrollToBottom()
      })

      this.socket.on('error', (err) => {
        this.$notify({
          group: 'foo',
          title: 'Message not Send',
          text: err ? err : 'Somethign Went wrong',
          type: 'error',
        })
      })
    },
    showMembers() {
      this.$store.commit('globalModal/SET_ACTIVE_MODAL', {
        active: true,
        component: 'TeamMembers',
        props: {
          members: this.activeRoom.members,
        },
      })
    },
    goToDetails() {
      const { room_type, room_id, members } = this.activeRoom

      if (room_type === 'team_chat') {
        return this.$router.push(`/teams/${room_id}`)
      }

      if (room_type === 'chat') {
        const user = members.filter((u) => u._id !== this.$auth.user._id)
        return this.$router.push(`/user/${user[0]._id}`)
      }
    },
  },
  mounted() {
    this.getRoom()
  },
  watch: {
    '$route.params.id'(val, old) {
      if (val && val !== old) {
        if (old) {
          this.socket.emit('leave-room', old)
        }
        this.getRoom()
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
    min-height: $header-height;
    display: flex;
    align-items: center;
    padding: 0.6rem 1rem;
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
        align-items: baseline;

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

    &::v-deep .emiji-picker .emoji-mart-static {
      @media (max-width: 550px) {
        width: 95% !important;
      }
    }
  }
}

.emiji-picker {
  position: absolute;
  bottom: 4rem;
  z-index: 11;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
