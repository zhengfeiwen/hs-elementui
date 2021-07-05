<template>
  <div class="upload-container">
    <hs-button
      :style="{background: color, borderColor: color}"
      icon="hs-icon-upload"
      size="mini"
      type="primary"
      @click=" dialogVisible=true"
    >
      upload
    </hs-button>
    <hs-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <hs-upload
        :multiple="true"
        :file-list="defaultFileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <hs-button
          size="small"
          type="primary"
        >
          Click upload
        </hs-button>
      </hs-upload>
      <hs-button @click="dialogVisible = false">
        Cancel
      </hs-button>
      <hs-button
        type="primary"
        @click="handleSubmit"
      >
        Confirm
      </hs-button>
    </hs-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import HsButton from '@/packages/button/main.vue'
import HsDialog from '@/packages/dialog/main.vue'
import HsUpload from '@/packages/upload/main.vue'

export interface IUploadObject {
  hasSuccess: boolean
  uid: number
  url: string
  width: number
  height: number
}

@Component({
  name: 'EditorImageUpload',
  components: {
    'hs-button': HsButton,
    'hs-dialog': HsDialog,
    'hs-upload': HsUpload
  }
})
export default class extends Vue {
  @Prop({ required: true }) private color!: string

  private dialogVisible = false
  private listObj: { [key: string]: IUploadObject } = {}
  private defaultFileList = []

  private checkAllSuccess () {
    return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
  }

  private handleSubmit () {
    const arr = Object.keys(this.listObj).map(v => this.listObj[v])
    if (!this.checkAllSuccess()) {
      this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
      return
    }
    this.$emit('success-callback', arr)
    this.listObj = {}
    this.defaultFileList = []
    this.dialogVisible = false
  }

  private handleSuccess (response: any, file: any) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        this.listObj[objKeyArr[i]].url = response.files.file
        this.listObj[objKeyArr[i]].hasSuccess = true
        return
      }
    }
  }

  private handleRemove (file: any) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        delete this.listObj[objKeyArr[i]]
        return
      }
    }
  }

  private beforeUpload (file: any) {
    const fileName = file.uid
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onload = () => {
      this.listObj[fileName] = {
        hasSuccess: false,
        uid: file.uid,
        url: '',
        width: img.width,
        height: img.height
      }
    }
  }
}
</script>

<style lang="scss">
.editor-slide-upload {
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
</style>
