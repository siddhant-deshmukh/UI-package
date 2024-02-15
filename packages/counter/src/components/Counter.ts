import './counter.css'
import {
  h,
  init,
  VNode,
  toVNode,
  propsModule,
  classModule,
  attributesModule,
  eventListenersModule,
  styleModule,
} from "snabbdom";
import { templateBtn } from './Button';

const patch = init([
  classModule,
  propsModule,
  eventListenersModule,
  attributesModule,
  styleModule
])

// Reactivity - modify internal state and view
export function updateState(vnodeState: IVnodeState) {
  // replacing old vnode's view with new view
  const newNode = templateCounter(vnodeState)
  console.log("here in counter 1:", vnodeState.vnode, newNode)
  const vnode = patch(vnodeState.vnode, newNode)
  // return vnode
  const vnodeState2: IVnodeState = {
    ...vnodeState,
    vnode: vnode,
    oldvnode: vnodeState.vnode
  }
  const newNode2 = templateCounter(vnodeState2)
  console.log("here in counter 2:", vnodeState.vnode, newNode)

  // console.log("2 :", vnodeState2.vnode?.children[0]?.text, newNode2?.children[0]?.text)

  patch(vnode, newNode2)
}

export function templateCounter(vnodeState: IVnodeState) {
  const { id } = vnodeState
  const { currCount } = vnodeState.state
  // console.log(`div#${id}.counter`)
  return h(`div#${id}.counter`,
    {
      hook: {
        insert: (vnode) => {
          // console.log("Mounted counter", "having query selector :", id)
          if (vnodeState.props.onMount) vnodeState.props.onMount(vnode, vnodeState.props);
        },
        update: (vnode) => { if (vnodeState.props.onUpdate) vnodeState.props.onUpdate(vnode, vnodeState.props); },
        remove: (vnode) => { if (vnodeState.props.onRemove) vnodeState.props.onRemove(vnode, vnodeState.props); },
      }
    }, [
    h("h1", currCount.toString()),
    templateBtn({
      onClick: () => { DecrementCount(vnodeState) },
      text: "Sub",
      classNames: ["hover-blurr", "sub"],
    }),
    templateBtn({
      onClick: () => { IncrementCount(vnodeState) },
      classNames: ["hover-blurr", "add"],
      text: "Add",
      roundedBorder: {
        topRight: "10px",
        bottomRight: "10px"
      },
    }),
    // h(`button#${id}-btn-dec`, { on: { "click": () => { DecrementCount(vnodeState) } } }, "-"),
    // h(`button#${id}-btn-inc`, { on: { "click": () => { IncrementCount(vnodeState) } } }, "+"),
  ])
}

// convert a HTMLElement into VNode
// defaultValue  : take the number from which counter will start
// querySelector : query of the div or any other element which will be converted into vnode
export function insertCounterToElment(
  id: string,
  defaultValue: number,
  additionalProps?: any,
  onMount?: (vnode: VNode, props: any) => {},
  onUpdate?: (vnode: VNode, props: any) => {},
  onRemove?: (vnode: VNode, props: any) => {},
) {
  const container = document.getElementById(id)
  // console.log(container)
  if (container) {
    const cVnode = toVNode(container)
    const vnodeState: IVnodeState = {
      id,
      vnode: cVnode,
      oldvnode: null,
      state: {
        currCount: defaultValue
      },
      props: {
        additionalProps,
        onMount,
        onUpdate,
        onRemove
      }
    }

    const node1 = templateCounter(vnodeState)
    const node2 = patch(cVnode, node1)

    console.log(node1, node2)
    // insertButtonToElment(`${vnodeState.id}-btn-dec`, {
    //   onClick: () => { DecrementCount(vnodeState) },
    //   text: "Sub",
    //   classNames: ["hover-blurr", "sub"],
    //   backgroundColor: "red",
    //   bgHoverColor: "rgb(158, 0, 0)"
    // })
    // insertButtonToElment(`${vnodeState.id}-btn-inc`, {
    //   onClick: () => { IncrementCount(vnodeState) },
    //   classNames: ["hover-blurr", "add"],
    //   text: "Add",
    //   roundedBorder: {
    //     topRight: "10px",
    //     bottomRight: "10px"
    //   },
    //   bgHoverColor: "rgb(0, 0, 170)"
    // })
    console.log(node2)
    updateState({ ...vnodeState, oldvnode: node1, vnode: node2 })

  }
}

interface IVnodeState {
  id: string
  vnode: VNode
  oldvnode: VNode | null
  state: {
    currCount: number
  }
  props: {
    additionalProps?: any
    onCountChange?: (updatedCount: number, vnode: VNode, props: any) => {}
    onMount?: (vnode: VNode, props: any) => {}
    onUpdate?: (vnode: VNode, props: any) => {}
    onRemove?: (vnode: VNode, props: any) => {}
  }
}

function IncrementCount(vnodeState: IVnodeState) {
  // console.log("Here")
  vnodeState.state.currCount += 1
  updateState(vnodeState)
  if (vnodeState.props.onCountChange)
    vnodeState.props.onCountChange(vnodeState.state.currCount, vnodeState.vnode, vnodeState.props);
}
function DecrementCount(vnodeState: IVnodeState) {
  vnodeState.state.currCount -= 1
  updateState(vnodeState)
  if (vnodeState.props.onCountChange)
    vnodeState.props.onCountChange(vnodeState.state.currCount, vnodeState.vnode, vnodeState.props);
}


export default { insertCounterToElment, templateCounter, updateState }