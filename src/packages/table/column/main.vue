<template>
  <el-table-column
  v-if="$scopedSlots && !!$scopedSlots.default"
  :label="label"
  :prop="prop"
  :type="type"
  :fixed="fixed"
  :width="width"
  :sortable="sortable"
  :selectable="selectable"
  :align="align"
  :header-align="headerAlign"
  :formatter="formatter"
  :index="index"
  :column-key="columnKey"
  :min-width="minWidth"
  :sort-method="sortMethod"
  :render-header="renderHeader"
  :sort-by="sortBy"
  :sort-orders="sortOrders"
  :show-overflow-tooltip="showOverflowTooltip"
  :class-name="className"
  :label-class-name="labelClassName"
  :reserve-selection="reserveSelection"
  :filters="filters"
  :filter-placement="filterPlacement"
  :filter-multiple="filterMultiple"
  :filter-method="filterMethod"
  :filtered-value="filteredValue"
  >
    <template slot="header" slot-scope="{ column, $index }" >
      <slot v-if="$scopedSlots && !!$scopedSlots.header" name="header" :column="column" :$index="$index"></slot>
      <template v-else>
        <span>{{ column.label }}</span>
      </template>
    </template>
    <template slot-scope="{ row, column, $index }">
      <slot :row="row" :column="column" :$index="$index"></slot>
    </template>
    <template>
      <slot v-if="$slots && !!$slots.default"></slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :label="label"
    :prop="prop"
    :type="type"
    :fixed="fixed"
    :width="width"
    :align="align"
    :header-align="headerAlign"
    :formatter="formatter"
    :index="index"
    :column-key="columnKey"
    :selectable="selectable"
    :sortable="sortable"
    :min-width="minWidth"
    :sort-method="sortMethod"
    :render-header="renderHeader"
    :sort-by="sortBy"
    :sort-orders="sortOrders"
    :show-overflow-tooltip="showOverflowTooltip"
    :class-name="className"
    :label-class-name="labelClassName"
    :reserve-selection="reserveSelection"
    :filters="filters"
    :filter-placement="filterPlacement"
    :filter-multiple="filterMultiple"
    :filter-method="filterMethod"
    :filtered-value="filteredValue"
  >
    <template slot="header" slot-scope="{ column, $index }" >
      <slot v-if="$scopedSlots && !!$scopedSlots.header" name="header" :column="column" :$index="$index"></slot>
      <template v-else>
        <span>{{ column.label }}</span>
      </template>
    </template>
    <template>
      <slot v-if="$slots && !!$slots.default"></slot>
    </template>
  </el-table-column>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TableColumnType, RenderHeaderData, TableColumnFilter, TableColumnFixedType, SortOrders, TableColumn, ElementUIHorizontalAlignment, sortable } from '@/utils/types/table'

@Component({
  name: 'hs-table-column'
})
export default class HsTableColumn extends Vue {
  private isHeader = !1

  private isScopedDefault = !0

  beforeMount () {
    if (this.$scopedSlots && !!this.$scopedSlots.default) {
      this.isScopedDefault = !0
    }
    if (this.$scopedSlots && !!this.$scopedSlots.header) {
      this.isHeader = !0
    }
  }

  @Prop({ type!: String })
  private type!: TableColumnType

  @Prop({ type!: String })
  private label!: string

  @Prop({ type!: Array })
  private filters!: any[]

  @Prop({ type!: [Number, Function] })
  private index!: string| ((index: any) => number)

  @Prop({ type!: String })
  private columnKey!: string

  @Prop({ type!: String })
  private prop!: string

  @Prop({ type!: [String, Number] })
  private width!: string|number

  @Prop({ type!: String })
  private minWidth!: string

  @Prop({ type!: [Boolean, String] })
  private fixed!: boolean | TableColumnFixedType

  @Prop({ type!: Function })
  private renderHeader!: ((h: any, col: RenderHeaderData) => number)

  @Prop({ type!: Function })
  private sortMethod!: ((a: any, b: any) => number)

  @Prop({ type!: [String, Boolean], default: !1 })
  private sortable!: sortable

  @Prop({ type!: Array, default: () => (['ascending', 'descending', null]) })
  private sortOrders!: SortOrders[]

  @Prop({ type!: Boolean, default: !0 })
  private resizable!: boolean

  @Prop({ type!: [String, Array, Function] })
  private sortBy!: string|any[]|((row: any, index: any) => string|any[])

  @Prop({ type!: Function })
  private formatter!: (row: object, column: TableColumn) => any

  @Prop({ type!: Boolean, default: !1 })
  private showOverflowTooltip!: boolean

  @Prop({ type!: String, default: 'left' })
  private align!: ElementUIHorizontalAlignment

  @Prop({ type!: String })
  private headerAlign!: ElementUIHorizontalAlignment

  @Prop({ type!: String })
  private className!: string

  @Prop({ type!: String })
  private labelClassName!: string

  @Prop({ type!: Function })
  private selectable!: (row: object, index: number) => boolean

  @Prop({ type!: Boolean, default: !1 })
  private reserveSelection!: boolean

  @Prop({ type!: Boolean, default: !0 })
  private filterMultiple!: boolean

  @Prop({ type!: String })
  private filterPlacement!: string

  @Prop({ type!: Function })
  private filterMethod!: (value: any, row: object) => boolean

  @Prop({ type!: Array })
  private filteredValue!: any[]
}
</script>
<style scoped>
@import "./main.css";
</style>
