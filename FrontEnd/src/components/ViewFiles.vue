<template>
  <section class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <div class="select-wrapper">
      <form>
        <select v-model="selected" class="select-menu">
          <!-- inline object literal -->
          <option v-for="cluster in clusters" :value="cluster.value">{{ cluster.text }}</option>
        </select>
      </form>
      <button class="button" @click="hideNotSelected">Toggle select</button>
    </div>
    <p>
      <span class="counter">{{ counter }} images</span>
    </p>
    <div id="gallery">
      <p>
        <button class="button delete" @click="deleteImages">Delete</button>
      </p>
      <p v-show="deleted" class="deleted hide">Hidden!</p>
      <div class="inner">
        <img
          v-lazyload
          v-for="image in imageJson"
          src
          :data-src="image.download_url"
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
      imageJson: [],
      counter: 0,
      deleted: false,
      imageJson: [],
      clusters: [
        { text: "Cluster 1", value: "cluster-1" },
        { text: "Cluster 2", value: "cluster-2" },
        { text: "Cluster 3", value: "cluster-3" }
      ],
      selected: null,
      timerId: null
    };
  },
  methods: {
    clickHandler(item) {
      item.selected = !item.selected;
      event.target.classList.toggle("selected");
      this.countSelectedItems();
    },
    hideNotSelected(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
    },
    deleteImages: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
      var selected = document.querySelectorAll(".selected");
      Array.prototype.forEach.call(selected, function(el, i) {
        el.parentNode.removeChild(el);
      });
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
      }
      this.deleted = true;
      this.timerId = setTimeout(() => {
        this.deleted = false;
      }, 2000);
    },
    countSelectedItems() {
      let count = 0;
      this.imageJson.forEach(image => {
        count += image.selected;
      });
      this.counter = count;
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
