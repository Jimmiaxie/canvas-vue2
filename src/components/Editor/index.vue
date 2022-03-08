<template>
  <div style="border: 1px solid #ccc"
       v-if="isEditorShow">
    <Toolbar style="border-bottom: 1px solid #ccc"
             :editorId="editorId"
             :defaultConfig="toolbarConfig"
             :mode="mode" />
    <Editor style="height: 300px; overflow-y: hidden"
            class="text-editor"
            :editorId="editorId"
            :defaultConfig="editorConfig"
            :defaultContent="getDefaultContent"
            @onChange="handleChange"
            @onBlur="handleChange"
            @customPaste="handleCustomPaste"
            @mouseup.native.stop="handleMouseUp"
            :mode="mode" />
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css";
import {
  Editor,
  Toolbar,
  getEditor,
  removeEditor,
} from "@wangeditor/editor-for-vue";
import cloneDeep from "lodash.clonedeep";
// import TextEditor from "./TextEditor";
import { toolbarConfig, editorConfig } from "./EditorConfig";

export default {
  name: "TextEditor",
  components: { Editor, Toolbar },
  data() {
    return {
      mode: Object.freeze("simple"),
      editorId: Object.freeze("textEditor"),
      toolbarConfig,
      editorConfig,
      defaultContent: [],
      isEditorShow: false,
    };
  },
  computed: {
    getDefaultContent() {
      return cloneDeep(this.defaultContent); //【注意】深度拷贝 defaultContent ，否则会报错
    },
  },
  mounted() {
    this.$nextTick(() => {
      const editor = getEditor(this.editorId);
      editor.on("bind-tree", (data) => {
        console.log(data);
      });
    });
    // const editor = getEditor(this.editorId)
    // this.editor = new TextEditor('#toolbar-container', '#text-container');
  },
  methods: {
    handleChange(editor) {
      console.log(editor.children);
      this.$emit("update", editor.children);
    },
    handleCustomPaste(editor, event, callback) {
      console.log("ClipboardEvent 粘贴事件对象", event);

      // 返回 false ，阻止默认粘贴行为
      event.preventDefault();
      callback(false); // 返回值（注意，vue 事件的返回值，不能用 return）
      // 返回 true ，继续默认的粘贴行为
      // callback(true)
    },
    handleMouseUp(e) {
      console.log(e);
    },
    getJSONText() {
      const editor = getEditor(this.editorId); // 获取 editor 实例（必须等它渲染完成）
      if (editor == null) return "";
      console.log(editor.getAllMenuKeys());
      const _json = JSON.stringify(editor.children);
      editor.clear();
      return _json;
    },
    setJSONText(content) {
      let jsonText = [];
      try {
        jsonText = JSON.parse(content);
      } catch {
        jsonText = [];
      }
      this.defaultContent = jsonText;
      this.isEditorShow = true;
    },
  },
  beforeDestroy() {
    const editor = getEditor(this.editorId);
    if (editor == null) return;

    // 【注意】组件销毁时，及时销毁编辑器
    editor.destroy();
    removeEditor(this.editorId);
  },
};
</script>

<style>
.editor-box {
  border: 1px solid #cecece;
}
</style>
