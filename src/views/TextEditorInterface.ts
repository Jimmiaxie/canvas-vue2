export interface SlateElement {
  type: string;
  children: IEdtorItem[];
  textAlign?: CanvasTextAlign;
}

export interface IEdtorItem {
  text: string;
  fontFamily?: string;
  bgColor?: string;
  bold?: boolean;
  color?: string;
  fontSize?: string;
  italic?: boolean; // 斜体
  underline?: boolean; // 下划线
}

export interface IrenderParam {
  descendant: IEdtorItem;
  offLeft: number;
  offTop: number;
  lineHeight: number;
  textAlign: CanvasTextAlign;
  rowTextWidth: number;
}
