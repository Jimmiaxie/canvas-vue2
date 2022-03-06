import { IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

/**
 * 编辑器配置
 */
export const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    fontSize: {
      fontSizeList: ["12px", "14px", "16px", "24px", "40px"],
      default: "14px"
    },
    fontFamily: {
      fontFamilyList: [
        { name: "宋体", value: "SimSun" },
        { name: "黑体", value: "SimHein" },
        { name: "楷体", value: "KaiTi" },
        { name: "微软雅黑", value: "Microsoft YaHei" },
        { name: "仿宋", value: "仿宋" },
        "Arial",
        "Tahoma",
        "Verdana"
      ]
    }
  }
};

/**
 * 菜单配置
 */
export const toolbarConfig: Partial<IToolbarConfig> = {
  /* 工具栏配置 */
  toolbarKeys: [
    "fontFamily",
    "fontSize",
    "bold",
    "underline",
    "italic",
    "color",
    "bgColor",
    "justifyLeft",
    "justifyRight",
    "justifyCenter"
  ]
};
