/* eslint-disable */

import Vue from 'vue'
import routes from './routes'
import VLink from './components/VLink.vue'
import { kMeans } from './utility/kMeans'

const app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent() {
      const matchingView = routes[this.currentRoute]
      return matchingView
        ? require('./pages/' + matchingView + '.vue')
        : require('./pages/404.vue')
    }
  },
  components: {
    'v-link': VLink,
  },
  mounted(){
    console.log(kMeans([[45,64], [56,98], [23,44], [1,2], [4,55]],3, 12));
  },
  template: 
    ''

});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
