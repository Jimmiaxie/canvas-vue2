<template>
  <div class="home-box">
    <TextEditor @update="updateEditor"></TextEditor>
  </div>
</template>

<script>
import TextEditor from "@/components/Editor/index.vue";
import CanvasManager from "./CanvasManager";

export default {
  name: "MyHome",
  components: {
    TextEditor
  },
  data() {
    return {
      canvasManager: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.canvasManager = new CanvasManager(".home-box");
    })
    // const canvasManager = new CanvasManager(".home-box");
  },
  methods: {
    updateEditor(editorChildren) {
      this.canvasManager?.update(editorChildren);
    }
  }
}
</script>

<style>
.home-box {
  width: 100%;
  height: 100%;
  border: 1px solid #cecece;
}
.home-canvas {
  border: 1px solid #cecece;
  margin: 15px;
}
</style>
