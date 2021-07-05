<template>
  <label
    class="hs-checkbox-button"
      :class="[
        size ? 'hs-checkbox-button--' + size : '',
        { 'is-disabled': isDisabled },
        { 'is-checked': isChecked },
        { 'is-focus': focus },
      ]"
    role="checkbox"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    >
    <input
      v-if="trueLabel || falseLabel"
      class="hs-checkbox-button__original"
      type="checkbox"
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
      class="hs-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false">

    <span class="hs-checkbox-button__inner"
      v-if="$slots.default || label"
      :style="isChecked ? activeStyle : null">
      <slot>{{label}}</slot>
    </span>

  </label>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import Emitter from '@/mixins/emitter'
@Component({
  name: 'hs-checkbox-group',
  mixins: [Emitter]
})
export default class HsCheckboxGroup extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  private selfModel = !1

  private focus = !1

  private isLimitExceeded = !1

  @Prop({ type: [String, Number, Boolean, Object], default: () => ({}) })
  private value!: string|number|boolean|object

  @Prop({ type: [String, Number, Boolean] })
  private label!: string|number|boolean

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

  get model () {
    return this._checkboxGroup ? this.store : this.value !== undefined ? this.value : this.selfModel
  }

  set model (val) {
    const _checkboxGroup: any = this._checkboxGroup
    if (_checkboxGroup) {
      this.isLimitExceeded = !1
      if (_checkboxGroup.min !== undefined && val.length < _checkboxGroup.min) {
        this.isLimitExceeded = !0
      }
      if (_checkboxGroup.max !== undefined && val.length > _checkboxGroup.max) {
        this.isLimitExceeded = !0
      }
      if (this.isLimitExceeded === !1) {
        (this as any).dispatch('hs-checkbox-group', 'input', [val])
      }
    } else if (this.value !== undefined) {
      this.$emit('input', val)
    } else {
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

  get _checkboxGroup () {
    let parent = this.$parent
    while (parent) {
      if ((parent.$options as any)._componentTag !== 'hs-checkbox-group') {
        parent = parent.$parent
      } else {
        return parent
      }
    }
    return !1
  }

  get store () {
    const _checkboxGroup: any = this._checkboxGroup
    return _checkboxGroup ? _checkboxGroup.value : this.value
  }

  get activeStyle () {
    const _checkboxGroup: any = this._checkboxGroup
    return {
      backgroundColor: _checkboxGroup.fill || '',
      borderColor: _checkboxGroup.fill || '',
      color: _checkboxGroup.textColor || '',
      'box-shadow': '-1px 0 0 0 ' + _checkboxGroup.fill
    }
  }

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get size () {
    const _checkboxGroup: any = this._checkboxGroup
    return _checkboxGroup.checkboxGroupSize || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  get isLimitDisabled () {
    const _checkboxGroup: any = this._checkboxGroup
    const { max, min } = _checkboxGroup
    return (!!(max || min) && (this.model.length >= max && !this.isChecked)) || (this.model.length <= min && this.isChecked)
  }

  get isDisabled () {
    return this._checkboxGroup
      ? (this._checkboxGroup as any).disabled || this.disabled || (this.hsForm || {}).disabled || this.isLimitDisabled
      : this.disabled || (this.hsForm || {}).disabled
  }

  private addToStore () {
    if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
      this.model.push(this.label)
    } else {
      this.model = this.trueLabel || !0
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
      if (this._checkboxGroup) {
        (this as any).dispatch('hs-checkbox-group', 'change', [(this._checkboxGroup as any).value])
      }
    })
  }

  created () {
    this.checked && this.addToStore()
  }
}
</script>
