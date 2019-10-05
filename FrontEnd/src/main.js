/* eslint-disable */

import Vue from 'vue'
import routes from './routes'
import VLink from './components/VLink.vue'

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
  },
  template: 
    '<v-link :href=this.currentRoute></v-link>'

});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
