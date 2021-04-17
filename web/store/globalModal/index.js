const defaultOptions = () => ({
  modalOptions: {
    fullscreen: false,
    maxWidth: '800',
    persistent: true,
    scrollable: true,
    title: null,
  },
  props: {},
})

export default {
  namespaced: true,
  state: () => ({
    activeModal: false,
    component: null,
    ...defaultOptions(),
  }),
  getters: {},
  mutations: {
    SET_ACTIVE_MODAL(state, { active, options, component, props = {} }) {
      state.activeModal = active
      if (active) {
        state.component = component
        state.props = props
        state.modalOptions = {
          ...state.modalOptions,
          ...options,
        }
      } else {
        state.component = null
        state = { ...state, ...defaultOptions() }
      }
    },
    CLOSE_MODAL(state) {
      state.activeModal = false
      state.component = null
      state = { ...state, ...defaultOptions() }
    },
  },
  actions: {},
}
