<template>
  <div style="width:600px;height:100%;">
    <hs-tabs v-model="activetabName" @tab-click="handleClick">
      <hs-tab-pane label="用户管理" name="first">用户管理</hs-tab-pane>
      <hs-tab-pane label="配置管理" name="second">配置管理</hs-tab-pane>
      <hs-tab-pane label="角色管理" name="third">角色管理</hs-tab-pane>
      <hs-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</hs-tab-pane>
    </hs-tabs>
    <hs-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <hs-cascader :options="optionsCascader" :props="{ expandTrigger: 'hover', checkStrictly: true }" >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </hs-cascader>
      <!-- <hs-form-item label="活动性质" prop="action">
        <hs-checkbox-group v-model="ruleForm.action">
          <hs-checkbox label="美食/餐厅线上活动"></hs-checkbox>
          <hs-checkbox label="地推活动"></hs-checkbox>
          <hs-checkbox label="线下主题活动"></hs-checkbox>
          <hs-checkbox label="单纯品牌曝光"></hs-checkbox>
        </hs-checkbox-group>
      </hs-form-item>
      <hs-form-item label="活动区域" prop="region">
        <hs-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <hs-option label="区域一" value="shanghai"></hs-option>
          <hs-option label="区域二" value="beijing"></hs-option>
        </hs-select>
      </hs-form-item>
      <hs-form-item>
        <hs-select v-model="value1" multiple placeholder="请选择">
          <hs-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </hs-option>
        </hs-select>
      </hs-form-item>
      <hs-form-item>
        <hs-cascader :options="optionsCascader" :props="{ expandTrigger: 'hover' }" >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </hs-cascader>
      </hs-form-item>
      <hs-form-item>
        <div class="block">
          <span class="demonstration">不显示间断点{{valueSlider1}}</span>
          <hs-slider
            v-model="valueSlider1"
            :step="10">
          </hs-slider>
        </div>
        <div class="block">
          <span class="demonstration">显示间断点{{valueSlider2}}</span>
          <hs-slider
            v-model="valueSlider2"
            :step="10"
            show-stops>
          </hs-slider>
        </div>
        <div class="block">
          <span class="demonstration">显示间断点{{valueSlider3}}</span>
          <hs-slider
            v-model="valueSlider3"
            :max="10"
            range
            show-stops>
          </hs-slider>
        </div>
      </hs-form-item>
      <hs-form-item>
        <hs-rate
          v-model="valueRate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </hs-rate>
      </hs-form-item>
      <hs-form-item>
        {{valueTime1}}
        <hs-time-picker
          v-model="valueTime1"
          :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
          }"
          placeholder="任意时间点">
        </hs-time-picker>
      </hs-form-item> -->
       <!-- <hs-form-item label="活动性质" prop="actype">
        <hs-checkbox label="美食/餐厅线上活动" v-model="ruleForm.actype"></hs-checkbox>
      </hs-form-item>
      <hs-form-item label="特殊资源" prop="resource">
        <hs-radio-group v-model="ruleForm.resource">
          <hs-radio label="线上品牌商赞助"></hs-radio>
          <hs-radio label="线下场地免费"></hs-radio>
        </hs-radio-group>
      </hs-form-item>
      <hs-form-item label="即时配送" prop="delivery">
        <hs-switch v-model="ruleForm.delivery"></hs-switch>
      </hs-form-item>
      <hs-form-item label="活动名称" prop="name">
        <hs-input v-model="ruleForm.name"></hs-input>
      </hs-form-item>
      <hs-form-item label="计步器" prop="num">
        <hs-input-number v-model="ruleForm.num" @change="handleChange" :min="0" :max="10" label="描述文字"></hs-input-number>
      </hs-form-item> -->

      <hs-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域" clearable>
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </hs-form-item>
      <hs-form-item label="活动形式" prop="desc">
        <hs-input type="textarea" v-model="ruleForm.desc"></hs-input>
      </hs-form-item>
      <hs-form-item label="活动时间"  prop="date1">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
      </hs-form-item>
      <hs-form-item>
        <hs-button type="primary" @click="submitForm('ruleForm')">立即创建</hs-button>
        <hs-button @click="resetForm('ruleForm')">重置</hs-button>
      </hs-form-item>
    </hs-form>
    <!-- <div class="container">
      <div class="block">
        <span class="demonstration">周</span>
        <hs-date-picker
          v-model="valueDate1"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周">
        </hs-date-picker>
      </div>
    </div>
    <hs-collapse v-model="activeName" accordion>
      <hs-collapse-item title="一致性 Consistency" name="1">
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </hs-collapse-item>
      <hs-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </hs-collapse-item>
      <hs-collapse-item title="效率 Efficiency" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </hs-collapse-item>
      <hs-collapse-item title="可控 Controllability" name="4">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </hs-collapse-item>
      </hs-collapse>
      <hs-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
        <hs-button>上左</hs-button>
      </hs-tooltip>
    <hs-transfer v-model="value" :data="data"></hs-transfer>
    <hs-button  tton type="primary" @click="submitForm('ruleForm')">立即创建</hs-button>
    <hs-button @click="resetForm('ruleForm')">重置</hs-button> -->
    <hs-frame @on-query="onQuery" @on-reset="onReset" :more="!1">
    <template slot="query">
      <el-form ref="form" :model="form" label-width="98px" :inline="true">
        <el-form-item label="所属中心代码">
          <hs-input size="mini" v-model="form.centerCode" placeholder="请输入所属中心代码" ></hs-input>
        </el-form-item>
        <el-form-item label="所属中心名称">
          <hs-input size="mini" v-model="form.centerName" placeholder="请输入所属中心名称" ></hs-input>
        </el-form-item>
        <el-form-item label="所属中心状态">
          <hs-input size="mini" v-model="form.centerName" placeholder="请输入所属中心状态" ></hs-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <hs-input size="mini" v-model="form.centerName" placeholder="请输入业务类型" ></hs-input>
        </el-form-item>
      </el-form>
    </template>
    <template>
      <!-- <hs-table :columnable="!1" :index="!0" :isCheckbox="!1" :data="tableData" :columns="columns" :loading="loading" @query="onQuery" :pagination.sync="pagination" :dicts="['schoolState']">
        <template slot="operator" slot-scope="{ scope }">
          <hs-button
          v-permission="['fcsCenterInfo']"
            @click.native.prevent="showDetail(scope.row)"
            type="text"
            size="small">
            详情
          </hs-button>
        </template>
      </hs-table> -->
    </template>
  </hs-frame>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import Form from '@/packages/form/main.vue'
import FormItem from '@/packages/form/item/main.vue'
import Radio from '@/packages/radio/main.vue'
import Button from '@/packages/button/main.vue'
import RadioGroup from '@/packages/radio/group/main.vue'
import RadioButton from '@/packages/radio/button/main.vue'
import Checkbox from '@/packages/checkbox/main.vue'
import CheckboxGroup from '@/packages/checkbox/group/main.vue'
import CheckboxButton from '@/packages/checkbox/button/main.vue'
import Row from '@/packages/layout/row/main.vue'
import Col from '@/packages/layout/col/main.vue'
import Switch from '@/packages/switch/main.vue'
import Input from '@/packages/input/main.vue'
import Inputnumber from '@/packages/inputnumber/main.vue'
import Transfer from '@/packages/transfer/main.vue'
import Select from '@/packages/select/main.vue'
import Cascader from '@/packages/cascader/main.vue'
import CascaderPanel from '@/packages/cascader/panel/main.vue'
import Slider from '@/packages/slider/main.vue'
import Rate from '@/packages/rate/main.vue'
// import HsTimepicker from '@/packages/datepicker/picker/time-picker.vue'
// import HsTimeSelect from '@/packages/datepicker/picker/time-select.vue'
import HsCollapse from '@/packages/collapse/main.vue'
import HsCollapseItem from '@/packages/collapse/item/main.vue'
import HsTooltip from '@/packages/tooltip/main.vue'
import HsTabs from '@/packages/tabs/main.vue'
import HsTabPane from '@/packages/tabs/pane/main.vue'
import emitter from '@/mixins/emitter'
import Migrating from '@/mixins/migrating'
import HsFrame from '@/packages/frame/main.vue'

@Component({
  name: 'hs-form-demo',
  mixins: [emitter, Migrating],
  components: {
    'hs-form': Form,
    'hs-form-item': FormItem,
    'hs-radio': Radio,
    'hs-radio-group': RadioGroup,
    'hs-radio-button': RadioButton,
    'hs-checkbox': Checkbox,
    'hs-checkbox-group': CheckboxGroup,
    'hs-checkbox-button': CheckboxButton,
    'hs-row': Row,
    'hs-col': Col,
    'hs-button': Button,
    'hs-switch': Switch,
    'hs-input': Input,
    'hs-input-number': Inputnumber,
    'hs-transfer': Transfer,
    'hs-select': Select,
    'hs-cascader': Cascader,
    'hs-cascader-panel': CascaderPanel,
    'hs-slider': Slider,
    'hs-rate': Rate,
    // 'hs-time-picker': HsTimepicker,
    // 'hs-time-select': HsTimeSelect,
    'hs-collapse': HsCollapse,
    'hs-collapse-item': HsCollapseItem,
    'hs-tooltip': HsTooltip,
    'hs-tabs': HsTabs,
    'hs-tab-pane': HsTabPane,
    'hs-frame': HsFrame
  }
})

export default class FormDemo extends Vue {
  private onQuery () {
    //
  }

  private onReset () {
    //
  }

  private form = {}

  private activetabName = 'second'
  private handleClick (tab: any, event: any) {
    console.log(tab, event)
  }

  private generateData = () => {
    const data = []
    for (let i = 1; i <= 15; i++) {
      data.push({
        key: i,
        label: `备选项 ${i}`,
        disabled: i % 4 === 0
      })
    }
    return data
  }

  private data = this.generateData()

  private value = [1, 4]

  private activeName = '1'

  private ruleForm = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: !0,
    action: [],
    resource: '',
    desc: '',
    num: 1
  }

  private rules = {
    name: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    region: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    date1: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
    date2: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
    ],
    action: [
      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
    ],
    resource: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    desc: [
      { required: true, message: '请填写活动形式', trigger: 'blur' }
    ]
  }

  private valueTime1 = new Date(2016, 9, 10, 18, 40)

  private valueTime2 = ''

  private valueTime3 = ''

  private options = [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }]

  private value1 = ''
  private valueDate1 = ''
  private value2 = ''
  private value3 = ''
  private value4 = ''

  private valueSlider1 = 0
  private valueSlider2 = 0
  private valueSlider3 = [4, 8]

  private pickerOptions = {
    disabledDate (time: any) {
      return time.getTime() > Date.now()
    },
    shortcuts: [{
      text: '今天',
      onClick (picker: any) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick (picker: any) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick (picker: any) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }

  private valueRate = null
  private iconClasses = ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3']

  private submitForm (formName: string) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm (formName: string) {
    (this.$refs[formName] as any).resetFields()
  }

  private handleChange (value: any) {
    console.log(value)
  }

  private optionsCascader = [{
    value: 'zhinan',
    label: '指南',
    children: [{
      value: 'shejiyuanze',
      label: '设计原则',
      children: [{
        value: 'yizhi',
        label: '一致'
      }, {
        value: 'fankui',
        label: '反馈'
      }, {
        value: 'xiaolv',
        label: '效率'
      }, {
        value: 'kekong',
        label: '可控'
      }]
    }, {
      value: 'daohang',
      label: '导航',
      children: [{
        value: 'cexiangdaohang',
        label: '侧向导航'
      }, {
        value: 'dingbudaohang',
        label: '顶部导航'
      }]
    }]
  }, {
    value: 'zujian',
    label: '组件',
    children: [{
      value: 'basic',
      label: 'Basic',
      children: [{
        value: 'layout',
        label: 'Layout 布局'
      }, {
        value: 'color',
        label: 'Color 色彩'
      }, {
        value: 'typography',
        label: 'Typography 字体'
      }, {
        value: 'icon',
        label: 'Icon 图标'
      }, {
        value: 'button',
        label: 'Button 按钮'
      }]
    }, {
      value: 'form',
      label: 'Form',
      children: [{
        value: 'radio',
        label: 'Radio 单选框'
      }, {
        value: 'checkbox',
        label: 'Checkbox 多选框'
      }, {
        value: 'input',
        label: 'Input 输入框'
      }, {
        value: 'input-number',
        label: 'InputNumber 计数器'
      }, {
        value: 'select',
        label: 'Select 选择器'
      }, {
        value: 'cascader',
        label: 'Cascader 级联选择器'
      }, {
        value: 'switch',
        label: 'Switch 开关'
      }, {
        value: 'slider',
        label: 'Slider 滑块'
      }, {
        value: 'time-picker',
        label: 'TimePicker 时间选择器'
      }, {
        value: 'date-picker',
        label: 'DatePicker 日期选择器'
      }, {
        value: 'datetime-picker',
        label: 'DateTimePicker 日期时间选择器'
      }, {
        value: 'upload',
        label: 'Upload 上传'
      }, {
        value: 'rate',
        label: 'Rate 评分'
      }, {
        value: 'form',
        label: 'Form 表单'
      }]
    }, {
      value: 'data',
      label: 'Data',
      children: [{
        value: 'table',
        label: 'Table 表格'
      }, {
        value: 'tag',
        label: 'Tag 标签'
      }, {
        value: 'progress',
        label: 'Progress 进度条'
      }, {
        value: 'tree',
        label: 'Tree 树形控件'
      }, {
        value: 'pagination',
        label: 'Pagination 分页'
      }, {
        value: 'badge',
        label: 'Badge 标记'
      }]
    }, {
      value: 'notice',
      label: 'Notice',
      children: [{
        value: 'alert',
        label: 'Alert 警告'
      }, {
        value: 'loading',
        label: 'Loading 加载'
      }, {
        value: 'message',
        label: 'Message 消息提示'
      }, {
        value: 'message-box',
        label: 'MessageBox 弹框'
      }, {
        value: 'notification',
        label: 'Notification 通知'
      }]
    }, {
      value: 'navigation',
      label: 'Navigation',
      children: [{
        value: 'menu',
        label: 'NavMenu 导航菜单'
      }, {
        value: 'tabs',
        label: 'Tabs 标签页'
      }, {
        value: 'breadcrumb',
        label: 'Breadcrumb 面包屑'
      }, {
        value: 'dropdown',
        label: 'Dropdown 下拉菜单'
      }, {
        value: 'steps',
        label: 'Steps 步骤条'
      }]
    }, {
      value: 'others',
      label: 'Others',
      children: [{
        value: 'dialog',
        label: 'Dialog 对话框'
      }, {
        value: 'tooltip',
        label: 'Tooltip 文字提示'
      }, {
        value: 'popover',
        label: 'Popover 弹出框'
      }, {
        value: 'card',
        label: 'Card 卡片'
      }, {
        value: 'carousel',
        label: 'Carousel 走马灯'
      }, {
        value: 'collapse',
        label: 'Collapse 折叠面板'
      }]
    }]
  }, {
    value: 'ziyuan',
    label: '资源',
    children: [{
      value: 'axure',
      label: 'Axure Components'
    }, {
      value: 'sketch',
      label: 'Sketch Templates'
    }, {
      value: 'jiaohu',
      label: '组件交互文档'
    }]
  }]
}
</script>

<style>
.demo{
  min-height:36px;
  width: 100%;
  background-color: #e5e9f2;
  border-radius: 6px;
}
.hs-row{
  margin-bottom: 20px;
}
</style>
