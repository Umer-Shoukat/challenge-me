import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('app')
export default {
  computed: {
    ...mapState(['windowWidth']),
  },

  methods: {
    checkForPage() {
      const width = this.windowWidth
      const {
        name,
        params: { id },
      } = this.$route
      if (width < 769 && name !== 'mob-chat-id') {
        this.$router.push(`/mob/chat/${id}`)
      }

      if (width > 769 && name !== 'chats-id') {
        this.$router.push(`/chats/${id}`)
      }
    },
  },
  watch: {
    windowWidth() {
      this.checkForPage()
    },
  },

  created() {
    this.checkForPage()
  },
}
