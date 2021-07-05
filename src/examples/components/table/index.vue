<template>
  <div class="container">
     <hs-table :isCheckbox="!0" columnable style="width: 100%" :data="tableData.list" border :columns="columns" :exportable="!0" :export-columns="columns">
       <template slot="action-block">
          <el-button type="danger" icon="hs-icon-plus" size="mini">新增</el-button>
          <el-button type="danger" icon="hs-icon-plus" size="mini">新增</el-button>
          <el-button type="danger" icon="hs-icon-plus" size="mini">新增</el-button>
          <!-- <hs-button type="danger" icon="hs-icon-upload" @click="onRemove" size="mini">缴费变更导入</hs-button> -->
        </template>
      <template v-for="(column, i) in columns">
        <hs-table-column
          v-if="!column.hidden"
          align="center"
          header-align="center"
          :key="i"
          :fixed="column.fixed"
          :show-overflow-tooltip="true"
          :prop="column.prop"
          :label="column.label"
          :width="column.width">
        </hs-table-column>
      </template>
     </hs-table>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import HsTable from '@/packages/table/main.vue'
import HsTableColumn from '@/packages/table/column/main.vue'
import { MessageBox } from 'element-ui'
Vue.prototype.$confirm = MessageBox.confirm
@Component({
  name: 'hs-table-demo',
  components: {
    'hs-table': HsTable,
    'hs-table-column': HsTableColumn
  }
})
export default class TableDemo extends Vue {
  private tableData = {
    list: [{}],
    totalCount: 0
  }

  private columns = [{
    prop: 'grade',
    label: '年级',
    hidden: !1
  },
  {
    prop: 'subject',
    label: '专业',
    hidden: !0
  },
  {
    prop: 'len',
    label: '学年',
    hidden: !1
  },
  {
    prop: 'feeStandardCode',
    label: '收费标准代码',
    hidden: !1
  },
  {
    prop: 'feeStandardItem',
    label: '收费项目',
    hidden: !1
  },
  {
    prop: 'feeStandardItemCode',
    label: '收费项目代码',
    hidden: !1
  },
  {
    prop: 'money',
    label: '金额',
    format: 'money',
    hidden: !1
  },
  {
    prop: 'isMust',
    label: '是否必缴',
    hidden: !1
  },
  {
    prop: 'isRefund',
    label: '允许退费',
    hidden: !1
  }]
}
</script>

<style>
.container{
  width: 800px;
  height: 600px;
}
</style>
