<template>
  <transition name="hs-zoom-in-center" v-if="!disableTransitions">
    <span :class="fClass()" @click="handleClick">
      <slot></slot>
      <template v-if="closable">
        <i class="hs-tag__close hs-icon-close" @click="handleClose"></i>
      </template>
    </span>
  </transition>
  <span :class="fClass()" @click="handleClick" v-else>
    <slot></slot>
    <template v-if="closable">
      <i class="hs-tag__close hs-icon-close" @click="handleClose"></i>
    </template>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  name: 'hs-tag'
})
export default class HsTag extends Vue {
  @Prop({ type: String, default: 'default' })
  private type!: string

  @Prop({ type: String })
  private color!: string

  @Prop({ type: String, default: 'light' })
  private effect!: string

  @Prop({ type: String })
  private size!: string

  @Prop({ type: Boolean, default: !1 })
  private closable!: boolean

  @Prop({ type: Boolean, default: !1 })
  private hit!: boolean

  @Prop({ type: Boolean, default: !1 })
  private disableTransitions!: boolean

  private fClass () {
    return `hs-tag ${this.type ? 'hs-tag--' + this.type : ''} ${this.hit ? 'is-hit' : ''} ${this.size ? 'hs-tag--' + this.size : ''} ${this.effect ? 'hs-tag--' + this.effect : 'hs-tag--light'}`
  }

  private handleClose (event: Event) {
    event.stopPropagation()
    this.$emit('close', event)
  }

  private handleClick (event: Event) {
    this.$emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/hs/transition";
@import "./main.scss";
</style>
