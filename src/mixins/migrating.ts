
import { Vue, Component } from 'vue-property-decorator'
import { kebabCase } from '@/utils/commons'

@Component
export default class extends Vue {
  private getMigratingConfig () {
    return {
      props: {},
      events: {}
    }
  }

  private mounted () {
    if (process.env.NODE_ENV === 'production') return
    if (!this.$vnode) return
    const props: any = {}; const events: any = {}
    const { data, componentOptions } = this.$vnode
    const definedProps = (data as any).attrs || {}
    const definedEvents = (componentOptions as any).listeners || {}

    for (let propName in definedProps) {
      propName = kebabCase(propName)
      if (props[propName]) {
        console.warn(`[Element Migrating][${this.$options.name}][Attribute]: ${props[propName]}`)
      }
    }

    for (let eventName in definedEvents) {
      eventName = kebabCase(eventName)
      if (events[eventName]) {
        console.warn(`[Element Migrating][${this.$options.name}][Event]: ${events[eventName]}`)
      }
    }
  }
}
