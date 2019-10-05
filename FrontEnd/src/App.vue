<template>
  <div id="app">
    <img src='./assets/logo.png'/>
    <cluster-display
      :clusters="clusters"
    ></cluster-display>
  </div>
</template>

<script>
import ClusterDisplay from './components/ClusterDisplay.vue'

export default {
  name: 'App',
  data: () => {
    return {
      clusters: [],
    }
  },
  components: {
    'cluster-display': ClusterDisplay,
  },
  mounted(){
    this.clusters = kMeans()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
