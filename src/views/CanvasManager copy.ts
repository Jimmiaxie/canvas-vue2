import { SlateElement } from "@wangeditor/editor";

export default class CanvasManager {
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private context: any;
  private ratio: number = 1;
  private rotate : number = 0;
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
    // this.clearCanvas();
    // 每个item就是一行
    for (const item of children) {
      this.context.textAlign = item.textAlign || "left"; // 对齐方式
      const itemChildren = item.children || [];
      let offLeft = 0,
        offTop = 0;
      // 每个i就是单独的设置
      itemChildren.forEach((i, index) => {
        const { left, top } = this.renderItem(i, offLeft, offTop);
        offLeft = left;
        if (index === itemChildren.length - 1) {
          offTop = top;
        }
      });
    }
  }

  private renderItem(item: any, offLeft: number, offTop: number) {
    // console.log(item);

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
    } = item;

    // context.save();
    context.rotate((this.rotate * Math.PI) / 180);

    context.font = `${italic ? "italic" : "normal"} normal ${
      bold ? " bold" : "normal"
    }  ${fontSize}  ${fontFamily}`;
    // 获取文字测量对象
    const measureText = context.measureText(text);
    // 高度
    const fontSizeValue = +fontSize.slice(0, fontSize.lastIndexOf("px"));
    const newTop = offTop + fontSizeValue;

    // 背景颜色
   
    context.fillStyle = bgColor;
    context.fillRect(offLeft, offTop, measureText.width, fontSizeValue + 6);
    // context.restore();

    // 文字
    // context.save();
    context.rotate((this.rotate * Math.PI) / 180);
    context.fillStyle = color; // 文字颜色
    context.fillText(text, offLeft, newTop);
    // context.restore();

    // 画下划线
    if (underline) {
      const bottom = newTop + 2;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(offLeft, bottom);
      context.lineTo(offLeft + measureText.width, bottom);
      context.stroke();
    }

    // offLeft += measureText.width;

    return {
      left: offLeft + measureText.width,
      top: newTop,
    };
  }
  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public changeWay(rotate:number, children: SlateElement[]) {
   this.rotate = rotate;
   this.update(children);
    // context.save();
    // context.rotate(90 * Math.PI /180);
    // this.update(children);
    // context.restore();
    // this.clearCanvas();
    // const strWidth = context.measureText("中文1223ABCD").width;

    // context.save();
    // this.update(children);
    // // context.translate(100 + strWidth / 2, 100 - strWidth / 2);
    // context.rotate((90 * Math.PI) / 180);
    // context.fillStyle = "blue";
    // context.fillText("中文1223ABCD", 0, 0);
    // context.restore;
  }
  private setRotate(rotate = 90){
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    context.rotate((90 * Math.PI) / 180);
  }
}
