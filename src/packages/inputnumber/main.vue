<template>
  <div
    @dragstart.prevent
    :class="[
      'hs-input-number',
      inputNumberSize ? 'hs-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <span
      class="hs-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{'is-disabled': minDisabled}"
      @keydown.enter="decrease">
      <i :class="`hs-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="hs-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{'is-disabled': maxDisabled}"
      @keydown.enter="increase">
      <i :class="`hs-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <hs-input
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange">
    </hs-input>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import HsInput from '@/packages/input/main.vue'
import Focus from '@/mixins/focus'
import RepeatClick from '@/directives/repeat-click'

@Component({
  name: 'hs-input-number',
  mixins: [Focus('input')],
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    'hs-input': HsInput
  }
})

export default class HsInputnumber extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Inject({ from: 'hsFormItem', default: '' })
  private hsFormItem!: any

  @Prop({ type: Number, default: 1 })
  private step!: number

  @Prop({ type: Number, default: 1 })
  private stepStrictly!: number

  @Prop({ type: Number, default: Infinity })
  private max!: number

  @Prop({ type: Number, default: -Infinity })
  private min!: number

  @Prop({ type: Number })
  private value!: number

  @Prop({ type: Boolean })
  private disabled!: boolean

  @Prop({ type: String })
  private size!: string

  @Prop({ type: Boolean, default: !0 })
  private controls!: boolean

  @Prop({ type: String, default: '' })
  private controlsPosition!: string

  @Prop({ type: String })
  private name!: string

  @Prop({ type: String })
  private label!: string

  @Prop({ type: String })
  private placeholder!: string

  @Prop({ type: Number, validator: (val) => { return val >= 0 && val === parseInt(val, 10) } })
  private precision!: number

  private currentValue = 0

  private userInput: any

  @Watch('value', { immediate: !0 })
  private valueChange (value: any) {
    let newVal = value === undefined ? value : Number(value)
    if (newVal !== undefined) {
      if (isNaN(newVal)) {
        return
      }
      if (this.stepStrictly) {
        const stepPrecision = this.getPrecision(this.step)
        const precisionFactor = Math.pow(10, stepPrecision)
        newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor
      }
      if (this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision)
      }
    }
    if (newVal >= this.max) newVal = this.max
    if (newVal <= this.min) newVal = this.min
    this.currentValue = newVal
    this.userInput = null
    this.$emit('input', newVal)
  }

  get minDisabled () {
    return this._decrease(this.value, this.step) < this.min
  }

  get maxDisabled () {
    return this._increase(this.value, this.step) > this.max
  }

  get numPrecision () {
    const { value, step, getPrecision, precision } = this
    const stepPrecision = getPrecision(step)
    if (precision !== undefined) {
      if (stepPrecision > precision) {
        console.warn('[Hs-Elementui Warn][InputNumber]precision should not be less than the decimal places of step')
      }
      return precision
    } else {
      return Math.max(getPrecision(value), stepPrecision)
    }
  }

  get controlsAtRight () {
    return this.controls && this.controlsPosition === 'right'
  }

  get _hsFormItemSize () {
    return (this.hsFormItem || {}).hsFormItemSize
  }

  get inputNumberSize () {
    return this.size || this._hsFormItemSize || ((this as any).$ELEMENT || {}).size
  }

  get inputNumberDisabled () {
    return this.disabled || !!(this.hsForm || {}).disabled
  }

  get displayValue () {
    if (this.userInput !== null) {
      return this.userInput
    }
    let currentValue: any = this.currentValue
    if (typeof currentValue === 'number') {
      if (this.stepStrictly) {
        const stepPrecision = this.getPrecision(this.step)
        const precisionFactor = Math.pow(10, stepPrecision)
        currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor
      }
      if (this.precision !== undefined) {
        currentValue = currentValue.toFixed(this.precision)
      }
    }
    return currentValue
  }

  private toPrecision (num: any, precision: any = undefined) {
    if (precision === undefined) precision = this.numPrecision
    return parseFloat((Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toString())
  }

  private getPrecision (value: any) {
    if (value === undefined) return 0
    const valueString = value.toString()
    const dotPosition = valueString.indexOf('.')
    let precision = 0
    if (dotPosition !== -1) {
      precision = valueString.length - dotPosition - 1
    }
    return precision
  }

  private _increase (val: any, step: any) {
    if (typeof val !== 'number' && val !== undefined) return this.currentValue
    const precisionFactor = Math.pow(10, this.numPrecision)
    return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor)
  }

  private _decrease (val: any, step: any) {
    if (typeof val !== 'number' && val !== undefined) return this.currentValue
    const precisionFactor = Math.pow(10, this.numPrecision)
    return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor)
  }

  private increase () {
    if (this.inputNumberDisabled || this.maxDisabled) return
    const value = this.value || 0
    const newVal = this._increase(value, this.step)
    this.setCurrentValue(newVal)
  }

  private decrease () {
    if (this.inputNumberDisabled || this.minDisabled) return
    const value = this.value || 0
    const newVal = this._decrease(value, this.step)
    this.setCurrentValue(newVal)
  }

  private handleBlur (event: any) {
    this.$emit('blur', event)
  }

  private handleFocus (event: any) {
    this.$emit('focus', event)
  }

  private setCurrentValue (newVal: any) {
    const oldVal = this.currentValue
    if (typeof newVal === 'number' && this.precision !== undefined) {
      newVal = this.toPrecision(newVal, this.precision)
    }
    if (newVal >= this.max) newVal = this.max
    if (newVal <= this.min) newVal = this.min
    if (oldVal === newVal) return
    this.userInput = null
    this.$emit('input', newVal)
    this.$emit('change', newVal, oldVal)
    this.currentValue = newVal
  }

  private handleInput (value: any) {
    this.userInput = value
  }

  private handleInputChange (value: any) {
    const newVal: any = value === '' ? undefined : Number(value)
    if (!isNaN(newVal) || value === '') {
      this.setCurrentValue(newVal)
    }
    this.userInput = null
  }

  private select () {
    (this.$refs.input as any).select()
  }

  private mounted () {
    const innerInput = (this.$refs.input as any).$refs.input
    innerInput.setAttribute('role', 'spinbutton')
    innerInput.setAttribute('aria-valuemax', this.max)
    innerInput.setAttribute('aria-valuemin', this.min)
    innerInput.setAttribute('aria-valuenow', this.currentValue)
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled)
  }

  private updated () {
    if (!this.$refs || !this.$refs.input) return
    const innerInput = (this.$refs.input as any).$refs.input
    innerInput.setAttribute('aria-valuenow', this.currentValue)
  }
}
</script>

<style lang="scss">
@import './main.scss'
</style>
