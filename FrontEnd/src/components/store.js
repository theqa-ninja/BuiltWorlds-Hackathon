import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    submitted: false,
    sessionId: null,
  },
  getters: {
    submitted: (state) => {
      return state.submitted;
    },
    sessionId: (state) => {
      return state.sessionId;
    },
  },
  mutations: {
    submitted(state, payload) {
      state.submitted += payload
    },
    sessionId(state, payload) {
      state.sessionId += payload
    },
  }
});