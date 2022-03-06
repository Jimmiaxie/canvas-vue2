<template>
  <div id="app">
    <MyHome />
  </div>
</template>

<script>
import MyHome from "./views/Home"

export default {
  name: "App",
  components: {
    MyHome
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
