<template>
  <el-cascader-panel
    ref="cascaderPanel"
    v-model="val"
    :options="options"
    :props="props"
    @change="_change"
    @expandChange="_expandChange"
  >
  <slot></slot>
  </el-cascader-panel>
</template>
<script lang="ts">
import { Vue, Component, Model, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'hs-cascader-panel'
})
export default class HsCascaderPanel extends Vue {
  @Model('changeVal', { type: [String, Boolean, Number, Array] })
  private value!: string|number|boolean|[]

  public val: any = this.value

  @Watch('val', { deep: !0 })
  private onVal () {
    this.$emit('changeVal', this.val)
  }

  @Prop({ type: Array })
  private options!: any[]

  @Prop({ type: Object })
  private props!: {}

  private _change (val: any) {
    this.$listeners.change && this.$emit('change', val)
  }

  private _expandChange (val: any) {
    this.$listeners['expand-change'] && this.$emit('expand-change', val)
  }

  public $refs!: {
    cascaderPanel: any
  }

  public getCheckedNodes (leafOnly: any) {
    this.$refs.cascaderPanel.getCheckedNodes(leafOnly)
  }

  public clearCheckedNodes () {
    this.$refs.cascaderPanel.clearCheckedNodes()
  }
}
</script>

<style lang="scss">
@import "./main.scss"
</style>
