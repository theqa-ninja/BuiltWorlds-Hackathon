<template>
  <div class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <p>
      <input type="submit" />
    </p>
    <div id="gallery">
      <img
        v-for="image in imageJson"
        :src="image.download_url"
        v-show="!image.selected"
        alt
        class="img"
        @click="clickHandler(image)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewFiles",
  data() {
    return {
      heading: "View files",
      msg:
        "Here are the images you uploaded. Please select the ones you want to remove.",
      url: "Or upload from URL:",
      remove: "Remove",
      imageJson: null
    };
  },
  methods: {
    clickHandler: function(item) {
      item.selected = !item.selected;
      event.target.classList.toggle("selected");
    }
  },
  mounted() {
    var url = "https://picsum.photos/v2/list?page=2&limit=100";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    const vueComp = this;
    xhr.onload = function() {
      var context = this.responseText;
      var json = JSON.parse(context);
      vueComp.imageJson = json;
      vueComp.imageJson.forEach(image => {
        image["selected"] = false;
      });
    };
    xhr.onerror = "error";
    xhr.send();
  }
};
</script>
