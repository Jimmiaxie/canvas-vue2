import { SlateElement, IrenderParam } from "./TextEditorInterface";

export default class CanvasManager {
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private context: any;
  private ratio: number = 1;
  constructor(selector: string) {
    const el = document.querySelector(selector);
    if (!el) {
      throw new Error("selector is not exist");
    }
    el.appendChild(this.canvas);

    this.context = this.canvas.getContext("2d");
    // 获取精度
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      this.context.webkitBackingStorePixelRatio ||
      this.context.mozBackingStorePixelRatio ||
      this.context.msBackingStorePixelRatio ||
      this.context.oBackingStorePixelRatio ||
      this.context.backingStorePixelRatio ||
      1;

    this.ratio = dpr / bsr;
    const baseWidth = 200;
    const baseHeight = baseWidth / 2;

    this.canvas.classList.add("home-canvas");
    this.canvas.width = baseWidth * this.ratio;
    this.canvas.height = baseHeight * this.ratio;
    this.canvas.style.width = `${baseWidth}px`;
    this.canvas.style.height = `${baseHeight}px`;
    this.context.scale(this.ratio, this.ratio);
  }
  public update(children: SlateElement[]) {
    this.clearCanvas();
    let offLeft = 0, // 富文本编辑器中p标签padding:15px;
      offTop = 0; // 富文本编辑器padding:10px;
    // 每个item就是一行
    for (const item of children) {
      const { lineHeight, textWidth } = this.getRowStyle(item);
      const textAlign: CanvasTextAlign = item?.textAlign || "left"; // 对齐方式
      const itemChildren = item.children || [];
      if (textAlign === "right") {
        offLeft = this.canvas.width - textWidth;
      } else if (textAlign === "center") {
        offLeft = (this.canvas.width - textWidth) / 2;
      } else {
        offLeft = 0;
      }
      // 每个i就是单独的设置
      itemChildren.forEach((descendant, index) => {
        const { left, top } = this.renderItem({
          descendant,
          offLeft,
          offTop,
          lineHeight,
          textAlign,
          rowTextWidth: textWidth,
        });
        offLeft = left;
        if (index === itemChildren.length - 1) {
          offTop = top;
        }
      });
    }
  }
  /**
   * 逐个渲染
   * @param param
   * @returns
   */
  private renderItem(param: IrenderParam) {
    const { descendant, offLeft, offTop, lineHeight, textAlign, rowTextWidth } =
      param;
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    const {
      fontFamily = "Microsoft YaHei",
      text,
      bgColor = "#ffffff",
      bold = false, // 加粗
      color = "#333",
      fontSize = "14px",
      italic = false, // 斜体
      underline = false, // 下划线
    } = descendant;

    context.font = `${italic ? "italic" : "normal"} normal ${
      bold ? " bold" : "normal"
    }  ${fontSize}  ${fontFamily}`;
    // 获取文字测量对象
    let fillText = text;

    // 测点处理
    const matchLength = /\{\{[0-9|_]+?\}\}/g.exec(text);
    if (matchLength && matchLength.length > 0) {
      // TODO: 获取实时值数据
      fillText = text.replace(/\{\{[0-9|_]+?\}\}/g, "666");
    }

    const measureTextWidth = context.measureText(fillText).width;
    context.textBaseline = "alphabetic";

    // 高度
    const fontSizeValue = +fontSize.slice(0, fontSize.lastIndexOf("px"));
    const selfHeight = fontSizeValue * 1.5;
    const newTop = offTop + lineHeight;

    // 背景颜色
    context.fillStyle = bgColor;
    context.fillRect(
      offLeft,
      offTop + (lineHeight - selfHeight) + selfHeight / 4,
      measureTextWidth,
      selfHeight
    );

    // 文字及颜色
    context.fillStyle = color;
    context.fillText(fillText, offLeft, newTop);

    const newLeft = offLeft + measureTextWidth;
    // 画下划线
    if (underline) {
      const bottom = newTop + 2;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(offLeft, bottom);
      context.lineTo(newLeft, bottom);
      context.stroke();
    }

    return {
      left: newLeft,
      top: newTop,
    };
  }
  /**
   * 获取一整行的数据 ，包括文字宽度，行高
   * @param row
   * @returns
   */
  private getRowStyle(row: SlateElement) {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    let maxFontSize = 0;
    let rowWidth = 0;
    row.children.forEach((item: any) => {
      const {
        fontFamily = "Microsoft YaHei",
        text,
        bold = false, // 加粗
        fontSize = "14px",
        italic = false, // 斜体
      } = item;
      maxFontSize = Math.max(
        maxFontSize,
        +fontSize.slice(0, fontSize.lastIndexOf("px"))
      );

      context.font = `${italic ? "italic" : "normal"} normal ${
        bold ? " bold" : "normal"
      }  ${fontSize}  ${fontFamily}`;

      rowWidth += context.measureText(text).width;
    });

    return {
      lineHeight: maxFontSize * 1.5,
      textWidth: rowWidth,
    };
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
