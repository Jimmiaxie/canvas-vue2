import { SlateElement, IrenderParam, IEdtorItem } from "./TextEditorInterface";

export default class CanvasManager {
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private context: any;
  private ratio: number = 1;
  private ids: string[] = [];
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
    let startX = 0, // 富文本编辑器中p标签padding:15px;
      startY = 0; // 富文本编辑器padding:10px;
    // 每个item就是一行
    for (const item of children) {
      const itemChildren = (item.children || []).map((child) =>
        this.parseTextItem(child)
      );
      const { lineHeight, textWidth } = this.getRowStyle(itemChildren);
      const textAlign: CanvasTextAlign = item?.textAlign || "left"; // 对齐方式
      if (textAlign === "right") {
        startX = this.canvas.width - textWidth;
      } else if (textAlign === "center") {
        startX = (this.canvas.width - textWidth) / 2;
      } else {
        startX = 0;
      }

      // 每个i就是单独的设置
      itemChildren.forEach((descendant, index) => {
        const { left, top } = this.renderItem({
          descendant,
          startX,
          startY,
          lineHeight,
          textAlign,
          rowTextWidth: textWidth,
        });
        startX = left;
        if (index === itemChildren.length - 1) {
          startY = top;
        }
      });
    }
    console.log("匹配的数据是", this.ids);
  }
  /**
   * 逐个渲染
   * @param param
   * @returns
   */
  private renderItem(param: IrenderParam) {
    const { descendant, startX, startY, lineHeight } = param;
    const {
      font,
      realText,
      bgColor = "#ffffff",
      color = "#333",
      underline = false, // 下划线
      lineHeight: selfHeight = 21,
    } = descendant;

    this.context.font = font;
    // 获取文字测量对象
    const measureTextWidth = this.context.measureText(realText).width;
    this.context.textBaseline = "alphabetic";

    // 高度
    const newTop = startY + lineHeight;
    const newLeft = startX + measureTextWidth;

    // 背景颜色
    this.context.fillStyle = bgColor;
    this.context.fillRect(
      startX,
      startY + (lineHeight - selfHeight) + selfHeight / 4,
      measureTextWidth,
      selfHeight
    );

    // 文字及颜色
    this.context.fillStyle = color;
    this.context.fillText(realText, startX, newTop);

    // 画下划线
    if (underline) {
      const bottom = newTop + 2;
      this.context.strokeStyle = color;
      this.context.beginPath();
      this.context.moveTo(startX, bottom);
      this.context.lineTo(newLeft, bottom);
      this.context.stroke();
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
  private getRowStyle(children: IEdtorItem[]) {
    let maxFontSize = 0;
    let rowWidth = 0;
    children.forEach((item: IEdtorItem) => {
      const { realText, fontSize = "14px" } = item;
      maxFontSize = Math.max(maxFontSize, this.getFontSizeValue(fontSize));
      this.context.font = this.getFontStyle(item);
      rowWidth += this.context.measureText(realText).width;
    });

    return {
      lineHeight: maxFontSize * 1.5,
      textWidth: rowWidth,
    };
  }

  private getFontStyle(item: IEdtorItem): string {
    const {
      fontFamily = "Microsoft YaHei",
      bold = false, // 加粗
      fontSize = "14px",
      italic = false, // 斜体
    } = item;

    return `${italic ? "italic" : "normal"} normal ${
      bold ? " bold" : "normal"
    }  ${fontSize}  ${fontFamily}`;
  }

  private getFontSizeValue(fontSize: string): number {
    return parseFloat(fontSize);
  }

  private parseTextItem(item: IEdtorItem): IEdtorItem {
    const newItem: IEdtorItem = JSON.parse(JSON.stringify(item));
    const { fontSize = "14px", text } = newItem;
    newItem.font = this.getFontStyle(newItem);
    newItem.fontSizeValue = this.getFontSizeValue(fontSize);
    newItem.realText = this.parseText(text);
    newItem.lineHeight = newItem.fontSizeValue * 1.5;

    return newItem;
  }

  private parseText(text: string) {
    let fillText = text;
    const hasReg = /\{\{[0-9|_]+?\}\}/g;
    const replaceReg = /(?<={{)[0-9|_]+(?=}})/g;
    // 数据处理， 只支持数字和下划线
    const matchLength = hasReg.exec(text);
    if (matchLength && matchLength.length > 0) {
      const ids = text.match(replaceReg) || [];
      this.ids.push(...ids);
      fillText = fillText.replace(hasReg, "666");
    }
    return fillText;
  }

  private clearCanvas() {
    this.ids = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
