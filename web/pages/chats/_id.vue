<template>
  <div v-if="!$route.params.id" class="center-center">
    <h1>This is the empty state</h1>
  </div>
  <div v-else class="message-container">
    <header class="header">
      <avatar alt="PLaceholder" size="40" />
      <h1 class="ml-5">Channel Name</h1>
    </header>

    <client-only>
      <perfect-scrollbar class="message-logs" ref="chatLogPS">
        <ul class="messages" ref="chatLog" v-show="messages.length">
          <li
            class="message"
            :class="{ 'current-user': msg.from == $auth.user._id }"
            v-for="msg in messages"
            :key="msg._id"
          >
            <p class="message-content">
              {{ msg.message }}

              <span class="time">{{ $dayjs(msg.time).format('hh:mm a') }}</span>
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
          ></v-text-field>
        </v-col>
      </v-row>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'chat-container',
  data() {
    return {
      message: '',
      messages: [],
    }
  },
  methods: {
    sendMessage() {
      this.messages.push({
        _id: Date.now(),
        from: this.$auth.user._id,
        to: '12323',
        message: this.message,
        media: [],
        time: new Date(),
      })
      this.message = null
      this.scrollToBottom()
    },
    changeIcon() {
      console.log('emoji clicked')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight
      })
    },
  },
  mounted() {
    if (this.$route.params.id) this.scrollToBottom()
  },
  created() {},
}
</script>

<style lang="scss" scoped>
$header-height: 50px;
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
          padding: 10px 1rem 1.3rem 1rem;
          margin-bottom: 0.7rem;
          font-size: 1rem;
          display: inline-block;
          background-color: #333;
          border-radius: 20px;
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
          text-align: right;

          .message-content {
            background: #5d5d5d;
            border-radius: 20px;
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
