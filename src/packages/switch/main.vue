<template>
  <div
    class="hs-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      class="hs-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    >
    <span
      :class="['hs-switch__label', 'hs-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText">
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span class="hs-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
    </span>
    <span
      :class="['hs-switch__label', 'hs-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator'
import emitter from '@/mixins/emitter'
import Focus from '@/mixins/focus'
import Migrating from '@/mixins/migrating'

@Component({
  name: 'hs-switch',
  mixins: [Focus('input'), Migrating, emitter]
})

export default class HsSwitch extends Vue {
  @Inject({ from: 'hsForm', default: '' })
  private hsForm!: any

  @Prop({ type: [Boolean, String, Number], default: !1 })
  private value!: boolean|string|number

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: Number, default: 40 })
  private width!: number

  @Prop({ type: String, default: '' })
  private activeIconClass!: string

  @Prop({ type: [Boolean, String, Number], default: '' })
  private inactiveIconClass!: string

  @Prop({ type: String })
  private activeText!: string

  @Prop({ type: String })
  private inactiveText!: string

  @Prop({ type: String, default: '' })
  private activeColor!: string

  @Prop({ type: String, default: '' })
  private inactiveColor!: string

  @Prop({ type: [Boolean, String, Number], default: !0 })
  private activeValue!: boolean|string|number

  @Prop({ type: [Boolean, String, Number], default: !1 })
  private inactiveValue!: boolean|string|number

  @Prop({ type: String, default: '' })
  private name!: string

  @Prop({ type: Boolean, default: !0 })
  private validateEvent!: boolean

  @Prop({ type: String })
  private id!: string

  private coreWidth: any = this.width

  private created () {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue)
    }
  }

  get checked () {
    return this.value === this.activeValue
  }

  get switchDisabled () {
    return this.disabled || (this.hsForm || {}).disabled
  }

  @Watch('checked')
  private checkedChange () {
    (this.$refs.input as any).checked = this.checked
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    if (this.validateEvent) {
      (this as any).dispatch('hs-form-item', 'hs.form.change', this.value)
    }
  }

  private handleChange (event: any) {
    const val = this.checked ? this.inactiveValue : this.activeValue
    this.$emit('input', val)
    this.$emit('change', val)
    this.$nextTick(() => {
      (this.$refs.input as any).checked = this.checked
    })
  }

  private setBackgroundColor () {
    let newColor: any = ''
    newColor = this.checked ? this.activeColor : (this as any).inactiveColor;
    (this.$refs.core as any).style.borderColor = newColor;
    (this.$refs.core as any).style.backgroundColor = newColor
  }

  private switchValue () {
    !this.switchDisabled && (this as any).handleChange()
  }

  private getMigratingConfig () {
    return {
      props: {
        'on-color': 'on-color is renamed to active-color.',
        'off-color': 'off-color is renamed to inactive-color.',
        'on-text': 'on-text is renamed to active-text.',
        'off-text': 'off-text is renamed to inactive-text.',
        'on-value': 'on-value is renamed to active-value.',
        'off-value': 'off-value is renamed to inactive-value.',
        'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
        'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
      }
    }
  }

  private mounted () {
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    (this.$refs.input as any).checked = this.checked
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
