<template>
  <section class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <p>
      <button class="button" @click="hideNotSelected">Toggle Select</button>
    </p>
    <p>
      <span class="counter">{{ counter }}</span>
    </p>
    <div id="gallery">
      <p>
        <button class="button delete" @click="deleteImages">Delete</button>
      </p>
      <p class="deleted hide">{{ deleted }}</p>
      <div class="inner">
        <img
          v-lazyload
          v-for="image in imageJson"
          src
          :data-src="image.download_url"
          v-show="!image.selected"
          alt
          class="img"
          @click="clickHandler(image)"
        />
      </div>
    </div>
  </section>
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
      imageJson: null,
      deleted: "Deleted!"
    };
  },
  methods: {
    clickHandler: function(item) {
      item.selected = !item.selected;
      event.target.classList.toggle("selected");
    },
    hideNotSelected: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
    },
    deleteImages: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
      var selected = document.querySelectorAll(".selected");
      console.log(selected);
      Array.prototype.forEach.call(selected, function(el, i) {
        el.parentNode.removeChild(el);
      });
      document.querySelector(".deleted").classList.remove("hide");
    }
  },
  computed: {
    counter: function() {
      var selected = document.querySelectorAll(".selected");
      return "(" + selected.length + " images selected)";
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
