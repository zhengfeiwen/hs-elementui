<template>
  <div class="hs-collapse" role="tablist" aria-multiselectable="true">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator'

@Component({
  name: 'hs-collapse'
})
export default class HsCollapse extends Vue {
    @Provide('collapse')
    collapse = this

    @Prop({ type: Boolean })
    private accordion!: boolean

    @Prop({ type: [Array, String, Number], default: () => ([]) })
    private value!: []|string|number

    private activeNames = [].concat((this.value as any))

    @Watch('value')
    private valueChange (value: any) {
      this.activeNames = [].concat(value)
    }

    private setActiveNames (activeNames: any) {
      activeNames = [].concat(activeNames)
      const value = this.accordion ? activeNames[0] : activeNames
      this.activeNames = activeNames
      this.collapse.activeNames = activeNames
      this.$emit('input', value)
      this.$emit('change', value)
    }

    private handleItemClick (item: any) {
      if (this.accordion) {
        this.setActiveNames(
          (this.activeNames[0] || this.activeNames[0] === 0) &&
          this.activeNames[0] === item.name
            ? '' : item.name
        )
      } else {
        const activeNames = this.activeNames.slice(0)
        const index = activeNames.indexOf((item.name as never))

        if (index > -1) {
          activeNames.splice(index, 1)
        } else {
          activeNames.push((item.name as never))
        }
        this.setActiveNames(activeNames)
      }
    }

    private created () {
      this.$on('item-click', this.handleItemClick)
    }
}
</script>
<style lang="scss">
@import './main.scss';
</style>
