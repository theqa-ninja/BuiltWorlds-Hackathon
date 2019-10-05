<template>
  <div id="app">
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
<style>
* {
  box-sizing: border-box;
}
.logo {
  max-width: 100px;
}

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#gallery .img {
  display: inline-block;
  width: 20%;
  max-width: 100%;
  vertical-align: top;
  padding: 0.5rem;
}
#gallery .selected {
  background: yellow;
}
input[type="text"] {
  width: 100%;
  max-width: 70%;
  padding: 0.5rem;
  border: 1px solid #ddd;
}
input[type="submit"] {
  padding: 0.5rem 1rem;
  background: #42b983;
  border-radius: 5px;
  border: 0;
  font-size: 1.2rem;
  color: #fff;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.hide {
  display: none;
}
</style>