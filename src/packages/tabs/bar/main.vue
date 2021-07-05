<template>
  <div class="hs-tabs__active-bar" :class="`is-${ rootTabs.tabPosition }`" :style="barStyle"></div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue } from 'vue-property-decorator'
import { arrayFind } from '@/utils/util'

@Component({
  name: 'hs-tab-bar'
})
export default class HsTabBar extends Vue {
    @Prop({ type: Array })
    private tabs!: []

    @Inject({ from: 'rootTabs' })
    private rootTabs!: any

    get barStyle () {
      const style: any = {}
      let offset = 0
      let tabSize = 0
      const sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height'
      const sizeDir = sizeName === 'width' ? 'x' : 'y'
      const firstUpperCase = (str: any) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L: any) => L.toUpperCase())
      }
      this.tabs.every((tab: any) => {
        const $el = arrayFind(this.$parent.$refs.tabs || [], (t: any) => t.id.replace('tab-', '') === tab.paneName)
        if (!$el) { return false }

        if (!tab.active) {
          offset += $el[`client${firstUpperCase(sizeName)}`]
          return true
        } else {
          tabSize = $el[`client${firstUpperCase(sizeName)}`]
          const tabStyles = window.getComputedStyle($el)
          if (sizeName === 'width' && this.tabs.length > 1) {
            tabSize -= parseFloat(tabStyles.paddingLeft) + parseFloat(tabStyles.paddingRight)
          }
          if (sizeName === 'width') {
            offset += parseFloat(tabStyles.paddingLeft)
          }
          return false
        }
      })

      const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`
      style[sizeName] = tabSize + 'px'
      style.transform = transform
      style.msTransform = transform
      style.webkitTransform = transform

      return style
    }
}
</script>
