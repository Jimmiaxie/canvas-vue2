<template>
  <div id="app">
    <MainVue />
  </div>
</template>

<script>
import MainVue from './views/main/Main.vue';

export default {
  name: "App",
  components: {
    MainVue
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
