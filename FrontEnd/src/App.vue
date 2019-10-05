<template>
  <main id="app">
    <img src="./assets/logo.svg" class="logo" />
    <Home
      v-if='!submitted'
    ></Home>
    <clusters-display
      v-if='submitted'
    >
    </clusters-display>
  </div>
</template>

<script>
import Home from "./components/Home";
import ClustersDisplay from './components/ClustersDisplay.vue';
export default {
  name: "App",
  components: {
    Home,
    'clusters-display' : ClustersDisplay, 
  },
  computed: {
    submitted(){
      return this.$store.getters.submitted;
    }
  },
};
</script>
