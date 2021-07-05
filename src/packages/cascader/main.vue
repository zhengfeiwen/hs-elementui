<template>
  <div class="hs-cascader">
    <el-cascader
      ref="cascader"
      v-model="val"
      :options="options"
      :props="props"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :show-all-levels="showAllLevels"
      :collapse-tags="collapseTags"
      :separator="separator"
      :filterable="filterable"
      :filter-method="filterMethod"
      :debounce="debounce"
      :before-filter="beforeFilter"
      :popper-class="popperClass"
      @change="_change"
      @expand-change="_expandChange"
      @blur="_blur"
      @focus="_focus"
      @visible-change="_visibleChange"
      @remove-tag="_removeTag">
      <template v-if="$slots && !!$slots.default" slot-scope="scope">
        <slot :scope="scope"></slot>
      </template>
      <template slot="empty">
        <slot v-if="$slots && !!$slots.empty" name="empty"></slot>
        <template v-else>
        </template>
      </template>
    </el-cascader>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'vue-property-decorator'
@Component({
  name: 'hs-cascader'
})
export default class HsCascader extends Vue {
  @Prop({ type: Array })
  private options!: any[]

  @Model('changeVal', { type: [String, Boolean, Number, Array] })
  private value!: string|number|boolean|[]

  public val: any = this.value

  @Watch('val', { deep: !0 })
  private onVal () {
    this.$emit('changeVal', this.val)
  }

  @Prop({
    type: Object,
    default: () => ({
      expandTrigger: 'click',
      multiple: !1,
      checkStrictly: !1,
      emitPath: !0,
      lazy: !1,
      value: 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled',
      leaf: 'leaf'
    })
  })
  private props!: {}

  @Prop({ type: String })
  private size!: string

  @Prop({ type: String, default: '请选择' })
  private placeholder!: string

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: Boolean, default: !1 })
  private clearable!: boolean

  @Prop({ type: Boolean, default: !0 })
  private showAllLevels!: boolean

  @Prop({ type: Boolean, default: !1 })
  private collapseTags!: boolean

  @Prop({ type: String, default: '/' })
  private separator!: string

  @Prop({ type: Boolean })
  private filterable!: boolean

  @Prop({ type: Function })
  private filterMethod!: Function

  @Prop({ type: Number })
  private debounce!: number

  @Prop({ type: Function })
  private beforeFilter!: Function

  @Prop({ type: String })
  private popperClass!: string

  private _change (val: any) {
    this.$listeners.change && this.$emit('change', val)
  }

  private _expandChange (val: any) {
    this.$listeners['expand-change'] && this.$emit('expand-change', val)
  }

  private _blur (event: any) {
    this.$listeners.blur && this.$emit('blur', event)
  }

  private _focus (event: any) {
    this.$listeners.focus && this.$emit('focus', event)
  }

  private _visibleChange (flag: any) {
    this.$listeners['visible-change'] && this.$emit('visible-change', flag)
  }

  private _removeTag (val: any) {
    this.$listeners['remove-tag'] && this.$emit('remove-tag', val)
  }

  public $refs!: {
    cascader: any
  }

  public getCheckedNodes (leafOnly: any) {
    this.$refs.cascader.getCheckedNodes(leafOnly)
  }
}
</script>

<style lang="scss">
@import "./main.scss"
</style>
