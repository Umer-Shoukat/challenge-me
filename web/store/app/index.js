export default {
  namespaced: true,
  state: () => ({
    drawer: false,
    miniVariant: false,
    clipped: false,
  }),
  getters: {},
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
  },
  actions: {},
}
