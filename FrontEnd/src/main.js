import Vue from 'vue'
import routes from './routes'
import App from './App.vue'
import VueTinyLazyloadImg from "vue-tiny-lazyload-img"

const app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname,
    clusters: [],
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
  },
  render: h => h(App)

});
Vue.use(VueTinyLazyloadImg);

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
