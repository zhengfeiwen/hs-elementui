<template>
  <el-calendar
  :range="range"
  v-model="val"
  :first-day-of-week="firstDayOfWeek"
  >
  <template
    slot="dateCell"
    slot-scope="{date, data}">
    <slot name="dateCell" :date="date" :data="data"></slot>
  </template>

  </el-calendar>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  PropSync,
  Watch,
  Model,
  Vue
} from 'vue-property-decorator'

@Component({
  name: 'hs-calender'
})
export default class HsCalender extends Vue {
  @Prop({ type: Array })
  private range!: []

  @Prop({ type: Number, default: 1 })
  private firstDayOfWeek !: number

  @Model('change', { type: [String, Number, Date] })
  public value!: string|number|Date;

  @Watch('val', { deep: !0 })
  private onVal () {
    this.$emit('change', this.val)
  }

  public val: any = this.value
}
</script>
<style lang="scss" scoped>
@import "./main.scss";
</style>
