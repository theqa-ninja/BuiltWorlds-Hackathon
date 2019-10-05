import store from './components/store'
import Vue from 'vue'
import routes from './routes'
import App from './App.vue'
import VueTinyLazyloadImg from "vue-tiny-lazyload-img"

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
Vue.use(VueTinyLazyloadImg);

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
