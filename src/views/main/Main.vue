<template>
  <div id="app">
    <CopyVue />
  </div>
</template>

<script>
// import MyHome from "../home/Home.vue"
import CopyVue from "../copy/Copy.vue";
export default {
  name: "MainVue",
  components: {
    // MyHome,
    CopyVue,
  },
  data(){
    return {
    }
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>
