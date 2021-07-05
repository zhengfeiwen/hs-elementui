export function isString (obj: any) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isObject (obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isHtmlElement (node: any) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

export const isFunction = (functionToCheck: any) => {
  const getType = {}
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

export const isUndefined = (val: any) => {
  return val === void 0
}

export const isDefined = (val: any) => {
  return val !== undefined && val !== null
}
