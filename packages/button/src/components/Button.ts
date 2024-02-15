import { VNode, classModule, eventListenersModule, h, init, styleModule, toVNode } from "snabbdom"

const patch = init([
  styleModule,
  classModule,
  eventListenersModule
])

// Reactivity - modify internal state and view
export function updateState(vnodeState: IVnodeState) {
  // replacing old vnode's view with new view
  const newNode = templateButton(vnodeState)
  // console.log("1 :", vnodeState.vnode, newNode)

  const vnode = patch(vnodeState.vnode, newNode)
  // console.log("2 :", newNode, vnode)
  // return vnode
  const vnodeState2: IVnodeState = {
    ...vnodeState,
    vnode: vnode,
    oldvnode: vnodeState.vnode
  }
  const newNode2 = templateButton(vnodeState2)
  // console.log("3 :", newNode2, newNode)
  // console.log("2 :", vnodeState2.vnode?.children[0]?.text, newNode2?.children[0]?.text)
  return patch(vnode, newNode2)
}

export function templateButton(vnodeState: IVnodeState) {
  const { props } = vnodeState
  const sel = "button#" + vnodeState.id + ((props.classNames && props.classNames.length > 0) ? ("." + props.classNames?.join(".")) : "")
  // console.log("sel :", sel, (props.classNames && props.classNames.length > 0) ? "." + props.classNames?.join(".") : "")
  return h(sel,
    {
      on: {
        "click": (event) => { props.onClick(event) },
        "mouseleave": () => {
          // onMouseHover(vnodeState)
          updateState({ ...vnodeState, state: { bgColor: (props.backgroundColor) ? props.backgroundColor : "blue" } })
        },
        "mouseenter": () => {
          // onMouseLeave(vnodeState)
          updateState({ ...vnodeState, state: { bgColor: (props.bgHoverColor) ? props.bgHoverColor : "lightblue" } })
        }
      },
      style: {
        outline: "none",
        border: "none",
        padding: (props?.padding) ? props?.padding : "15px",

        fontSize: (props?.fontSize) ? props?.fontSize : "22px",
        fontWeight: (props?.fontWeight) ? props?.fontWeight : "900",

        color: (props.textColor) ? props.textColor : "white",
        backgroundColor: vnodeState.state.bgColor,

        borderTopLeftRadius: (props?.roundedBorder?.topLeft) ? props?.roundedBorder?.topLeft : "0px",
        borderTopRightRadius: (props?.roundedBorder?.topRight) ? props?.roundedBorder?.topRight : "0px",
        borderBottomLeftRadius: (props?.roundedBorder?.bottomLeft) ? props?.roundedBorder?.bottomLeft : "0px",
        borderBottomRightRadius: (props?.roundedBorder?.bottomRight) ? props?.roundedBorder?.bottomRight : "0px",
      }
    },
    props.text
  );
};
export function templateBtn(props: IProps) {
  const sel = "button" + ((props.classNames && props.classNames.length > 0) ? ("." + props.classNames?.join(".")) : "")

  return h(sel,
    {
      on: {
        "click": (event) => { props.onClick(event) },
      },
      style: {
        outline: "none",
        border: "none",
        padding: (props?.padding) ? props?.padding : "15px",

        fontSize: (props?.fontSize) ? props?.fontSize : "22px",
        fontWeight: (props?.fontWeight) ? props?.fontWeight : "900",

        color: (props.textColor) ? props.textColor : "white",

        borderTopLeftRadius: (props?.roundedBorder?.topLeft) ? props?.roundedBorder?.topLeft : "0px",
        borderTopRightRadius: (props?.roundedBorder?.topRight) ? props?.roundedBorder?.topRight : "0px",
        borderBottomLeftRadius: (props?.roundedBorder?.bottomLeft) ? props?.roundedBorder?.bottomLeft : "0px",
        borderBottomRightRadius: (props?.roundedBorder?.bottomRight) ? props?.roundedBorder?.bottomRight : "0px",
      }
    },
    props.text
  );
}
export function insertButtonToElment(id: string, props: IProps) {
  // const node1 = elm
  const button = document.getElementById(id)
  // console.log("button", button)
  if (button) {
    const cVnode = toVNode(button)
    const vnodeState: IVnodeState = {
      id,
      props,
      vnode: cVnode,
      oldvnode: null,
      state: {
        bgColor: (props.backgroundColor) ? props.backgroundColor : "blue"
      }
    }
    updateState(vnodeState)
  }


  // const node1 = templateButton(vnodeState)
  // const node2 = templateButton({ ...vnodeState, oldvnode: node1 })
  // const node3 = templateButton({ ...vnodeState, vnode: node2, oldvnode: node1 })
  // return node3
}


interface IVnodeState {
  id: string
  vnode: VNode
  oldvnode: VNode | null
  state: {
    bgColor: string
  }
  props: IProps
}
interface IProps {
  onClick: (event: MouseEvent) => void
  text: string

  id?: string
  classNames?: string[]

  bgHoverColor?: string
  backgroundColor?: string
  textColor?: string
  fontSize?: string,
  fontWeight?: string

  padding?: string,
  roundedBorder?: {
    topLeft?: string
    bottomLeft?: string
    bottomRight?: string
    topRight?: string
  },
}

export default { updateState, insertButtonToElment, templateBtn, templateButton }