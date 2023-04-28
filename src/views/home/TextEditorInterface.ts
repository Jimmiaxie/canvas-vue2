export interface SlateElement {
  type: string;
  children: IEdtorItem[];
  textAlign?: CanvasTextAlign;
}

export interface IEdtorItem {
  text: string;
  realText?: String;
  fontFamily?: string;
  bgColor?: string;
  bold?: boolean;
  color?: string;
  fontSize?: string;
  italic?: boolean; // 斜体
  underline?: boolean; // 下划线
  fontSizeValue?: number;
  font?: string;
  lineHeight?: number;
  ids?: string[];
}


export interface IrenderParam {
  descendant: IEdtorItem;
  startX: number;
  startY: number;
  lineHeight: number;
  textAlign: CanvasTextAlign;
  rowTextWidth: number;
}
