<template>
  <section class="view-files">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <div class="select-wrapper">
      <form>
        <select v-model="selected" @change="onClusterChange" class="select-menu">
          <!-- inline object literal -->
          <option>None selected</option>
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
      <p v-show="deleted" class="deleted hide">Removed From Current Set!</p>
      <div class="inner">
        <span class="image-wrapper" v-for="image in imageJson" :id="image['_id']">
          <button class="enlarge" @click="enlargeImage(image)" title="enlarge">+</button>
          <button class="close" @click="closeImage(image)" title="close">&times;</button>
          <img
            v-lazyload
            src
            :data-src="image.download_url"
            alt
            class="img"
            :class="image.selected? 'selected' : ''"
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
        "Here are the images you uploaded. Please select the ones you want to remove.",
      url: "Or upload from URL:",
      remove: "Remove",
      clusteredImages: [],
      currentCluster: null,
      clusterNum: 9,
      counter: 0,
      deleted: false,
      imageJson: [],
      clusters: [
        { text: "Cluster 0", value: 0 },
        { text: "Cluster 1", value: 1 },
        { text: "Cluster 2", value: 2 },
        { text: "Cluster 3", value: 3 },
        { text: "Cluster 4", value: 4 },
        { text: "Cluster 5", value: 5 },
        { text: "Cluster 6", value: 6 },
        { text: "Cluster 7", value: 7 },
        { text: "Cluster 8", value: 8 }
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
    deleteImages: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
      // var selected = document.querySelectorAll(".selected");
      // debugger
      // Array.prototype.forEach.call(selected, function(el, i) {
      //   el.parentNode.removeChild(el);
      // });

      let newImages = [];
      this.imageJson = this.imageJson.forEach(image => {
        if (image["selected"] === false) {
          newImages.push(image);
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
      window.location.href = "#" + image["_id"];
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
        if (typeof this.clusteredImages[elem.clusterId] === "undefined") {
          this.clusteredImages[elem.clusterId] = [];
        }
        this.clusteredImages[elem.clusterId].push(elem);
      });
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
    let url = "https://picsum.photos/v2/list?page=2&limit=100";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    const vueComp = this;
    xhr.onload = function() {
      let context = this.responseText;
      let json = JSON.parse(context);
      // note - created temp solution to simulate possible input
      let count = 0;
      json.forEach(image => {
        image["_id"] = "img" + count;
        count++;
        image["selected"] = false;
        image["deleted"] = false;
        image["clusterId"] = Math.floor(
          Math.random() * Math.floor(vueComp.clusterNum)
        );
      });

      vueComp.assignImageToCluster(json);
    };
    xhr.onerror = "error";
    xhr.send();
  }
};
</script>
