<template>
  <div 
    class='clusters-container'> 
    <view-files 
      v-for='clusters in clusters'>
    </view-files>
  </div>
</template>

<script>
  import ViewFiles from './ViewFiles.vue'
  export default {
    name: "ClustersDisplay",
    props: {
    },
    data: () => {
      return {
        clusters: [],
      }
    },
    components: {
      'view-files': ViewFiles,
    },
    methods: {
    },
    mounted(){ 
    }
  }
</script>

<style scoped>
  .clusters-container {
    display: flex;
    flex-direction: column;
  }
</style>
