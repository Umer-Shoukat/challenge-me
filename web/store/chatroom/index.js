import { getRandomColors } from '~/helpers'

function formatRoom(room) {
  const { team, room_type, members } = room
  let title
  let avatar

  if (members) {
    members.forEach((member, i) => {
      member.color = getRandomColors(members.length)[i]
    })
  }

  if (room_type === 'team_chat') {
    title = team.name
    avatar = team.image_url
  } else if (room_type === 'chat') {
    // TODO:: will format ir according to the user
  }
  return {
    title,
    avatar,
    ...room,
  }
}

const initialState = () => ({
  currentRoom: {},
  loading2: false,
  messages: [],
})

export default {
  namespaced: true,
  state: () => ({
    allRooms: [],
    loading: false,
    ...initialState(),
  }),
  getters: {
    rooms(state) {
      const rooms = state.allRooms
      return rooms.map((room) => formatRoom(room))
    },
    activeRoom(state) {
      if (state.currentRoom) {
        return formatRoom(state.currentRoom)
      }

      return false
    },
  },
  mutations: {
    SET_CHAT_ROOMS(state, payload) {
      state.allRooms = payload
    },

    SET_ACTIVE_ROOM(state, payload) {
      state.currentRoom = payload
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_LOADING2(state, loading) {
      state.loading2 = loading
    },
    ADD_NEW_MESSAGE(state, message) {
      state.messages.push(message)
    },
    ADD_NEW_MEMBER(state, member) {
      if (state.currentRoom.members) {
        state.currentRoom.members.push(member)
      }
    },
    CLEAR_MESSAGES(state) {
      state.messages = []
    },
    RESET_STATE(state) {
      state = {
        ...state,
        ...initialState(),
      }
    },
  },
  actions: {
    async GET_ALL_CHATROOM({ commit }) {
      try {
        commit('SET_LOADING', true)
        const resp = await this.$axios.get('chat-rooms')
        const rooms = resp.data.rooms
        commit('SET_CHAT_ROOMS', rooms)
        commit('SET_LOADING', false)
      } catch (error) {
        commit('SET_LOADING', false)
        console.log(error)
      }
    },
    async GET_SINGLE_ROOM({ commit }, id) {
      try {
        commit('SET_LOADING2', true)
        const resp = await this.$axios.get(`chat-room/${id}`)

        const room = resp.data.room
        commit('SET_ACTIVE_ROOM', room)
        commit('SET_LOADING2', false)
      } catch (error) {
        commit('SET_LOADING2', false)
        console.log(error)
      }
    },
    SEND_MESSAGE({ commit }, msg) {
      this.$socket.emit('send-message', { msg })
      commit('ADD_NEW_MESSAGE', msg)
    },
  },
}
