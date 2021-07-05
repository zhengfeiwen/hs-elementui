<template>
  <form class="hs-form" :class="[
    labelPosition ? 'hs-form--label-' + labelPosition : '',
    { 'hs-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'vue-property-decorator'
import { objectAssign } from '@/utils/merge'
@Component({
  name: 'hs-form'
})

export default class HsForm extends Vue {
  @Provide('hsFrom')
  hsFrom = this

  @Prop({ type: Object })
  private model!: object

  @Prop({ type: Object })
  private rules!: object

  @Prop({ type: String, default: '' })
  private labelPosition!: string

  @Prop({ type: String })
  private labelWidth!: string

  @Prop({ type: String, default: '' })
  private labelSuffix!: string

  @Prop({ type: Boolean })
  private inline!: boolean

  @Prop({ type: Boolean })
  private inlineMessage!: boolean

  @Prop({ type: Boolean })
  private statusIcon!: boolean

  @Prop({
    type: Object,
    default: () => ({
      type: Boolean,
      default: !0
    })
  })
  private showMessage!: object

  @Prop({ type: String })
  private size!: string

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({
    type: Object,
    default: () => ({
      type: Boolean,
      default: !0
    })
  })
  private validateOnRuleChange!: object

  @Prop({
    type: Object,
    default: () => ({
      type: Boolean,
      default: !1
    })
  })
  private hideRequiredAsterisk!: object

  @Watch('rules')
  private rulesChange () {
    this.fields.forEach((field: any) => {
      field.removeValidateEvents()
      field.addValidateEvents()
    })
    if (this.validateOnRuleChange) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.validate(() => {})
    }
  }

  get autoLabelWidth () {
    if (!this.potentialLabelWidthArr.length) return 0
    const max = Math.max(...this.potentialLabelWidthArr)
    return max ? `${max}px` : ''
  }

  private fields:any[] = []

  private potentialLabelWidthArr:[] = []

  private created () {
    this.$on('hs.form.addField', (field: any) => {
      if (field) {
        this.fields.push(field)
      }
    })
    this.$on('hs.form.removeField', (field: { prop: any }) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  }

  private resetFields () {
    if (!this.model) {
      console.warn('[Hs-Elementui Warn][Form]model is required for resetFields to work.')
      return
    }
    this.fields.forEach(field => {
      field.resetField()
    })
  }

  private clearValidate (props = []) {
    const fields = props.length
      ? (typeof props === 'string'
        ? this.fields.filter(field => props === field.prop)
        : this.fields.filter(field => props.indexOf((field.prop as never)) > -1)
      ) : this.fields
    fields.forEach(field => {
      field.clearValidate()
    })
  }

  private validate (callback: Function) {
    if (!this.model) {
      console.warn('[Hs-Elementui Warn][Form]model is required for validate to work!')
      return
    }
    let promise
    if (typeof callback !== 'function' && window.Promise) {
      promise = new window.Promise((resolve, reject) => {
        callback = function (valid: unknown) {
          valid ? resolve(valid) : reject(valid)
        }
      })
    }

    let valid = true
    let count = 0
    // 如果需要验证的fields为空，调用验证时立刻返回callback
    if (this.fields.length === 0 && callback) {
      // eslint-disable-next-line standard/no-callback-literal
      callback(!0)
    }
    let invalidFields = {}
    this.fields.forEach(field => {
      field.validate('', (message: any, field: any) => {
        if (message) {
          valid = false
        }
        invalidFields = objectAssign({}, invalidFields, field)
        if (typeof callback === 'function' && ++count === this.fields.length) {
          callback(valid, invalidFields)
        }
      })
    })

    if (promise) {
      return promise
    }
  }

  private validateField (props: any, cb: Function) {
    props = [].concat(props)
    const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1)
    if (!fields.length) {
      console.warn('[Hs-Elementui Warn]please pass correct props!')
      return
    }

    fields.forEach(field => {
      field.validate('', cb)
    })
  }

  private getLabelWidthIndex (width: never) {
    const index = this.potentialLabelWidthArr.indexOf(width)
    // it's impossible
    if (index === -1) {
      throw new Error('[ElementForm]unpected width ')
    }
    return index
  }

  private registerLabelWidth (val: never, oldVal: never) {
    if (val && oldVal) {
      const index = this.getLabelWidthIndex(oldVal)
      this.potentialLabelWidthArr.splice(index, 1, val)
    } else if (val) {
      this.potentialLabelWidthArr.push(val)
    }
  }

  private deregisterLabelWidth (val: never) {
    const index = this.getLabelWidthIndex(val)
    this.potentialLabelWidthArr.splice(index, 1)
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
