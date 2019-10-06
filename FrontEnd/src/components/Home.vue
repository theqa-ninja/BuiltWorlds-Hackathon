<template>
  <section class="home">
    <h1>{{ heading }}</h1>
    <form action="/something" method="post" @submit="submitForm" novalidate="true" class="form">
      <label for="fileToUpload">{{ upload }}</label>
      <p>
        <input type="file" name="fileToUpload" id="fileToUpload" />
      </p>
      <hr />
      <label for="url">{{ url }}</label>
      <p>
        <input type="text" name="url" placeholder="https://" />
      </p>
      <p>
        <input type="submit" name="submit" value="Go!" class="button" />
      </p>
    </form>
  </section>
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
    submitForm() {
      event.preventDefault();
      console.log(this.$store);
      this.$store.commit("submitted", true);
    }
  },
  mounted() {}
};
</script>
