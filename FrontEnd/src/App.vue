<template>
  <main id="app">
    <img src="./assets/logo.svg" class="logo" />
    <Home />
    <ViewFiles />
  </main>
</template>

<script>
import Home from "./components/Home";
import ViewFiles from "./components/ViewFiles";
export default {
  name: "App",
  components: {
    Home,
    ViewFiles
  }
};
</script>
