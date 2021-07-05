<template>
  <div>
    <hs-plupload
        custom="card"
        url="https://daili.liexue.cn/api/core/oss/file/fileUploadPost"
        :multi-selection="true"
        :FilesAdded="filesAdded"
        :headers="{ token: token, accept: 'application/json' }"
        :multipart-params="{'parentFolder': 'lb/schoolDetail'}"
        @inputUploader="inputUploader"
        @afterProgressOpera="afterProgressOpera"
      />
      <hs-dialog title="正在上传" :visible.sync="dialogTableVisible">
        <hs-progress v-if="files.length>0" :text-inside="true" :stroke-width="20" :percentage="files[0].percent"></hs-progress>
      </hs-dialog>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import HsPlupload from '@/packages/plupload/main.vue'
import HsProgress from '@/packages/progress/main.vue'
import HsDialog from '@/packages/dialog/main.vue'

@Component({
  name: 'hs-plupload-demo',
  components: {
    'hs-plupload': HsPlupload,
    'hs-progress': HsProgress,
    'hs-dialog': HsDialog
  }
})
export default class PluploadDemo extends Vue {
  private serverConfig = {
    url: ''
  }

  private files = []
  private up: any = {}
  private dialogTableVisible = !1
  get status () {
    const files = this.files.length > 0 ? this.files[0] : null
    return files ? (files as any).status : null
  }

  @Watch('status')
  private changeStatus () {
    if (this.status === 5) {
      this.$confirm('文件上传成功', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.dialogTableVisible = false
      })
    }
  }

  private filesAdded (up: any, files: any) {
    // if (up.files.length > 1) {
    //   up.removeFile(up.files[0])
    // }
  }

  private inputUploader (up: any) {
    this.up = up
    this.files = up.files
  }

  private afterProgressOpera (status: string) {
    this.dialogTableVisible = status === 'stop'
    this.up.start()
  }
}
</script>

<style lang="scss">
.drag{
  border: 1px solid #ccc;
  height: 150px;
  line-height: 150px;
  text-align: center;
  color: #aaa;
  width: 600px;
  margin: 10px auto;
}
</style>
