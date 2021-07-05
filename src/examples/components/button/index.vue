<template>
  <div>
     <!-- <el-row>
      <hs-button type="primary" @click="click" plain>主要按钮</hs-button>
      <hs-button type="success" plain>主要按钮</hs-button>
      <hs-button type="info" plain>主要按钮</hs-button>
      <hs-button type="warning" plain>主要按钮</hs-button>
      <hs-button type="danger" plain round>主要按钮</hs-button>
      <hs-button type="warning" plain circle icon="hs-icon-edit" ></hs-button>
    </el-row>
    <el-row>
      <hs-button disabled>默认按钮</hs-button>
      <hs-button type="primary" disabled>主要按钮</hs-button>
      <hs-button type="success" disabled>成功按钮</hs-button>
      <hs-button type="info" disabled>信息按钮</hs-button>
      <hs-button type="warning" disabled>警告按钮</hs-button>
      <hs-button type="danger" disabled>危险按钮</hs-button>
    </el-row>

      <el-row>
        <hs-button plain disabled @click="click">朴素按钮</hs-button>
        <hs-button type="primary" plain disabled>主要按钮</hs-button>
        <hs-button type="success" plain disabled>成功按钮</hs-button>
        <hs-button type="info" plain disabled>信息按钮</hs-button>
        <hs-button type="warning" plain disabled>警告按钮</hs-button>
        <hs-button type="danger" plain disabled>危险按钮</hs-button>
      </el-row> -->
       <hs-button-group>
        <hs-button icon="el-icon-minus" @click="decrease"></hs-button>
        <hs-button icon="el-icon-plus" @click="increase"></hs-button>
      </hs-button-group>
    <hs-button type="text">文字按钮</hs-button>
    <hs-button type="text" disabled>文字按钮</hs-button>
    <hs-button type="primary" icon="el-icon-edit"></hs-button>
    <hs-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></hs-button>
    <hs-button-group>
      <hs-button type="primary" icon="el-icon-arrow-left">上一页</hs-button>
      <hs-button type="primary" icon="el-icon-arrow-left">上一页</hs-button>
      <hs-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></hs-button>
    </hs-button-group>
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete"></el-button>
    </el-button-group>
    <hs-button type="primary" :loading="true">加载中</hs-button>
    <!-- <hs-svgicon name='cir-edit'></hs-svgicon>
    <hs-logobutton
      flexStyle="horizontal"
      :buttons="buttons"
      @handleClick="handleClick"
    >
    </hs-logobutton> -->
    <el-row>
      <hs-button>默认按钮</hs-button>
      <hs-button size="medium">中等按钮</hs-button>
      <hs-button size="small">小型按钮</hs-button>
      <hs-button size="mini">超小按钮</hs-button>
    </el-row>
    <el-row>
      <hs-button icon="hs-icon-search" circle></hs-button>
      <hs-button type="primary" icon="hs-icon-edit" circle></hs-button>
      <hs-button type="success" icon="hs-icon-check" circle></hs-button>
      <hs-button type="info" icon="hs-icon-message" circle></hs-button>
      <hs-button type="warning" icon="hs-icon-star-off" circle></hs-button>
      <hs-button type="danger" icon="hs-icon-delete" circle></hs-button>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Logobutton from '@/packages/button/logobutton/main.vue'
import Svgicon from '@/packages/svgicon/main.vue'
import Button from '@/packages/button/main.vue'
import ButtonGroup from '@/packages/button/group/main.vue'

@Component({
  name: 'hs-progress-demo',
  components: {
    'hs-button': Button,
    'hs-button-group': ButtonGroup,
    'hs-logobutton': Logobutton,
    'hs-svgicon': Svgicon
  }
})

export default class ButtonDemo extends Vue {
  private buttons = [
    {
      id: 'live',
      title: 'Live',
      color: 'yellow',
      icon: 'cir-book'
    },
    {
      title: '书店',
      icon: 'edit',
      color: 'green'
    },
    {
      title: '圆桌',
      icon: 'org',
      color: 'lightbule'
    }
  ];

  public tabChange (id: string) {
    alert()
  }

  private handleClick (key: string) {
    alert(key)
  }

  private click () {
    alert(1)
  }
}
</script>

<style>

</style>
