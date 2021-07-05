<template>
  <div style="width:100%;height:100px;overflow:auto;">
    <span>我</span>
    <hs-divider direction="vertical"></hs-divider>
    <span>你</span>
    <hs-divider content-position="left">说明</hs-divider>
    <hs-divider content-position="right">好的</hs-divider>
    <hs-divider direction="vertical"><i class="el-icon-picture-outline"></i></hs-divider>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Divider from '@/packages/divider/main.vue'

@Component({
  name: 'hs-divider-demo',
  components: {
    'hs-divider': Divider
  }
})

export default class DrawerDemo extends Vue {
  private urls = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jwpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
  ]

  private srcList = [
    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
  ]
}
</script>

<style lang="scss">
.slot-error{
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  background-color: #d9d9d9;
  align-items: center;
}
</style>
