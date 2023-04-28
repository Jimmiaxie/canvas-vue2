<template>
  <div class="home-content">
    <p>
      <button @click="addNode()">添加节点</button>
    </p>
    <div class="home-box">
      <TextEditor  ref="textEditor"></TextEditor>
    </div>
  </div>
</template>

<script>
import TextEditor from "@/components/CopyEditor/index.vue";

export default {
  name: "CopyVue",
  components: {
    TextEditor,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    addNode(){
      this.$refs.textEditor.addCustomNode();
    },
  },
};
</script>

<style>
.home-content {
  width: 100%;
  height: 100%;
  border: 1px solid #cecece;
}
.home-canvas {
  border: 1px solid #cecece;
  margin: 15px;
}
</style>
