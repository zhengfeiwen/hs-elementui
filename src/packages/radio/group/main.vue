<template>
  <component
    :is="_hsTag"
    class="hs-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue, Inject } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-radio-group',
  mixins: [Emitter]
})
export default class HsRadioGroup extends Vue {
  private keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  })

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  @Prop({ type: [Object, Number, String] })
  private value!: any

  @Prop({ type: String })
  private size!: string

  @Prop({ type: String })
  private fill!: string

  @Prop({ type: String })
  private textColor!: string

  @Prop({ type: Boolean })
  private disabled!: boolean

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get _hsTag () {
    return (this.$vnode.data || {}).tag || 'div'
  }

  get radioGroupSize () {
    return this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  private created () {
    this.$on('handleChange', (value: any) => {
      this.$emit('change', value)
    })
  }

  private mounted () {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航
    const radios = this.$el.querySelectorAll('[type=radio]')
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, radio => (radio as any).checked) && firstLabel) {
      (firstLabel as any).tabIndex = 0
    }
  }

  private handleKeydown (e: any) { // 左右上下按键 可以在radio组内切换不同选项
    const target = e.target
    const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
    const radios = this.$el.querySelectorAll(className)
    const length = radios.length
    const index = [].indexOf.call(radios, (target as never))
    const roleRadios = this.$el.querySelectorAll('[role=radio]')
    switch (e.keyCode) {
      case this.keyCode.LEFT:
      case this.keyCode.UP:
        e.stopPropagation()
        e.preventDefault()
        if (index === 0) {
          (roleRadios[length - 1] as any).click();
          (roleRadios[length - 1] as any).focus()
        } else {
          (roleRadios[index - 1] as any).click();
          (roleRadios[index - 1] as any).focus()
        }
        break
      case this.keyCode.RIGHT:
      case this.keyCode.DOWN:
        if (index === (length - 1)) {
          e.stopPropagation()
          e.preventDefault();
          (roleRadios[0] as any).click();
          (roleRadios[0] as any).focus()
        } else {
          (roleRadios[index + 1] as any).click();
          (roleRadios[index + 1] as any).focus()
        }
        break
      default:
        break
    }
  }

  @Watch('value')
  private valueChange (value: any) {
    (this as any).dispatch('hs-form-item', 'hs.form.change', [this.value])
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss"
</style>
