<template>
  <div style="border: 1px solid #ccc" >
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editorId="editorId"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      class="text-editor"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      @copy.native="handleCopy"
      @onChange="handleChange"
      @customPaste="handleCustomPaste"
      :mode="mode"
      :uuid="uuid"
    />
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
import { toolbarConfig, editorConfig, registerModule } from "./EditorConfig";

export default {
  name: "TextEditor",
  components: { Editor, Toolbar },
  data() {
    return {
      mode: Object.freeze("simple"),
      editorId: Object.freeze("textEditor1"),
      toolbarConfig,
      editorConfig,
      uuid: Date.now()
    };
  },
  beforeCreate() {
    registerModule();
  },
  methods: {
    handleCopy(event) {
      const editor = getEditor(this.editorId); // 获取 editor 实例（必须等它渲染完成）
      if (!editor) return;

      editor.copyBindElemFlag = event.target.classList.contains("bind-active");
    },
    handleChange(editor) {
      if (!editor) return;
      this.$emit("update", editor.children);
    },
    handleCustomPaste(editor, event, callback) {
      // 返回 false ，阻止默认粘贴行为
      // event.preventDefault();
      // callback(false); // 返回值（注意，vue 事件的返回值，不能用 return）
      // 返回 true ，继续默认的粘贴行为

      if (!event || !event.clipboardData) {
        if (editor.copyBindElemFlag) {
          this.copyBindElemEvent(event, callback);
        }
        return;
      }

      const text = event.clipboardData.getData("text");
      const fragment = event.clipboardData.getData(
        "application/x-slate-fragment"
      );

      if (text && !fragment) {
        editor.insertText(text);
        event.preventDefault();
        callback(false);
        return;
      }

      if (editor.copyBindElemFlag) {
        this.copyBindElemEvent(event, callback);
      }
    },
    copyBindElemEvent(event, callback) {
      this.addCustomNode();
      event.preventDefault();
      callback(false);
    },
    getJSONText() {
      const editor = getEditor(this.editorId); // 获取 editor 实例（必须等它渲染完成）
      if (editor == null) return "";
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
    },
    addCustomNode() {
      const editor = getEditor(this.editorId);
      if (!editor) return;

      const uuid = Date.now();
      const node = {
        type: "bind",
        uuid: uuid,
        name: `这是名字-${uuid}`,
        children: [{ text: "" }] // void 元素必须有一个 children ，其中只有一个空字符串
      };
      editor.insertNode(node);
    }
  },
  beforeDestroy() {
    const editor = getEditor(this.editorId);
    if (editor == null) return;

    // 【注意】组件销毁时，及时销毁编辑器
    editor.destroy();
    removeEditor(this.editorId);
  }
};
</script>

<style>
.editor-box {
  border: 1px solid #cecece;
}
.text-editor .w-e-text-container [data-slate-editor] p {
  margin: 0;
}

.text-editor .bind-active {
  background: #eb0808 !important;
  color: #ffffff;
}
</style>
