<template>
  <div :id="id" class="hs-chart-body"></div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { ThemeType, OptsType } from './types'
import * as echarts from 'echarts'
// // 引入柱状图图表，图表后缀都为 Chart
// import {
//   BarChart,
//   PieChart,
//   LineChart
// } from 'echarts/charts'
// // 引入直角坐标系组件，组件后缀都为 Component
// import {
//   GridComponent,
//   TooltipComponent
// } from 'echarts/components'
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import {
//   CanvasRenderer
// } from 'echarts/renderers'

// // 注册必须的组件
// echarts.use(
//   [GridComponent, BarChart, PieChart, LineChart, TooltipComponent, CanvasRenderer]
// )

@Component({
  name: 'hs-chart'
})
export default class extends Vue {
  @Ref('eCharts')
  public eCharts!: echarts.ECharts;

  private id = `echart-main-${Math.floor(Math.random() * 1e16)}`

  private _chart: any

  @Prop({ type: Object })
  private option!: object|any

  // @Prop({ type: Object })
  // private dispatchAction!: object|any

  @Prop({ type: String })
  private group!: string

  @Prop({ type: String })
  private disGroup!: string

  @Prop({ type: Object })
  private opts!: OptsType|any

  @Prop({ type: String, default: 'light', validator: (val: any) => ['light', 'dark'].includes(val) })
  private theme!:ThemeType

  @Prop({ type: HTMLElement })
  private chartDom!: HTMLElement

  @Prop({ type: Boolean, default: !1 })
  private dispose!: boolean

  @Watch('dispose')
  private disposeChange (val: any) {
    val && echarts.dispose(this._chart)
  }

  mounted () {
    this._chart = echarts.init(this.chartDom || document.getElementById(this.id), this.theme, this.opts)
    this.option && this._chart.setOption(this.option)
    this.bindMouseEvents()
    // this.dispatchAction && this._chart.dispatchAction(this.dispatchAction)
    if (this.group) {
      this._chart.group = this.group
      echarts.connect(this.group)
    }
    this.disGroup && echarts.disconnect(this.disGroup)
  }

  private bindMouseEvents () {
    this._chart.on('click', (params: any) => {
      this.$listeners.click && this.$emit('click', params)
    })
    this._chart.on('dblclick', (params: any) => {
      this.$listeners.dblclick && this.$emit('dblclick', params)
    })
    this._chart.on('mousedown', (params: any) => {
      this.$listeners.mousedown && this.$emit('mousedown', params)
    })
    this._chart.on('mouseup', (params: any) => {
      this.$listeners.mouseup && this.$emit('mouseup', params)
    })
    this._chart.on('mouseover', (params: any) => {
      this.$listeners.mouseover && this.$emit('mouseover', params)
    })
    this._chart.on('mouseout', (params: any) => {
      this.$listeners.mouseout && this.$emit('mouseout', params)
    })
    this._chart.on('globalout', (params: any) => {
      this.$listeners.globalout && this.$emit('globalout', params)
    })
    this._chart.on('contextmenu', (params: any) => {
      this.$listeners.contextmenu && this.$emit('contextmenu', params)
    })
    this._chart.on('selectchanged', (params: any) => {
      this.$listeners.selectchanged && this.$emit('selectchanged', params)
    })
  }
}
</script>

<style lang="scss">
.hs-chart-body{
  width: 100%;
  height: 100%;
}
</style>
