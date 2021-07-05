<template>
  <div
    class="hs-steps"
    :class="[
       !simple && 'hs-steps--' + direction,
       simple && 'hs-steps--simple'
     ]">
      <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Migrating from '@/mixins/migrating'

@Component({
  name: 'hs-steps',
  mixins: [Migrating]
})

export default class HsSteps extends Vue {
  @Prop({ type: [Number, String] })
  private space!: number|string

  @Prop({ type: Number })
  private active!: number

  @Prop({ type: String, default: 'horizontal' })
  private direction!: string

  @Prop({ type: Boolean })
  private alignCenter!: boolean

  @Prop({ type: Boolean })
  private simple!: boolean

  @Prop({ type: String, default: 'finish' })
  private finishStatus!: string

  @Prop({ type: String, default: 'process' })
  private processStatus!: string

  private steps = []
  private stepOffset = 0

  private getMigratingConfig () {
    return {
      props: {
        center: 'center is removed.'
      }
    }
  }

  @Watch('active')
  private activeChange (newVal: any, oldVal: any) {
    this.$emit('change', newVal, oldVal)
  }

  @Watch('steps')
  private stepsChange (steps: any) {
    steps.forEach((child: any, index: any) => {
      child.index = index
    })
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
