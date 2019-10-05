import App from './App.vue';
import Vue from 'vue';
import store from './components/store'

const app = new Vue({
  el: '#app',
  store,
  data: {
    currentRoute: window.location.pathname,
    clusters: [],
  },
  computed: {
  },
  components: {
  },
  render: h => h(App)

});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
