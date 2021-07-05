import normalizeWheel from 'normalize-wheel'

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const mousewheel = function (this: any, element: any, callback: any) {
  if (element && element.addEventListener) {
    element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', (event: any) => {
      const normalized = normalizeWheel(event)
      callback && callback.apply(this, [event, normalized])
    })
  }
}

export default {
  bind (el: any, binding: any) {
    mousewheel(el, binding.value)
  }
}
