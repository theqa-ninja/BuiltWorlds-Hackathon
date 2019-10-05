<template>
  <div 
    class='clusters-container'> 
    <view-files>
    </view-files>
  </div>
</template>

<script>
  import ViewFiles from './ViewFiles.vue'
  export default {
    name: "Clusters",
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
