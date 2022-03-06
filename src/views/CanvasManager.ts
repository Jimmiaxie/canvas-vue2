import { SlateElement } from "@wangeditor/editor";

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

    this.canvas.classList.add("home-canvas");
    this.canvas.width = baseWidth * this.ratio;
    this.canvas.height = baseWidth * this.ratio;
    this.canvas.style.width = `${baseWidth}px`;
    this.canvas.style.height = `${baseWidth}px`;
    this.context.scale(this.ratio, this.ratio);
  }
  public update(children: SlateElement[]) {
    this.clearCanvas();
    // 每个item就是一行
    for (const item of children) {
      // this.context.textAlign = item.textAlign || "left";
      const itemChildren = item.children || [];
      let offLeft = 0,
        offTop = 0;
      // 每个i就是单独的设置
      itemChildren.forEach((i) => {
        const { left, top } = this.renderItem(i, offLeft, offTop);
        offLeft = left;
        offTop = top;
      });
    }
  }

  private renderItem(item: any, offLeft: number, offTop: number) {
    console.log(item);

    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    const {
      fontFamily,
      text,
      bgColor = "#ffffff",
      bold = false, // 加粗
      color = "#333",
      fontSize = "14px",
      italic = false, // 斜体
      underline = false // 下划线
    } = item;

    context.font = `${italic ? "italic" : "normal"} normal ${
      bold ? " bold" : "normal"
    }  ${fontSize}  ${fontFamily ? fontFamily : "serif"}`;
    // 获取文字测量对象
    const measureText = context.measureText(text);
    // 高度
    const fontSizeValue = +fontSize.slice(0, fontSize.lastIndexOf("px"));
    offTop += fontSizeValue;
    // 背景颜色
    context.fillStyle = bgColor;
    context.fillRect(
      offLeft,
      measureText.actualBoundingBoxAscent,
      measureText.width,
      measureText.actualBoundingBoxAscent * 2
    );
    // 文字
    context.fillStyle = color; // 文字颜色
    context.fillText(text, offLeft, offTop);

    // 画下划线
    if (underline) {
      const bottom = offTop + fontSizeValue;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(offLeft, bottom);
      context.lineTo(offLeft + measureText.width, bottom);
      context.stroke();
    }

    offLeft += measureText.width;

    return {
      left: offLeft,
      top: offTop
    };
  }
  private clearCanvas() {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }
}
