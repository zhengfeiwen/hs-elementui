<template>
  <div>
    <hs-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      submitBtnTxt="点击上传"
      submitBtnClass="primary"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </hs-upload>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import HsUpload from '@/packages/upload/main.vue'

@Component({
  name: 'hs-upload-demo',
  components: {
    'hs-upload': HsUpload
  }
})
export default class UploadDemo extends Vue {
  public showShort = true
  public autoUpload = false
  public isShow = true
  public fileList: object[] = [
    {
      name: 'food.jpeg',
      url:
        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    },
    {
      name: 'food2.jpeg',
      url:
        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
    }
  ]

  public handlePreview (file: any) {
    console.log(file)
  }

  public handleExceed (files: any, fileList: any) {
    console.log(files)
  }

  public beforeRemove (file: any, fileList: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  public handleRemove (file: any, fileList: any) {
    console.log(file, fileList)
  }

  public submitUpload () {
    (this.$refs.uploads as HsUpload).submit()
  }
}
</script>

<style>
</style>
