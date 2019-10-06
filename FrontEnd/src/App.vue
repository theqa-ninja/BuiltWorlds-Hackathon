<template>
  <main id="app">
    <header>
      <img src="./assets/logo.svg" class="logo" />
      <h1>Cullinary</h1>
      <p class="tagline">Chopping down your image workload</p>
    </header>

    <Home v-if="!submitted"></Home>
    <clusters v-if="submitted"></clusters>
  </main>
</template>

<script>
import Home from "./components/Home";
import Clusters from "./components/Clusters.vue";
import ViewFiles from "./components/ViewFiles";

export default {
  name: "App",
  components: {
    Home,
    clusters: Clusters
  },
  computed: {
    submitted() {
      return this.$store.getters.submitted;
    }
  }
};
</script>
