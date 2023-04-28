import { DomEditor, IDomEditor } from "@wangeditor/editor";
import { VNode , h} from "snabbdom";

const BIND_TYPE = "bind";
export type TBindElement = {
  type: typeof BIND_TYPE;
  uuid: string;
  name:string;
}


export function widthBindElement<T extends IDomEditor>(editor: T){
  const {isInline, isVoid, insertData} = editor;

  const newEditor = editor;
  newEditor.isInline = elem=>{
    const type = DomEditor.getNodeType(elem);
    if(type === BIND_TYPE) return true;

    return isInline(elem)
  }

  newEditor.isVoid = elem=>{
    const type = DomEditor.getNodeType(elem);
    if(type === BIND_TYPE) return true;

    return isVoid(elem)
  }

  newEditor.insertData = data=>{
    return insertData(data)
  }

  return newEditor;
}

export function renderBindElement(elem: TBindElement, children: VNode[] | null, editor: IDomEditor):VNode{
  const {name, uuid} = elem;
  const elemVNode = h("span", {
    props:{ title:`${uuid}: ${name}`, id: uuid },
    style:{ background: "#fddea1", margin:"0 2px", cursor: "pointer" },
    on: {
      click(event){
        const editorEl = editor.getEditableContainer();
        if(editorEl){
          editorEl.querySelectorAll("span").forEach(i=> i.classList.remove("bind-active"));
        }
        (event.target as Element).classList.add("bind-active");
        console.error("clickEvent", elem);
      }
    }
  }, name);

  return elemVNode;
}


export function bindToHtml(elem: TBindElement):string {
  const {name, uuid} = elem;
  const html = `<span data-w-e-type="${BIND_TYPE}" data-w-e-is-void data-w-e-is-inline data-name="${name}" data-uuid="${uuid}">{{name}}</span>`;

  return html;
}

export const renderBindElementConfig = {
  type: BIND_TYPE,
  renderElem: renderBindElement,
  elemToHtml: bindToHtml
}

