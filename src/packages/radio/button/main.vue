<template>
  <label
    class="hs-radio-button"
    :class="[
      size ? 'hs-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="hs-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span
      class="hs-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue, Inject } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-radio-button',
  mixins: [Emitter]
})
export default class HsRadioGroup extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  @Prop({ type: String })
  private name!: string

  @Prop({ type: [Object, Number, String] })
  private label!: any

  @Prop({ type: Boolean })
  private disabled!: boolean

  private focus = !1

  get value () {
    return (this._radioGroup as any).value
  }

  set value (value: any) {
    (this._radioGroup as any).$emit('input', value)
  }

  get _radioGroup () {
    let parent = this.$parent
    while (parent) {
      if ((parent.$options as any)._componentTag !== 'hs-radio-group') {
        parent = parent.$parent
      } else {
        return parent
      }
    }
    return false
  }

  get activeStyle () {
    const _radioGroup = (this._radioGroup as any)
    return {
      backgroundColor: _radioGroup.fill || '',
      borderColor: _radioGroup.fill || '',
      boxShadow: _radioGroup.fill ? `-1px 0 0 0 ${_radioGroup.fill}` : '',
      color: _radioGroup.textColor || ''
    }
  }

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get size () {
    return (this._radioGroup as any).radioGroupSize || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  get isDisabled () {
    return this.disabled || (this._radioGroup as any).disabled || (this.hsForm || {}).disabled
  }

  get tabIndex () {
    return (this.isDisabled || (this._radioGroup && this.value !== this.label)) ? -1 : 0
  }

  private handleChange () {
    this.$nextTick(() => {
      (this as any).dispatch('hs-radio-group', 'handleChange', this.value)
    })
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss"
</style>
