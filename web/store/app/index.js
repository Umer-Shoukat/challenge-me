export default {
  namespaced: true,
  state: () => ({
    drawer: false,
    miniVariant: false,
    clipped: false,
    // loading
    loading: false,
    windowWidth: null,
    windowHeight: null,
  }),
  getters: {},
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_GLOBAL_LOADING(state, payload) {
      state.loading = payload
    },
    SET_WINDOW_SIZE(state, { height, width }) {
      state.windowWidth = width
      state.windowHeight = height
    },
  },
  actions: {},
}
