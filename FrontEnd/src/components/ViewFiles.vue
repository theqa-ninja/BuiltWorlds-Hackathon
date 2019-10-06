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
      <span class="counter">{{ counter }} images selected</span>
    </p>
    <div id="gallery">
      <p>
        <button class="button delete" @click="saveImages">Keep Images</button>
      </p>
      <p v-show="deleted" class="deleted hide">Removed From Current Set!</p>
      <div class="inner">
        <span
          class="image-wrapper"
          v-for="image in imageJson"
          :id="image['image_id']"
          :class="image.selected? 'selected' : ''"
        >
          <button class="enlarge" @click="enlargeImage(image)" title="enlarge">+</button>
          <button class="close" @click="closeImage(image)" title="close">&times;</button>
          <img
            v-lazyload
            src
            :data-src="image.download_url"
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
import axios from 'axios'
export default {
  name: "ViewFiles",
  data() {
    return {
      heading: "View files",
      msg:
        "Here are the images you uploaded. Please select the ones you want to view.",
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
    saveImages: function(item) {
      document.querySelector("#gallery").classList.toggle("hide-others");
      let newImages = [];
      this.imageJson = this.imageJson.forEach((image)=>{
        if (image['selected'] === true){
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
      window.location.href = "#" + image["image_id"];
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
  async mounted() {
    const sessionId = this.$store.getters.sessionId;
    let url = "/api/images/session/" + sessionId;
    debugger;
    const result = await axios.get(url);
    let clusterIds = [];
    result.forEach(image=>{
      if (clusterIds.includes(image['cluster_id']) && image['cluster_id']){
        clusterIds.push(image['cluster_id'])
      }
    })
    // sort clusterIds
    clusterIds.sort();
    clusterIds.reverse();

    let clusterIdToIndex = {};
    for (let i =0; i<clusterIds.length; i++){
      let clusterId = clusterIds[i];
      clusterIdToIndex[clusterId] = i+1;
    }

    let images = Array(clusterIds.length + 1);

    for (let i =0; i<clusterIds.length+1; i++){
      images[i] = [];
    }

    let count = 0;
    result.forEach(image => {
      image["image_id"] = "img" + count;
      count++;
      image["selected"] = false;
      image["deleted"] = false;

      if (!image['cluster_id']) {
        image["clusterId"] = 0;
      } else {
        image["clusterId"] = clusterIdToIndex[image['cluster_id']];
      }
    });

      this.assignImageToCluster(json);
  }
};
</script>
