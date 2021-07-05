<template>
  <div class="hs-select">
    <el-select
      ref="select"
      v-model="val"
      :multiple="multiple"
      :disabled="disabled"
      :value-key="valueKey"
      :size="size"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :multiple-limit="multipleLimit"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :filterable="filterable"
      :allow-create="allowCreate"
      :filter-method="filterMethod"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      :loading-text="loadingText"
      :no-match-text="noMatchText"
      :no-data-text="noDataText"
      :popper-class="popperClass"
      :reserve-keyword="reserveKeyword"
      :default-first-option="defaultFirstOption"
      :popper-append-to-body="popperAppendToBody"
      :automatic-dropdown="automaticDropdown"
      @change="_change"
      @visible-change="_visibleChange"
      @remove-tag="_removeTag"
      @clear="_clear"
      @blur="_blur"
      @focus="_focus"
    >
      <template slot="prefix">
        <slot v-if="$slots && !!$slots.prefix" name="prefix"></slot>
        <template v-else>
        </template>
      </template>
      <slot></slot>
      <template slot="empty">
        <slot v-if="$slots && !!$slots.empty" name="empty"></slot>
        <template v-else>
        </template>
      </template>
      <template v-if="options">
        <el-option
          v-for="(item, i) in options" :key="i"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled">
        </el-option>
      </template>
      <template v-if="groups">
        <el-option-group
          v-for="(itemG, i) in groups" :key="i"
          :label="itemG.label"
          :disabled="itemG.disabled">
          <el-option
            v-for="(item, j) in itemG.options" :key="j"
            :value="item.value"
            :label="item.label"
            :disabled="item.disabled">
          </el-option>
        </el-option-group>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Watch } from 'vue-property-decorator'

@Component({
  name: 'hs-select'
})
export default class HsSelect extends Vue {
  @Prop({ type: String, default: 'select' })
  private type!: string

  @Prop({ type: Array })
  private options!: any[]

  @Prop({ type: Array })
  private groups!: any[]

  @Model('changeVal', { type: [String, Boolean, Number, Array] })
  private value!: string|number|boolean|[]

  public val: any = this.value

  @Watch('val', { deep: !0 })
  private onVal () {
    this.$emit('changeVal', this.val)
  }

  @Prop({ type: Boolean, default: !1 })
  private multiple!: boolean

  @Prop({ type: Boolean, default: !1 })
  private disabled!: boolean

  @Prop({ type: String, default: 'value' })
  private valueKey!: string

  @Prop({ type: String })
  private size!: string

  @Prop({ type: Boolean, default: !1 })
  private clearable!: boolean

  @Prop({ type: Boolean, default: !1 })
  private collapseTags!: boolean

  @Prop({ type: Number, default: 0 })
  private multipleLimit!: number

  @Prop({ type: String })
  private name!: string

  @Prop({ type: String, default: 'off' })
  private autocomplete!: string

  @Prop({ type: String })
  private placeholder!: string

  @Prop({ type: Boolean, default: !0 })
  private filterable!: boolean

  @Prop({ type: Boolean, default: !1 })
  private allowCreate!: boolean

  @Prop({ type: Function })
  private filterMethod!: Function

  @Prop({ type: Boolean, default: !1 })
  private remote!: boolean

  @Prop({ type: Function })
  private remoteMethod!: Function

  @Prop({ type: Boolean, default: !1 })
  private loading!: boolean

  @Prop({ type: String, default: '加载中' })
  private loadingText!: string

  @Prop({ type: String, default: '无匹配数据' })
  private noMatchText!: string

  @Prop({ type: String, default: '无数据' })
  private noDataText!: string

  @Prop({ type: String })
  private popperClass!: string

  @Prop({ type: Boolean, default: !1 })
  private reserveKeyword!: boolean

  @Prop({ type: Boolean, default: !1 })
  private defaultFirstOption!: boolean

  @Prop({ type: Boolean, default: !0 })
  private popperAppendToBody!: boolean

  @Prop({ type: Boolean, default: !1 })
  private automaticDropdown!: boolean

  public $refs!: {
    select: any
  }

  private _change (val: any) {
    setTimeout(() => {
      const labels = (this.$refs.select as any).multiple ? (this.$refs.select as any).selected.map((v: any) => v.label) : (this.$refs.select as any).selected.label
      this.$listeners.change && this.$emit('change', val, labels)
    })
  }

  private _visibleChange (flag: any) {
    this.$listeners['visible-change'] && this.$emit('visible-change', flag)
  }

  private _removeTag (tag: any) {
    this.$listeners['remove-tag'] && this.$emit('remove-tag', tag)
  }

  private _clear () {
    this.$listeners.clear && this.$emit('clear')
  }

  private _blur (event: any) {
    this.$listeners.blur && this.$emit('blur', event)
  }

  private _focus (event: any) {
    this.$listeners.focus && this.$emit('focus', event)
  }

  public focus () {
    this.$refs.select.focus()
  }

  public blur () {
    this.$refs.select.blur()
  }
}
</script>

<style lang="scss">
@import "./main.scss";
</style>
