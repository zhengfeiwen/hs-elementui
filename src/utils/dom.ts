const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj: any) { return typeof obj } : function (obj: any) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } /* istanbul ignore next */

const _vue = require('vue')

const _vue2 = _interopRequireDefault(_vue)

function _interopRequireDefault (obj: any) { return obj && obj.__esModule ? obj : { default: obj } }

const isServer = _vue2.default.prototype.$isServer
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = isServer ? 0 : Number((document as any).documentMode)

const trim = function trim (string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

const camelCase = function camelCase (name: string) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
}())

export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element: any, event: any, handler: any) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
}())

export const once = function (el: any, event: any, fn: any, ...args: any[]) {
  const listener = function listener (this: any) {
    if (fn) {
      fn.apply(this, args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

export const hasClass = (el: any, cls: any) => {
  if (!el || !cls) return !1
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export const addClass = (el: any, cls: any) => {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export const removeClass = (el: any, cls: any) => {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export const getStyle = ieVersion < 9 ? function (element: any, styleName: any) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100
        } catch (e) {
          return 1.0
        }
      default:
        return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function (element: any, styleName: any) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = (document.defaultView as any).getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

export const setStyle = (element: any, styleName: any, value: any) => {
  if (!element || !styleName) return

  if ((typeof styleName === 'undefined' ? 'undefined' : _typeof(styleName)) === 'object') {
    for (const prop in styleName) {
      if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      element.style[styleName] = value
    }
  }
}

export const isScroll = function (el: any, vertical: any) {
  if (isServer) return
  const determinedDirection = vertical !== null || vertical !== undefined
  const overflow = determinedDirection ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow')
  return overflow.match(/(scroll|auto)/)
}

export const getScrollContainer = function (el: any, vertical: any) {
  if (isServer) return
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, vertical)) {
      return parent
    }
    parent = parent.parentNode
  }
  return parent
}

export const isInContainer = function (el: any, container: any) {
  if (isServer || !el || !container) return false
  const elRect = el.getBoundingClientRect()
  let containerRect: any
  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  } else {
    containerRect = container.getBoundingClientRect()
  }
  return elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right
}
