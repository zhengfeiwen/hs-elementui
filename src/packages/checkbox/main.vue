<template>
  <label
    class="hs-checkbox"
    :class="[
      border && checkboxSize ? 'hs-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
  >
    <span class="hs-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="hs-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="hs-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <input
        v-else
        class="hs-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="hs-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-checkbox',
  mixins: [Emitter]
})
export default class HsCheckbox extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  private selfModel = !1

  private focus = !1

  private isLimitExceeded = !1

  private _checkboxGroup: any

  get model () {
    return this.isGroup ? this.store : this.value !== undefined ? this.value : this.selfModel
  }

  set model (val: any) {
    if (this.isGroup) {
      this.isLimitExceeded = !1
      if (this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min) {
        this.isLimitExceeded = !0
      }
      if (this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max) {
        this.isLimitExceeded = !0
      }
      this.isLimitExceeded === !1 && (this as any).dispatch('hs-checkbox-group', 'input', [val])
    } else {
      this.$emit('input', val)
      this.selfModel = val
    }
  }

  get isChecked () {
    if ({}.toString.call(this.model) === '[object Boolean]') {
      return this.model
    } else if (Array.isArray(this.model)) {
      return this.model.indexOf(this.label) > -1
    } else if (this.model !== null && this.model !== undefined) {
      return this.model === this.trueLabel
    }
  }

  get isGroup () {
    let parent = this.$parent
    while (parent) {
      if ((parent.$options as any)._componentTag !== 'hs-checkbox-group') {
        parent = parent.$parent
      } else {
        this._checkboxGroup = parent
        return !0
      }
    }
    return !1
  }

  get store () {
    return this._checkboxGroup ? this._checkboxGroup.value : this.value
  }

  get isLimitDisabled () {
    const { max, min } = this._checkboxGroup
    return (!!(max || min) && (this.model.length >= max && !this.isChecked)) ||
      (this.model.length <= min && this.isChecked)
  }

  get isDisabled () {
    return this.isGroup
      ? this._checkboxGroup.disabled || this.disabled || (this.hsForm || {}).disabled || this.isLimitDisabled
      : this.disabled || (this.hsForm || {}).disabled
  }

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get checkboxSize () {
    const temCheckboxSize = this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
    return this.isGroup
      ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
      : temCheckboxSize
  }

  @Prop({ type: [String, Number, Boolean] })
  private value!: string|number|boolean

  @Prop({ type: [String, Number, Boolean] })
  private label!: string|number|boolean

  @Prop({ type: Boolean })
  private indeterminate!: boolean

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: Boolean })
  private checked!: boolean

  @Prop({ type: String })
  private name!: string

  @Prop({ type: [String, Number] })
  private trueLabel!: string|number

  @Prop({ type: [String, Number] })
  private falseLabel!: string|number

  @Prop({ type: String })
  private id!: string

  @Prop({ type: String })
  private controls!: string

  @Prop({ type: Boolean })
  private border!: boolean

  @Prop({ type: String })
  private size!: string

  private addToStore () {
    if (
      Array.isArray(this.model) &&
      this.model.indexOf(this.label) === -1
    ) {
      this.model.push(this.label)
    } else {
      this.model = this.trueLabel || true
    }
  }

  private handleChange (ev: any) {
    if (this.isLimitExceeded) return
    let value
    if (ev.target.checked) {
      value = this.trueLabel === undefined ? true : this.trueLabel
    } else {
      value = this.falseLabel === undefined ? false : this.falseLabel
    }
    this.$emit('change', value, ev)
    this.$nextTick(() => {
      if (this.isGroup) {
        (this as any).dispatch('hs-checkbox-group', 'change', [this._checkboxGroup.value])
      }
    })
  }

  created () {
    this.checked && this.addToStore()
  }

  private mounted () {
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  }

  @Watch('value')
  private valueChange (value: object) {
    (this as any).dispatch('hs-form-item', 'hs.form.change', value)
  }
}
</script>

<style lang="scss">
@import "./main.scss"
</style>
