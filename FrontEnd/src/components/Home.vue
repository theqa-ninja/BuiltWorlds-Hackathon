<template>
  <div class="home">
    <h1>{{ heading }}</h1>
    <form action method="post">
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
export default {
  name: "Home",
  data() {
    return {
      heading: "Let's get started",
      upload: "Upload images:",
      url: "Or upload from URL:"
    };
  }
};
</script>
