import { Vue, Component } from 'vue-property-decorator'
function broadcast (this: any, name: any, eventName: any, params: any) {
  this.$children.forEach((child: any) => {
    const _name = child.$options.name
    if (_name === name) {
      child.$emit(...[eventName].concat(params))
    } else {
      broadcast.apply(child, [name, eventName, params])
    }
  })
}

@Component
export default class extends Vue {
  private dispatch (name: any, eventName: any, params: any) {
    let parent = this.$parent || this.$root
    let _name = (parent.$options as any).name
    while (parent && (!_name || _name !== name)) {
      parent = parent.$parent
      if (parent) {
        _name = (parent.$options as any).name
      }
    }
    if (parent) {
      const args: any = [eventName].concat(params)
      parent.$emit.apply(parent, args)
    }
  }

  private broadcast (name: any, eventName: any, params: any) {
    broadcast.call(this, name, eventName, params)
  }
}
