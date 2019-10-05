import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    submitted: false,    
  },
  getters: {
    submitted: (state)=>{
      return state.submitted;
    }
  }
});