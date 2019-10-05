<template>
  <div class="home">
    <h1>{{ heading }}</h1>
    <form action="/something" @submit="submitForm" novalidate="true">
      <label for="fileToUpload">{{ upload }}</label>
      <p>
        <input type="file" name="fileToUpload" id="fileToUpload" />
      </p>
      <label for="url">{{ url }}</label>
      <p>
        <input type="text" name="url" />
      </p>
      <p>
        <input type="submit" name="submit" value="submit" />
      </p>
    </form>
  </div>
</template>

<script>
import store from "./store";
export default {
  name: "Home",
  data() {
    return {
      heading: "Let's get started",
      upload: "Upload images:",
      url: "Or upload from URL:"
    };
  },
  methods: {
    submitForm(){
      event.preventDefault();
      console.log(this.$store)
      this.$store.commit('submitted', true);
    },
  },
  mounted(){
  }
};
</script>
