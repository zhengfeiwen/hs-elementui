<template>
  <div :class="card" @mouseenter="handle(!0)" @mouseleave="handle(!1)">
    <header v-if="header">
      {{header}}
    </header>
    <slot name="header"></slot>
    <section :style="bodyStyle">
      <slot/>
    </section>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-card'
})
export default class HsCard extends Vue {
  @Prop({ type: String, default: '' })
  private header!: string

  @Prop({ type: Object, default: () => ({ padding: '20px' }) })
  private bodyStyle!: object

  @Prop({ type: String, default: 'always' })
  private shadow!: string

  private card = {
    'hs-card': !0,
    shadow: this.shadow === 'always'
  }

  private handle (flag: boolean) {
    this.shadow === 'hover' && (this.card.shadow = flag)
  }
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
