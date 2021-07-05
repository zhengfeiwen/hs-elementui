'use strict'

const { on, once } = require('@/utils/dom')
export default {
  bind: function bind (el: any, binding: any, vnode: any) {
    let interval: any = null
    let startTime: any
    const handler = function handler () {
      return vnode.context[binding.expression].apply()
    }
    const clear = function clear () {
      if (Date.now() - startTime < 100) {
        handler()
      }
      clearInterval(interval)
      interval = null
    };
    (on)(el, 'mousedown', function (e: any) {
      if (e.button !== 0) return
      startTime = Date.now();
      (once)(document, 'mouseup', clear)
      clearInterval(interval)
      interval = setInterval(handler, 100)
    })
  }
}
