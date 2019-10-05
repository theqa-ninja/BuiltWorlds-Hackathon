<template>
  <div id="app">
    <img src="./assets/logo.svg" class="logo" />
    <Home
      v-if='!submitted'
    ></Home>
    <clusters
      v-if='submitted'
    >
    </clusters>
  </div>
</template>

<script>
import Home from "./components/Home";
import Clusters from './components/Clusters.vue';
export default {
  name: "App",
  components: {
    Home,
    'clusters' : Clusters, 
  },
  computed: {
    submitted(){
      return this.$store.getters.submitted;
    }
  },
};
</script>
