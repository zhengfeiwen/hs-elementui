<template>
  <transition name="hs-alert-fade">
    <div
      class="hs-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
      role="alert"
    >
      <i class="hs-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="hs-alert__content">
        <span class="hs-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="hs-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="hs-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <i class="hs-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'hs-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'

const TYPE_CLASSES_MAP: any = {
  success: 'hs-icon-success',
  warning: 'hs-icon-warning',
  error: 'hs-icon-error'
}

@Component({
  name: 'hs-alert'
})

export default class HAlert extends Vue {
  @Prop({ type: String, default: '' })
  private title!: string

  @Prop({ type: String, default: '' })
  private description!: string

  @Prop({ type: String, default: 'info' })
  private type!: string

  @Prop({ type: Boolean, default: !0 })
  private closable!: boolean

  @Prop({ type: String, default: '' })
  private closeText!: string

  @Prop({ type: Boolean })
  private showIcon!: boolean

  @Prop({ type: Boolean })
  private center!: boolean

  @Prop({
    type: String,
    default: 'light',
    validator: function (value) {
      return ['light', 'dark'].indexOf(value) !== -1
    }
  })
  private effect!: string

  private visible = !0

  private close () {
    this.visible = false
    this.$emit('close')
  }

  get typeClass () {
    return `hs-alert--${this.type}`
  }

  get iconClass () {
    return TYPE_CLASSES_MAP[this.type] || 'hs-icon-info'
  }

  get isBigIcon () {
    return this.description || this.$slots.default ? 'is-big' : ''
  }

  get isBoldTitle () {
    return this.description || this.$slots.default ? 'is-bold' : ''
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
