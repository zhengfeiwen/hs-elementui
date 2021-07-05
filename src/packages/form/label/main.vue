<template>
  <div class="hs-form-item__label-wrap" :style="getLabelWidth()"><slot></slot></div>
</template>
<script lang="tsx">
import { Prop, Vue, Inject, Watch } from 'vue-property-decorator'
export default class HsFormLabel extends Vue {
  @Prop({ type: Boolean })
  private isAutoWidth!: Boolean

  @Prop({ type: Boolean })
  private updateAll!: Boolean

  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  private style: any = ''

  private beforeMount () {
    // const slots = this.$slots.default
    // if (!slots) return null
    if (this.isAutoWidth) {
      const autoLabelWidth = this.hsForm.autoLabelWidth
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth
        if (marginLeft) {
          this.style.marginLeft = marginLeft + 'px'
        }
      }
      // return (<div class="hs-form-item__label-wrap" style={style}>{ slots }</div>)
    }
  }

  private wrapStyle () {
    if (this.isAutoWidth) {
      const autoLabelWidth = this.hsForm.autoLabelWidth
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth
        if (marginLeft) {
          this.style.marginLeft = marginLeft + 'px'
        }
      }
    }
    return this.style
  }

  private getLabelWidth () {
    if (this.$el && this.$el.firstElementChild) {
      const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width
      return Math.ceil(parseFloat(computedWidth))
    } else {
      return 0
    }
  }

  private updateLabelWidth (action = 'update') {
    if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
      if (action === 'update') {
        this.computedWidth = this.getLabelWidth()
      } else if (action === 'remove') {
        this.hsForm.deregisterLabelWidth(this.computedWidth)
      }
    }
  }

  @Watch('computedWidth')
  private computedWidthChange (val: any, oldVal: any) {
    if (this.updateAll) {
      this.hsForm.registerLabelWidth(val, oldVal)
      this.hsFormItem.updateComputedLabelWidth(val)
    }
  }

  private computedWidth = 0

  private mounted () {
    this.updateLabelWidth('update')
  }

  private updated () {
    this.updateLabelWidth('update')
  }

  private beforeDestroy () {
    this.updateLabelWidth('remove')
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
