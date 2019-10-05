<template>
  <div 
    class='clusters-container'> 
    <cluster-content 
      v-for='cluster in clusters'>
    </cluster-content>
  </div>
</template>

<script>

  export default {
    props: {
    },
    data: () => {
      return {
        clusters: Array,
      }
    },
    computed: {
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
