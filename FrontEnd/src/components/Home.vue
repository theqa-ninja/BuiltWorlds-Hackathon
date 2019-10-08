<template>
  <section class="home">
    <h1>{{ heading }}</h1>
    <form action="/something" method="post" @submit="submitForm" novalidate="true" class="form">
      <label for="fileToUpload">Import from BIM360</label>
      <p>
        <a href="/api/autodesk/signin/">
          <input type="submit" name="submit" value="Redirect" class="button" />
        </a>
      </p>
      <hr />
      <label for="url">Enter Session ID</label>
      <p>
        <input type="text" name="url" placeholder />
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
      this.$store.commit("submitted", true);
    }
  },
  mounted() {}
};
</script>
