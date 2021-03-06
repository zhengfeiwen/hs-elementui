export const afterLeave = function (instance: any, callback: any, speed = 300, once = false) {
  if (!instance || !callback) throw new Error('instance & callback is required')
  let called = false
  const afterLeaveCallback = function () {
    if (called) return
    called = true
    if (callback) {
      callback.apply(null, arguments)
    }
  }
  if (once) {
    instance.$once('after-leave', afterLeaveCallback)
  } else {
    instance.$on('after-leave', afterLeaveCallback)
  }
  setTimeout(() => {
    afterLeaveCallback()
  }, speed + 100)
}
