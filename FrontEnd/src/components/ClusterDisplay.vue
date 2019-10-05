<template>
  <div 
    class='clusters-container'> 
    <cluster-content 
      v-for: cluster in clusters>
    </cluster-content>
  </div>
</template>

<script>

  export default {
    props: {
      clusters: Array,
    },
    data: () => {
      return {
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style scoped>
  .clusters-container {
    display: flex;
    flex-direction: column;
  }
</style>
