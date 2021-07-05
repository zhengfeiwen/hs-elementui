<template>
  <button :disabled="disabled" @click="handleclick" type="button" :class="fClass()">
    <template v-if="icon">
      <i :class="icon"></i>
    </template>
    <span v-if="!!$slots.default"><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ButtonType, ButtonSize } from './types'
@Component({
  name: 'hs-button'
})
export default class Hsbutton extends Vue {
  @Prop({ type: String, default: 'default' })
  private type!: ButtonType

  @Prop({ type: Boolean, default: !1 })
  private plain!: boolean

  @Prop({ type: Boolean, default: !1 })
  private round!: boolean

  @Prop({ type: Boolean, default: !1 })
  private circle!: boolean

  @Prop({ type: Boolean, default: !1 })
  private loading!: boolean

  @Prop({ type: String, default: '' })
  private icon!: string

  @Prop({ type: String, default: 'mini' })
  private size!: string

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  private fClass () {
    const plain = this.plain ? ' is-plain' : ''
    const round = this.round ? ' is-round' : ''
    const circle = this.circle ? ' is-circle' : ''
    const disabled = this.disabled ? ' is-disabled' : ''
    const loading = this.disabled ? ' is-loading' : ''
    const size = this.size ? ` hs-button--${this.size}` : ''
    return `hs-button hs-button--${this.type}${plain}${circle}${disabled}${round}${loading}${size}`
  }

  private handleclick () {
    this.disabled || this.$emit('click')
  }

  beforeMount () {
    this.disabled = this.loading || this.disabled
    this.icon = (this.loading ? 'hs-icon-loading' : this.icon)
  }
}
</script>

<style lang="scss" scoped>
@import "./main.scss";
</style>
