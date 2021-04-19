export default {
  state: () => ({
    loading: false,
    teams: [],
    pagination: {},
  }),
  getters: {},
  mutations: {
    SET_TEAM_LOADING(state, payload) {
      state.loading = payload
    },
    SET_TEAMS(state, payload) {
      state.teams = payload
    },
    SET_PAGINATION(state, payload) {
      state.pagination = {
        ...state.pagination,
        ...payload,
      }
    },
  },
  actions: {
    async FETCH_TEAMS({ commit }, payload) {
      try {
        commit('SET_TEAM_LOADING', true)
        const resp = await this.$axios.get('teams')
        const { teams } = resp.data
        commit('SET_TEAMS', teams)

        delete resp.data.teams
        commit('SET_PAGINATION', { ...resp.data })
        commit('SET_TEAM_LOADING', false)
        return true
      } catch (err) {
        commit('SET_TEAM_LOADING', false)
        console.log(err)
      }
    },
  },
}
