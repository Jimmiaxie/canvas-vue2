<template>
  <div class="home-content">
    <div class="home-box">
      <TextEditor @update="updateEditor" ref="textEditor"></TextEditor>
    </div>
    <!-- <button @click="save">保存数据</button>
    <button @click="restore">还原数据</button> -->
    <!-- <button @click="changeWay">切换展示效果</button> -->
    <button @click="copyTreeNode">模拟拖拽树节点</button>
    <button @click="createCanvas">生成canvas</button>
    <ol>
      <li>对单个文字进行样式设置</li>
      <li>对单行进行文字水平对齐设置</li>
      <li>拖拽绑定树节点</li>
      <li>手动修改绑定节点</li>
    </ol>
  </div>
</template>

<script>
import TextEditor from "@/components/Editor/index.vue";
import CanvasManager from "./CanvasManager";
import html2canvas from "html2canvas";

export default {
  name: "MyHome",
  components: {
    TextEditor,
  },
  data() {
    return {
      canvasManager: null,
      editorChildren: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.canvasManager = new CanvasManager(".home-box");
    });
    setTimeout(() => {
      this.restore();
    }, 1000);
  },
  methods: {
    updateEditor(editorChildren) {
      this.canvasManager?.update(editorChildren);
    },
    save() {
      this.editorChildren = this.$refs.textEditor.getJSONText();
    },
    restore() {
      const data =
        '[{"type":"paragraph","children":[{"text":"sdas","italic":true},{"italic":true,"text":"das","bold":true,"bgColor":"rgb(231, 95, 51)"}]}]';
      this.$refs.textEditor.setJSONText(data);
    },
    changeWay() {
      this.canvasManager.changeWay(90, this.editorChildren);
    },
    copyTreeNode() {
      const node = { resource_id: "0_101", name: "Th03温湿度" };
      window.node = node;
    },
    createCanvas() {
      const divEl = document.createElement("div");
      divEl.innerHTML = this.$refs.textEditor.getHtml()
      html2canvas(divEl).then(canvas=>{
        document.getElementsByClassName("home-content")[0].appendChild(canvas)
      })
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
