const defaultPagination = () => ({
  limit: 10,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
})

export default {
  state: () => ({
    loading: false,
    teams: [],
    pagination: defaultPagination(),
    searchQuery: '',
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
    SET_SEARCH(state, payload) {
      state.searchQuery = payload
      state.pagination = defaultPagination()
    },
  },
  actions: {
    async FETCH_TEAMS({ commit, state }, page = 1) {
      try {
        commit('SET_TEAM_LOADING', true)
        const { searchQuery } = state
        const resp = await this.$axios.get(
          `teams?limit=3&page=${page}&query=${searchQuery ?? ''}`
        )
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
