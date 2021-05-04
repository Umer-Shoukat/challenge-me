import { getRandomColors } from '~/helpers'

function formatRoom(room, { _id }) {
  const { team, room_type, members, last_msg } = room
  let title
  let avatar
  let lastActive
  let active = false
  const message = last_msg?.message

  if (members) {
    members.forEach((member, i) => {
      member.color = getRandomColors(members.length)[i]
    })
  }

  if (room_type === 'team_chat') {
    title = team.name
    avatar = team.image_url
  } else if (room_type === 'chat') {
    const users = members.filter((u) => u._id !== _id)
    title = users[0].name
    avatar = users[0].avatar
    active = users[0].active
    lastActive = users[0].last_active
  }
  return {
    title,
    avatar,
    message,
    lastActive,
    active,
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
    rooms(state, _, rootState) {
      const rooms = [...state.allRooms]

      return rooms
        .map((room) => formatRoom(room, rootState.auth.user))
        .sort((roomA, roomB) => {
          const time1 = roomA.last_msg?.time
          const time2 = roomB.last_msg?.time

          if (!time1 || !time2) return 0
          return new Date(time2) - new Date(time1)
        })
    },
    activeRoom(state, _, rootState) {
      if (state.currentRoom) {
        return formatRoom(state.currentRoom, rootState.auth.user)
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
      const room = state.allRooms.find((rm) => rm.room_id === message.room_id)
      room.last_msg = message
      state.messages.push(message)
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    ADD_NEW_MEMBER(state, member) {
      if (state.currentRoom.members) {
        const exist = state.currentRoom.members.find(
          (u) => u._id === member._id
        )
        if (!exist) {
          state.currentRoom.members.push(member)
        }
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

        const { room, messages } = resp.data

        commit('SET_ACTIVE_ROOM', room)
        commit('SET_MESSAGES', messages)
        commit('SET_LOADING2', false)
      } catch (error) {
        commit('SET_LOADING2', false)
        console.log(error)
      }
    },
    SEND_MESSAGE({ commit }, msg) {
      commit('ADD_NEW_MESSAGE', msg)
    },
  },
}
