<template>
  <section class="home">
    <h1>{{ heading }}</h1>
    <form action="/something" method="post" @submit="submitForm" novalidate="true" class="form">
      <label for="fileToUpload">{{ upload }}</label>
      <p>
        <input type="file" name="fileToUpload" id="fileToUpload" />
      </p>
      <label for="url">{{ url }}</label>
      <p>
        <input type="text" name="url" />
      </p>
      <p>
        <input type="submit" name="submit" value="submit" class="button" />
      </p>
    </form>
  </section>
</template>

<script>
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
    submitForm: function(msg, e) {
      e.preventDefault();
      debugger;
      console.log(msg);
      document.querySelector("home").classList.add("hide");
      document.querySelector("view-files").classList.remove("hide");
      return false;
    }
  }
};
</script>
