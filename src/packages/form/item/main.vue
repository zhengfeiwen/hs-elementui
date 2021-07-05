<template>
  <div class="hs-form-item" :class="[{
      'hs-form-item--feedback': hsForm && hsForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': hsForm && hsForm.hideRequiredAsterisk
    },
    sizeClass ? 'hs-form-item--' + sizeClass : ''
  ]">
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="hs-form-item__label" :style="labelStyle" v-if="label || $slots.label">
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <div class="hs-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="hs-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="hs-form-item__error"
            :class="{
              'hs-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (hsForm && hsForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Provide, Inject } from 'vue-property-decorator'
import AsyncValidator from 'async-validator'
import emitter from '@/mixins/emitter'
import { objectAssign } from '@/utils/merge'
import { noop, getPropByPath } from '@/utils/commons'
import LabelWrap from '../label/main.vue'

@Component({
  name: 'hs-form-item',
  mixins: [emitter],
  components: {
    'label-wrap': LabelWrap
  }
})

export default class HsFormItem extends Vue {
  @Provide('hsFormItem')
  hsFormItem = this

  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Prop({ type: String })
  private label!: string

  @Prop({ type: String })
  private labelWidth!: string

  @Prop({ type: String })
  private prop!: string

  @Prop({ type: Object, default: undefined })
  private required!: object

  @Prop({ type: [Object, Array] })
  private rules!: object|[]

  @Prop({ type: String })
  private error!: string

  @Prop({ type: String })
  private validateStatus!: string

  @Prop({ type: String })
  private for!: string

  @Prop({ type: [Object, Boolean], default: !1 })
  private inlineMessage!: object|boolean|any

  @Prop({ type: Boolean, default: !0 })
  private showMessage!: boolean

  @Prop({ type: String, default: '' })
  private size!: string

  @Watch('error', { immediate: !0 })
  private errorChange (value: any) {
    this.validateMessage = value
    this.validateState = value ? 'error' : ''
  }

  @Watch('validateStatus', { immediate: !0 })
  private validateStatusChange (value: any) {
    this.validateState = value
  }

  get labelFor () {
    return this.for || this.prop
  }

  get labelStyle () {
    const ret: any = {}
    const form: any = this.form
    if (form.labelPosition === 'top') return ret
    const labelWidth = this.labelWidth || form.labelWidth
    if (labelWidth) {
      ret.width = labelWidth
    }
    return ret
  }

  get contentStyle () {
    const ret: any = {}
    const label = this.label
    const form: any = this.form
    if (form.labelPosition === 'top' || form.inline) return ret
    if (!label && !this.labelWidth && this.isNested) return ret
    const labelWidth = this.labelWidth || form.labelWidth
    if (labelWidth === 'auto') {
      if (this.labelWidth === 'auto') {
        ret.marginLeft = this.computedLabelWidth
      } else if (form.labelWidth === 'auto') {
        ret.marginLeft = this.hsForm.autoLabelWidth
      }
    } else {
      ret.marginLeft = labelWidth
    }
    return ret
  }

  get form () {
    let parent = this.$parent
    let parentName = (parent.$options as any)._componentTag
    while (parentName !== 'hs-form') {
      if (parentName === 'hs-form-item') {
        this.isNested = true
      }
      parent = parent.$parent
      parentName = (parent.$options as any)._componentTag
    }
    return parent
  }

  get fieldValue () {
    const model = (this.form as any).model
    if (!model || !this.prop) { return }
    let path = this.prop
    if (path.indexOf(':') !== -1) {
      path = path.replace(/:/, '.')
    }
    return getPropByPath(model, path, true).v
  }

  get isRequired () {
    const rules = this.getRules()
    let isRequired = false
    if (rules && rules.length) {
      rules.every((rule: any) => {
        if (rule.required) {
          isRequired = true
          return false
        }
        return true
      })
    }
    return isRequired
  }

  get _formSize () {
    return this.hsForm.size
  }

  get hsFormItemSize () {
    return this.size || this._formSize
  }

  get sizeClass () {
    return this.hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  private validateState = ''
  private validateMessage = ''
  private validateDisabled = !1
  private validator:object = {}
  private isNested = !1
  private computedLabelWidth = ''

  private initialValue: any

  private validate (trigger: any, callback = noop) {
    this.validateDisabled = false
    const rules = this.getFilteredRule(trigger)
    if ((!rules || rules.length === 0) && this.required === undefined) {
      callback()
      return true
    }

    this.validateState = 'validating'

    const descriptor: any = {}
    if (rules && rules.length > 0) {
      rules.forEach(rule => {
        delete rule.trigger
      })
    }
    descriptor[this.prop] = rules

    const validator = new AsyncValidator(descriptor)
    const model: any = {}

    model[this.prop] = this.fieldValue

    validator.validate(model, { firstFields: true }, (errors: any, invalidFields: any) => {
      this.validateState = !errors ? 'success' : 'error'
      this.validateMessage = errors ? errors[0].message : ''

      callback(this.validateMessage, invalidFields)
      this.hsForm && this.hsForm.$emit('validate', this.prop, !errors, this.validateMessage || null)
    })
  }

  private clearValidate () {
    this.validateState = ''
    this.validateMessage = ''
    this.validateDisabled = false
  }

  private resetField () {
    this.validateState = ''
    this.validateMessage = ''
    const model = (this.form as any).model
    const value = this.fieldValue
    let path = this.prop
    if (path.indexOf(':') !== -1) {
      path = path.replace(/:/, '.')
    }
    const prop = getPropByPath(model, path, true)
    this.validateDisabled = true
    if (Array.isArray(value)) {
      prop.o[prop.k] = [].concat(this.initialValue)
    } else {
      prop.o[prop.k] = this.initialValue
    }
    (this as any).broadcast('HsTimeSelect', 'fieldReset', this.initialValue)
    this.$nextTick(() => {
      this.validateDisabled = !1
    })
  }

  private getRules () {
    let formRules: any = (this.form as any).rules
    const selfRules:any = this.rules
    const requiredRule: any = this.required !== undefined ? { required: !!this.required } : []
    const prop = getPropByPath(formRules, this.prop || '')
    formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : []
    return [].concat(selfRules || formRules || []).concat(requiredRule)
  }

  private getFilteredRule (trigger: any) {
    const rules = this.getRules()
    return rules.filter((rule: any) => {
      if (!rule.trigger || trigger === '') return true
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.indexOf(trigger) > -1
      } else {
        return rule.trigger === trigger
      }
    }).map(rule => objectAssign({}, rule))
  }

  private onFieldBlur () {
    this.validate('blur')
  }

  private onFieldChange () {
    if (this.validateDisabled) {
      this.validateDisabled = false
      return
    }
    this.validate('change')
  }

  updateComputedLabelWidth (width: any) {
    this.computedLabelWidth = width ? `${width}px` : ''
  }

  addValidateEvents () {
    const rules = this.getRules()
    if (rules.length || this.required !== undefined) {
      this.$on('hs.form.blur', this.onFieldBlur)
      this.$on('hs.form.change', this.onFieldChange)
    }
  }

  removeValidateEvents () {
    this.$off()
  }

  private mounted () {
    if (this.prop) {
      (this as any).dispatch('hs-form', 'hs.form.addField', [this])
      let initialValue: any = this.fieldValue
      if (Array.isArray(initialValue)) {
        initialValue = [initialValue]
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      })
      this.addValidateEvents()
    }
  }

  private beforeDestroy () {
    (this as any).dispatch('hs-form', 'hs.form.removeField', [this])
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
