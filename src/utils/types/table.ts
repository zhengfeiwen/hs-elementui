export type TableColumnType = 'default' | 'selection' | 'index' | 'expand'
export type TableColumnFixedType = 'left' | 'right'
export type SortOrders = 'ascending' | 'descending' | null
export type TableColumn = {
  label: string,
  property: string,
  type: string,
  fixed: boolean | string
}
export interface RenderHeaderData {
  column: any,
  $index: number
}
export interface TableColumnFilter {
  text: string,
  value: any
}

export type sortable = true|false|'custom'
export type ElementUIComponentSize = 'large' | 'medium' | 'small' | 'mini'
export type TableSize = 'large' | 'medium' | 'small' | 'mini'
export type ElementUIHorizontalAlignment = 'left' | 'center' | 'right'
export interface rowCallbackParams {
  row: any,
  rowIndex: number
}

export type TooltipEffect = 'dark' | 'light'

export interface SummaryMethodParams {
  columns: any[],
  data: any
}

export interface cellCallbackParams {
  row: any,
  rowIndex: number,
  column: any,
  columnIndex: number
}

export interface treeNode {
  rowKey: string | number,
  isLeaf: boolean,
  level: number,
  expanded: boolean,
  loaded: boolean
}

export type sort = {
  column: any,
   prop: any,
   order: any
}