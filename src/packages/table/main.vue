<template>
  <div class="hs-table">
    <div class="action-block" v-if="$slots['action-block']">
      <div class="action-block-left"><slot name="action-block"/></div>
      <div class="export-body" v-if="exportable">
        <hs-button size="mini" type="primary" @click="exportHandle"><svg-icon style="font-size: 14px;" name="export" />&nbsp;导出</hs-button>
        <el-table
          border
          hidden
          style="width: 100%"
          :data="eData||data"
          :id="id"
          >
          <el-table-column v-for="(column, i) in getcolumns" :key="i"
            :prop="column.prop"
            :label="column.label"
            :width="column.width">
          </el-table-column>
        </el-table>
      </div>
       <hs-dropdown @visible-change="columnVisibleChange" ref="columnDrop" trigger="click" v-if="columnable">
        <hs-button size="mini">
          <i class="hs-icon-s-grid" />
        </hs-button>
        <hs-dropdown-menu slot="dropdown">
          <div class="column-container">
            <header>
              <span>列设置</span>
            </header>
            <section>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllColumns" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                <el-checkbox v-for="column in columns" :label="column.prop" :key="column.prop">{{ column.label }}</el-checkbox>
              </el-checkbox-group>
            </section>
            <footer>
              <hs-link @click="onColumCancel" size="mini">取消</hs-link>
              <hs-link size="mini" @click="onColumSave" type="primary">确认</hs-link>
            </footer>
          </div>
        </hs-dropdown-menu>
      </hs-dropdown>
    </div>
    <div class="table-setting" v-if="isCheckbox">
      <div class="alert-bolck">
        <i class="hs-icon-info" />
        <span>{{ '已选择 ' + selectedRow.length + ' 项目' }}</span>
        <hs-link type="primary" @click="clear">清空</hs-link>
      </div>
    </div>
     <el-table
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中..."
      ref="hsTable"
      :data="data"
      :style="tableStyle"
      :size="size"
      :row-key="rowKey"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :cell-style="cellStyle"
      :cell-class-name="cellClassName"
      :show-header="showHeader"
      :span-method="spanMethod"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :header-row-class-name="headerRowClassName"
      :header-cell-class-name="headerCellClassName"
      :highlight-current-row="highlightCurrentRow"
      :header-row-style="headerRowStyle"
      :header-cell-style="headerCellStyle"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :show-summary="showSummary"
      :lazy="lazy"
      :load="load"
      :indent="indent"
      :tooltip-effect="tooltipEffect"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :tree-props="treeProps"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @row-click="rowClick"
      @row-dbclick="rowDbclick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
      >
      <template slot-scope="scope">
        <slot :scope="scope"></slot>
      </template>
      <template slot="append">
        <slot v-if="$slots && !!$slots.append" name="append"></slot>
        <template v-else>
        </template>
      </template>
    </el-table>
    <div class="block-pagination">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { TableSize, rowCallbackParams, TooltipEffect, SummaryMethodParams, cellCallbackParams, treeNode, sort } from '@/utils/types/table'
import { ElTable } from 'element-ui/types/table'
import HsButton from '@/packages/button/main.vue'
import HsDropdown from '@/packages/dropdown/main.vue'
import HsDropdownItem from '@/packages/dropdown/item/main.vue'
import HsDropdownMenu from '@/packages/dropdown/menu/main.vue'
import HsLink from '@/packages/link/main.vue'
import HsTag from '@/packages/tag/main.vue'
import HsRadio from '@/packages/radio/main.vue'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { random } from '@/utils/commons'
@Component({
  name: 'hs-table',
  components: {
    HsButton,
    HsDropdown,
    HsDropdownItem,
    HsDropdownMenu,
    HsLink,
    HsTag,
    HsRadio
  }
})
export default class HsTable extends Vue {
  @Ref('hsTable')
  public hsTable: ElTable = this.$refs.hsTable;

  @Prop({ type: Array })
  private data!: object[]

  @Prop({ type: Array, default: () => ([]) })
  private columns!: object[]

  @Prop({ type: Boolean, default: !1 })
  private loading!: boolean

  @Prop({ type: Boolean, default: !1 })
  private isCheckbox!: boolean

  @Prop({ type: String })
  private tableStyle!: string

  @Prop({ type: [Function, String] })
  private rowKey!: ((param: rowCallbackParams) => string)|string

  @Prop({ type: String })
  private size!: TableSize

  @Prop({ type: Boolean, default: !1 })
  private stripe!: boolean

  @Prop({ type: Boolean, default: !1 })
  private border!: boolean

  @Prop({ type: Boolean, default: !1 })
  private exportable!: boolean

  @Prop({ type: Boolean, default: !1 })
  private columnable!: boolean

  @Prop({ type: Boolean, default: !0 })
  private fir!: boolean

  @Prop({ type: [Number, String] })
  private maxHeight!: number|string

  @Prop({ type: [Number, String] })
  private height!: number|string

  @Prop({ type: [Function, Object] })
  private cellStyle!: ((param: rowCallbackParams) => object)|object

  @Prop({ type: Boolean, default: !0 })
  private showHeader!: boolean

  @Prop({ type: Boolean, default: !1 })
  private highlightCurrentRow!: boolean

  @Prop({ type: [String, Number] })
  private currentRowKey!: string|number

  @Prop({ type: [Function, String] })
  private rowClassName!: ((param: rowCallbackParams) => string)|string

  @Prop({ type: [Function, Object] })
  private rowStyle!: ((param: rowCallbackParams) => object)|object

  @Prop({ type: [Function, Object, String] })
  private cellClassName!: ((param: rowCallbackParams) => string)|string

  @Prop({ type: [Function, String] })
  private headerRowClassName!: ((param: rowCallbackParams) => string)|string

  @Prop({ type: [Function, Object] })
  private headerRowStyle!: ((param: rowCallbackParams) => object)|object

  @Prop({ type: [Function, String] })
  private headerCellClassName!: ((param: rowCallbackParams) => string)|string

  @Prop({ type: [Function, Object] })
  private headerCellStyle!: ((param: rowCallbackParams) => object)|object

  @Prop({ type: String })
  private emptyText!: string

  @Prop({ type: Boolean, default: !0 })
  private defaultExpandAll!: boolean

  @Prop({ type: Array })
  private expandRowKeys!: any[]

  @Prop({ type: Object })
  private defaultSort!: object

  @Prop({ type: String })
  private tooltipEffect!: TooltipEffect

  @Prop({ type: Boolean, default: !1 })
  private showSummary!: boolean

  @Prop({ type: String, default: '合计' })
  private sumText!: string

  @Prop({ type: String, default: '列表信息' })
  private exportName!: string

  @Prop({ type: Array })
  private exportColumns!: string

  @Prop({ type: Function })
  private summaryMethod!: (param: SummaryMethodParams) => any[]

  @Prop({ type: Function })
  private spanMethod!: (param: cellCallbackParams) => any[]

  @Prop({ type: Boolean, default: !0 })
  private selectOnIndeterminate!: boolean

  @Prop({ type: Number, default: 16 })
  private indent!: number

  @Prop({ type: Boolean })
  private lazy!: boolean

  @Prop({ type: Function })
  private exportData!: Function

  @Prop({
    type: Object,
    default: () => ({
      hasChildren: 'hasChildren',
      children: 'children'
    })
  })
  private treeProps!: object

  private selectedRow = []

  get getcolumns () {
    return this.exportColumns || this.columns
  }

  @Prop({ type: Function })
  private load!:(row: object, treeNode: treeNode, resolve: Function) => void

  private select (selection: any, row: any) {
    if (this.$listeners.select) {
      this.$emit('select', selection, row)
    }
  }

  private selectAll (selection: any) {
    if (this.$listeners['select-all']) {
      this.$emit('select-all', selection)
    }
  }

  private selectionChange (selection: any, row: any) {
    this.selectedRow = selection
    if (this.$listeners['selection-change']) {
      this.$emit('selection-change', selection, row)
    }
  }

  private clear () {
    this.clearSelection()
    this.selectedRow = []
  }

  private cellMouseEnter (row: any, column: any, cell: any, event: any) {
    if (this.$listeners['cell-mouse-enter']) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    }
  }

  private cellMouseLeave (row: any, column: any, cell: any, event: any) {
    if (this.$listeners['cell-mouse-leave']) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    }
  }

  private cellClick (row: any, column: any, cell: any, event: any) {
    if (this.$listeners['cell-click']) {
      this.$emit('cell-click', row, column, cell, event)
    }
  }

  private cellDblclick (row: any, column: any, cell: any, event: any) {
    if (this.$listeners['cell-dblclick']) {
      this.$emit('cell-dblclick', row, column, cell, event)
    }
  }

  private rowClick (row: any, column: any, event: any) {
    if (this.$listeners['row-click']) {
      this.$emit('row-click', row, column, event)
    }
  }

  private rowDbclick (row: any, column: any, event: any) {
    if (this.$listeners['row-dbclick']) {
      this.$emit('row-dbclick', row, column, event)
    }
  }

  private rowContextmenu (row: any, column: any, event: any) {
    if (this.$listeners['row-contextmenu']) {
      this.$emit('row-contextmenu', row, column, event)
    }
  }

  private rowDblclick (row: any, column: any, event: any) {
    if (this.$listeners['row-dblclick']) {
      this.$emit('row-dblclick', row, column, event)
    }
  }

  private headerClick (column: any, event: any) {
    if (this.$listeners['header-click']) {
      this.$emit('header-click', column, event)
    }
  }

  private headerContextmenu (column: any, event: any) {
    if (this.$listeners['header-contextmenu']) {
      this.$emit('header-contextmenu', column, event)
    }
  }

  private sortChange (sort: sort) {
    if (this.$listeners['sort-change']) {
      this.$emit('sort-change', sort)
    }
  }

  private filterChange (filters: any) {
    if (this.$listeners['filter-change']) {
      this.$emit('filter-change', filters)
    }
  }

  private currentChange (filters: any) {
    if (this.$listeners['current-change']) {
      this.$emit('current-change', filters)
    }
  }

  private headerDragend (newWidth: any, oldWidth: any, column: any, event: any) {
    if (this.$listeners['header-dragend']) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event)
    }
  }

  private expandChange (row: any, expandedRows: any) {
    if (this.$listeners['expand-change']) {
      this.$emit('seleexpand-changect', row, expandedRows)
    }
  }

  public $refs!: {
    hsTable: ElTable
  };

  public clearSelection () {
    this.$refs.hsTable.clearSelection()
  }

  public toggleRowSelection (row: any, selected: any) {
    this.$refs.hsTable.toggleRowSelection(row, selected)
  }

  public toggleAllSelection () {
    this.$refs.hsTable.toggleAllSelection()
  }

  public toggleRowExpansion (row: any, expanded: any) {
    this.$refs.hsTable.toggleRowExpansion(row, expanded)
  }

  public setCurrentRow (row: any) {
    this.$refs.hsTable.setCurrentRow(row)
  }

  public clearSort () {
    this.$refs.hsTable.clearSort()
  }

  public clearFilter (columnKey: any) {
    this.$refs.hsTable.clearFilter()
  }

  public doLayout () {
    this.$refs.hsTable.doLayout()
  }

  public sort (prop: string, order: string) {
    this.$refs.hsTable.sort(prop, order)
  }

  private id = 'out-eltable-' + Math.random().toString(36).substr(2, 6)

  private eData = []

  private exportStack = {
    id: '',
    type: 0,
    message: '',
    state: 0
  }

  private exportHandle () {
    // this.$stickMessage('11111111')
    this.$confirm('确认要导出数据?（如果导出数据量较大时间会比较久,请耐心等待）', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    }).then(() => {
      if (this.exportData) {
        this.exportData(this.export)
      } else {
        this.export(this.data)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  private export (exportData: any) {
    this.eData = exportData
    setTimeout(() => {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#' + this.id), { raw: !0 })
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          `${this.exportName}.xlsx`
        )
        this.exportStack.state = 2
      } catch (e) {
        if (typeof console !== 'undefined') { console.log(e, wbout) }
      }
      return wbout
    }, 500)
  }

  private checkedColumns = [...this.columns.filter((v: any) => !v.hidden).map((v: any) => v.prop)]

  private checkAllColumns = !0

  private isIndeterminate = !1

  private handleCheckAllChange (val: any) {
    this.checkedColumns = val ? [...this.columns.map((v: any) => v.prop)] : []
    this.isIndeterminate = !1
  }

  private handleCheckedColumnsChange (value: any) {
    const checkedCount = value.length
    this.checkAllColumns = checkedCount === this.columns.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length
  }

  private onColumCancel () {
    this.checkedColumns = []
    this.columns.map((v: any) => {
      if (!v.hidden) {
        this.checkedColumns.push(v.prop)
      }
    });
    (this.$refs as any).columnDrop.hide()
  }

  private columnVisibleChange (flag: boolean) {
    !flag && this.onColumCancel()
  }

  private onColumSave () {
    this.columns.map((v: any) => {
      if (this.checkedColumns.includes(v.prop)) {
        v.hidden = !1
      } else {
        v.hidden = !0
      }
    });
    (this.$refs as any).columnDrop.hide()
    this.$listeners['column-set-save'] && this.$emit('column-set-save', [...this.columns])
  }
}
</script>
<style lang="scss">
@import "./main.scss";
</style>
