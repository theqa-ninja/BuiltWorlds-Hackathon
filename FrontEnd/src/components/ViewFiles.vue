<template>
  <section class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <div class="select-wrapper">
      <form>
        <select v-model="selected" @change="onClusterChange" class="select-menu">
          <!-- inline object literal -->
          <option>None selected</option>
          <option
            v-for="cluster in clusters"
            :value="cluster.cluster_id"
          >Cluster {{ cluster.cluster_id }}</option>
        </select>
      </form>
      <button class="button" @click="hideNotSelected">Toggle select</button>
    </div>
    <p>
      <span class="counter">{{ counter }} images selected</span>
    </p>
    <div id="gallery">
      <p>
        <button class="button delete" @click="saveImages">Keep images</button>
      </p>
      <p v-show="deleted" class="deleted hide">Removed from current set!</p>
      <div class="inner">
        <span
          class="image-wrapper"
          v-for="image in imageJson"
          :id="image.id"
          :class="image.selected? 'selected' : ''"
        >
          <button class="enlarge" @click="enlargeImage(image)" title="enlarge">+</button>
          <button class="close" @click="closeImage(image)" title="close">&times;</button>
          <img
            v-lazyload
            src
            data-src="/static/images/${image.filename}"
            alt
            class="img"
            @click="clickHandler(image)"
          />
        </span>
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
        'Here are the images you uploaded. Please select the ones you want to keep. You may view larger versions of each image by clicking on the "+" button.',
      url: "Or upload from URL:",
      remove: "Remove",
      clusteredImages: [],
      currentCluster: null,
      clusterNum: 9,
      counter: 0,
      deleted: false,
      imageJson: [],
      clusters: [
        { cluster_id: 1 },
        { cluster_id: 2 },
        { cluster_id: 3 },
        { cluster_id: 4 },
        { cluster_id: 6 },
        { cluster_id: 7 },
        { cluster_id: 8 },
        { cluster_id: 9 },
        { cluster_id: 10 },
        { cluster_id: 12 },
        { cluster_id: 14 },
        { cluster_id: 15 },
        { cluster_id: 16 },
        { cluster_id: 17 },
        { cluster_id: 18 },
        { cluster_id: 19 },
        { cluster_id: 20 },
        { cluster_id: 21 },
        { cluster_id: 22 },
        { cluster_id: 24 },
        { cluster_id: 26 },
        { cluster_id: 27 },
        { cluster_id: 29 },
        { cluster_id: 31 },
        { cluster_id: 32 },
        { cluster_id: 33 },
        { cluster_id: 36 },
        { cluster_id: 37 },
        { cluster_id: 38 }
      ],
      selected: null,
      timerId: null
    };
  },
  methods: {
    clickHandler(item) {
      item.selected = !item.selected;
      this.countSelectedItems();
    },
    hideNotSelected(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
    },
    saveImages: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
      let newImages = [];
      this.imageJson = this.imageJson.forEach(image => {
        if (image["selected"] === true) {
          newImages.push(image);
          image.selected = false;
        }
      });
      this.imageJson = newImages;
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
      }
      this.deleted = true;
      this.timerId = setTimeout(() => {
        this.deleted = false;
      }, 2000);
      this.countSelectedItems();
    },
    enlargeImage(image) {
      window.location.href = "#" + image["id"];
    },
    closeImage(image) {
      window.location.href = "#";
    },
    countSelectedItems() {
      let count = 0;
      this.imageJson.forEach(image => {
        count += image.selected;
      });
      this.counter = count;
    },
    assignImageToCluster(arr) {
      this.clusteredImages = Array(this.clusterNum);
      arr.forEach(elem => {
        if (typeof this.clusteredImages[elem.cluster_id] === "undefined") {
          this.clusteredImages[elem.cluster_id] = [];
        }
        this.clusteredImages[elem.cluster_id].push(elem);
      });
      console.log(this.clusteredImages);
    },
    onClusterChange() {
      if (event.target.value === "None selected") {
        return;
      }
      if (Number.isInteger(this.currentCluster)) {
        this.clusteredImages[this.currentCluster] = this.imageJson;
      }
      this.currentCluster = parseInt(event.target.value);
      this.imageJson = this.clusteredImages[this.currentCluster];
      this.counter = this.countSelectedItems();
    }
  },
  mounted() {
    let url = "https://builtworldhack-back.herokuapp.com/api/images/";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    const vueComp = this;
    xhr.onload = function() {
      let context = this.responseText;
      let json = JSON.parse(context);
      // note - created temp solution to simulate possible input
      json.forEach(image => {
        image["selected"] = false;
        image["deleted"] = false;
      });
      vueComp.assignImageToCluster(json);
    };
    xhr.onerror = "error";
    xhr.send();
  }
};
</script>
