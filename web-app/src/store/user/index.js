const state = { user: null };
const mutations = {
  SET_USER(state, payload) {
    state.user = payload;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
