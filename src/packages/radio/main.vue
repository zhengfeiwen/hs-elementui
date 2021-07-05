<template>
  <label
    class="hs-radio"
    :class="[
      border && radioSize ? 'hs-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="hs-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model == label
      }"
    >
      <span class="hs-radio__inner"></span>
      <input
        ref="radio"
        class="hs-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="hs-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-radio',
  mixins: [Emitter]
})
export default class HsRadio extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  @Prop({ type: [Object, Number, String] })
  private value!: any

  @Prop({ type: [Object, Number, String] })
  private label!: any

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: String })
  private name!: string

  @Prop({ type: Boolean })
  private border!: boolean

  @Prop({ type: String })
  private size!: string

  private focus = !1

  private _radioGroup: any

  get isGroup () {
    let parent = this.$parent
    while (parent) {
      if ((parent.$options as any)._componentTag !== 'hs-radio-group') {
        parent = parent.$parent
      } else {
        this._radioGroup = parent
        return true
      }
    }
    return false
  }

  get model () {
    return this.isGroup ? this._radioGroup.value : this.value
  }

  set model (val: any) {
    if (this.isGroup) {
      (this as any).dispatch('hs-radio-group', 'input', val)
    } else {
      this.$emit('input', val)
    }
    this.$refs.radio && ((this.$refs.radio as any).checked = this.model === this.label)
  }

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get radioSize () {
    const temRadioSize = this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
    return this.isGroup
      ? this._radioGroup.radioGroupSize || temRadioSize
      : temRadioSize
  }

  get isDisabled () {
    return this.isGroup
      ? this._radioGroup.disabled || this.disabled || (this.hsForm || {}).disabled
      : this.disabled || (this.hsForm || {}).disabled
  }

  get tabIndex () {
    return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0
  }

  private handleChange () {
    this.$nextTick(() => {
      this.$emit('change', this.model)
      this.isGroup && (this as any).dispatch('hs-radio-group', 'handleChange', this.model)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss"
</style>
