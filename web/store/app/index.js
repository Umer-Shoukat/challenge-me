export default {
  namespaced: true,
  state: () => ({
    drawer: false,
    miniVariant: false,
    clipped: false,
    // loading
    loading: false,
  }),
  getters: {},
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_GLOBAL_LOADING(state, payload) {
      state.loading = payload
    },
  },
  actions: {},
}
