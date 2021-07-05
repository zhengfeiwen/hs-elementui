<template>
  <hs-querycondition
    :conditions="conditions"
    @change="change"
    :form.sync="form"
  ></hs-querycondition>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Querycondition from '@/packages/busifunc/querycondition/main.vue'

@Component({
  name: 'hs-querycondition-demo',
  components: {
    'hs-querycondition': Querycondition
  }
})

export default class DrawerDemo extends Vue {
  private form = {
    edu: {},
    date: '',
    stuName: '1',
    studyType: '1'
  }

  private conditions: any = {
    studyType: {
      type: 'select',
      labels: ['学习类别', '学习类别2'],
      data: [{
        label: '全日制',
        value: '1'
      },
      {
        label: '非全日制',
        value: '2'
      }
      ]
    },
    stuName: {
      type: 'input',
      label: '学生姓名'
    },
    edu: {
      type: 'cascader',
      labels: ['录入时间', '回访时间', '指派时间'],
      options: [
        {
          value: 'zsxt',
          label: '招生系统',
          children: [
            {
              value: 'kfbm',
              label: '客服部门'
            }, {
              value: 'qrzxm',
              label: '全日制项目'
            }
          ]
        }
      ]
    },
    date: {
      type: 'datepicker',
      labels: ['录入时间', '回访时间', '指派时间'],
      placeholder: '请输入',
      option: {
        type: 'datetimerange'
      }
    }
  }

  private change (data: any, key: string, labels: any) {
    // do someing
    if (!key) return
    alert(key + '|' + data[key] + '|' + (labels[key] ? labels[key] : ''))
    this.conditions[key].options = [
      {
        value: 'zsxt',
        name: '招生系统11111',
        childrenList: [
          {
            value: 'kfbm',
            name: '客服部门1111'
          }, {
            value: 'qrzxm',
            name: '全日制项目'
          }
        ]
      }
    ]
  }
}
</script>

<style lang="scss">
</style>
