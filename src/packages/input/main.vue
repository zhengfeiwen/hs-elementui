<template>
  <div :class="[
    type === 'textarea' ? 'hs-textarea' : 'hs-input',
    inputSize ? 'hs-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'hs-input-group': $slots.prepend || $slots.append,
      'hs-input-group--append': $slots.append,
      'hs-input-group--prepend': $slots.prepend,
      'hs-input--prefix': $slots.prefix || prefixIcon,
      'hs-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="hs-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="hs-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 前置内容 -->
      <span class="hs-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="hs-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="hs-input__suffix"
        v-if="getSuffixVisible()">
        <span class="hs-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="hs-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-if="showClear"
            class="hs-input__icon hs-icon-circle-close hs-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i v-if="showPwdVisible"
            class="hs-input__icon hs-icon-view hs-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="hs-input__count">
            <span class="hs-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i class="hs-input__icon"
          v-if="validateState"
          :class="['hs-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="hs-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="hs-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="hs-input__count">{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import emitter from '@/mixins/emitter'
import Migrating from '@/mixins/migrating'
import calcTextareaHeight from './calcTextareaHeight'
import { objectAssign } from '@/utils/merge'
import { isKorean } from '@/utils/commons'

@Component({
  name: 'hs-input',
  mixins: [emitter, Migrating]
})

export default class HsInput extends Vue {
  private inheritAttrs = !1

  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  private textareaCalcStyle: object = {}

  private hovering = !1

  private focused = !1

  private isComposing = !1

  private passwordVisible = !1

  @Prop({ type: [String, Number, Date] })
  private value!: string|number|any

  @Prop({ type: String })
  private size!: string

  @Prop({ type: String })
  private resize!: String

  @Prop({ type: String })
  private form!: String

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: Boolean })
  private readonly!: boolean

  @Prop({ type: String, default: 'text' })
  private type!: string

  @Prop({ type: [Boolean, Object], default: !1 })
  private autosize!: boolean|object

  @Prop({ type: String, default: 'off' })
  private autocomplete!: string

  @Prop({
    type: String,
    validator: (val) => {
      process.env.NODE_ENV !== 'production' &&
        console.warn('[Hs-Elementui Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.')
      return true
    }
  })
  private autoComplete!: string

  @Prop({ type: Boolean, default: !0 })
  private validateEvent!: boolean

  @Prop({ type: String })
  private suffixIcon!: string

  @Prop({ type: String })
  private prefixIcon!: string

  @Prop({ type: String })
  private label!: string

  @Prop({ type: Boolean, default: !1 })
  private clearable!: boolean

  @Prop({ type: Boolean, default: !1 })
  private showPassword!: boolean

  @Prop({ type: Boolean, default: !1 })
  private showWordLimit!: boolean

  @Prop({ type: String })
  private tabindex!: string

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get validateState () {
    return this.hsFormItem ? this.hsFormItem.validateState : ''
  }

  get needStatusIcon () {
    return this.hsForm ? this.hsForm.statusIcon : false
  }

  get validateIcon () {
    return ({
      validating: 'hs-icon-loading',
      success: 'hs-icon-circle-check',
      error: 'hs-icon-circle-close'
    } as any)[this.validateState]
  }

  get textareaStyle () {
    return objectAssign({}, this.textareaCalcStyle, { resize: this.resize })
  }

  get inputSize () {
    return this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  get inputDisabled () {
    return this.disabled || (this.hsForm || {}).disabled
  }

  get nativeInputValue () {
    return this.value === null || this.value === undefined ? '' : String(this.value)
  }

  get showClear () {
    return this.clearable &&
      !this.inputDisabled &&
      !this.readonly &&
      this.nativeInputValue &&
      (this.focused || this.hovering)
  }

  get showPwdVisible () {
    return this.showPassword &&
      !this.inputDisabled &&
      !this.readonly &&
      (!!this.nativeInputValue || this.focused)
  }

  get isWordLimitVisible () {
    return this.showWordLimit &&
      this.$attrs.maxlength &&
      (this.type === 'text' || this.type === 'textarea') &&
      !this.inputDisabled &&
      !this.readonly &&
      !this.showPassword
  }

  get upperLimit () {
    return this.$attrs.maxlength
  }

  get textLength () {
    if (typeof this.value === 'number') {
      return String(this.value).length
    }

    return (this.value || '').length
  }

  get inputExceed () {
    return this.isWordLimitVisible &&
      ((this as any).textLength > this.upperLimit)
  }

  @Watch('value')
  private valueChange (val: any) {
    this.$nextTick(this.resizeTextarea)
    if (this.validateEvent) {
      (this as any).dispatch('hs-form-item', 'hs.form.change', val)
    }
  }

  @Watch('nativeInputValue')
  private nativeInputValueChange () {
    this.setNativeInputValue()
  }

  @Watch('type')
  private typeChange () {
    this.$nextTick(() => {
      this.setNativeInputValue()
      this.resizeTextarea()
      this.updateIconOffset()
    })
  }

  private focus () {
    (this.getInput() as any).focus()
  }

  private blur () {
    (this.getInput() as any).blur()
  }

  private getMigratingConfig () {
    return {
      props: {
        icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
        'on-icon-click': 'on-icon-click is removed.'
      },
      events: {
        click: 'click is removed.'
      }
    }
  }

  private handleBlur (event: any) {
    this.focused = false
    this.$emit('blur', event)
    if (this.validateEvent) {
      (this as any).dispatch('hs-form-item', 'hs.form.blur', [this.value])
    }
  }

  private select () {
    (this.getInput() as any).select()
  }

  private resizeTextarea () {
    if (this.$isServer) return
    const { autosize, type } = this
    if (type !== 'textarea') return
    if (!autosize) {
      this.textareaCalcStyle = {
        minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
      }
      return
    }
    const minRows = (autosize as any).minRows
    const maxRows = (autosize as any).maxRows

    this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
  }

  private setNativeInputValue () {
    const input: any = this.getInput()
    if (!input) return
    if (input.value === this.nativeInputValue) return
    input.value = this.nativeInputValue
  }

  private handleFocus (event: any) {
    this.focused = true
    this.$emit('focus', event)
  }

  private handleCompositionStart () {
    this.isComposing = true
  }

  private handleCompositionUpdate (event: any) {
    const text = event.target.value
    const lastCharacter = text[text.length - 1] || ''
    this.isComposing = !isKorean(lastCharacter)
  }

  private handleCompositionEnd (event: any) {
    if (this.isComposing) {
      this.isComposing = false
      this.handleInput(event)
    }
  }

  private handleInput (event: any) {
    if (this.isComposing) return
    if (event.target.value === this.nativeInputValue) return
    this.$emit('input', event.target.value)
    this.$nextTick(this.setNativeInputValue)
  }

  private handleChange (event: any) {
    this.$emit('change', event.target.value)
  }

  private calcIconOffset (place: any) {
    const hsList: any = [].slice.call(this.$el.querySelectorAll(`.hs-input__${place}`) || [])
    if (!hsList.length) return
    let hs = null
    for (let i = 0; i < hsList.length; i++) {
      if (hsList[i].parentNode === this.$el) {
        hs = hsList[i]
        break
      }
    }
    if (!hs) return
    const pendantMap: any = {
      suffix: 'append',
      prefix: 'prepend'
    }

    const pendant = pendantMap[place]
    if (this.$slots[pendant]) {
      hs.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${(this.$el.querySelector(`.hs-input-group__${pendant}`) as any).offsetWidth}px)`
    } else {
      hs.removeAttribute('style')
    }
  }

  private updateIconOffset () {
    this.calcIconOffset('prefix')
    this.calcIconOffset('suffix')
  }

  private clear () {
    this.$emit('input', '')
    this.$emit('change', '')
    this.$emit('clear')
  }

  private handlePasswordVisible () {
    this.passwordVisible = !this.passwordVisible
    this.focus()
  }

  private getInput () {
    return this.$refs.input || this.$refs.textarea
  }

  private getSuffixVisible () {
    return this.$slots.suffix ||
      this.suffixIcon ||
      this.showClear ||
      this.showPassword ||
      this.isWordLimitVisible ||
      (this.validateState && this.needStatusIcon)
  }

  private created () {
    this.$on('inputSelect', this.select)
  }

  private mounted () {
    this.setNativeInputValue()
    this.resizeTextarea()
    this.updateIconOffset()
  }

  private updated () {
    this.$nextTick(this.updateIconOffset)
  }
}
</script>
<style lang="scss">
@import './main.scss';
</style>
