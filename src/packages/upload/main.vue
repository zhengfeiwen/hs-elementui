<template>
  <div class="hs-upload">
    <el-upload
      :class="uclass"
      ref="upload"
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :data="data"
      :name="name"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :on-progress="onProgress"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :list-type="listType"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :http-request="httpRequest"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="onExceed"
    >
      <hs-button
        size="small"
        v-if="!!submitBtnTxt"
        @click="beforeSubmit"
        type="primary"
        :class="submitBtnClass"
        >{{ submitBtnTxt }}</hs-button
      >
      <hs-button
        :style="uploadBtnClass"
        size="small"
        type="success"
        v-if="!!uploadBtnTxt"
        @click="submitUpload"
        >{{ uploadBtnTxt }}</hs-button
      >
      <div v-if="showShort" slot="file" slot-scope="{ file }">
        <img class="hs-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="hs-upload-list__item-actions">
          <span
            class="hs-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="hs-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="hs-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="hs-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="hs-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="hs-icon-delete"></i>
          </span>
        </span>
      </div>
      <slot name="ext"></slot>
    </el-upload>
    <slot name="trigger"></slot>
    <slot name="tip"></slot>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
  </div>
</template>

<script lang='ts'>
import { ElUpload } from 'element-ui/types/upload'
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'

@Component({
  name: 'hs-upload'
})
export default class HsUpload extends Vue {
  @Ref('upload')
  public upload!: ElUpload;

  // 必选参数，上传的地址
  @Prop({ type: String, required: true })
  public action!: string;

  // 上传按钮文本
  @Prop({ type: String })
  public submitBtnTxt!: string;

  // 上传按钮样式
  @Prop({ type: String })
  public submitBtnClass!: string;

  // 上传服务器按钮文本
  @Prop({ type: String })
  public uploadBtnTxt!: string;

  // 上传服务器按钮样式
  @Prop({ type: String })
  public uploadBtnClass!: string;

  // 设置上传的请求头部
  @Prop({ type: Object })
  public headers!: object;

  // 设置样式
  @Prop({ type: String })
  public uclass!: string;

  // 是否支持多选文件
  @Prop({ type: Boolean })
  public multiple!: boolean;

  // 是否显示缩略图
  @Prop({ type: Boolean, default: false })
  public 'show-short'!: boolean;

  // 上传时附带的额外参数
  @Prop({ type: Object })
  public data!: object;

  // 上传的文件字段名
  @Prop({ type: String, default: 'file' })
  public name!: string;

  // 支持发送 cookie 凭证信息
  @Prop({ type: Boolean, default: false })
  public 'with-credentials'!: boolean;

  // 是否显示已上传文件列表
  @Prop({ type: Boolean, default: true })
  public 'show-file-list'!: boolean;

  // 是否启用拖拽上传
  @Prop({ type: Boolean, default: false })
  public drag!: boolean;

  // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
  @Prop({ type: String })
  public accept!: string;

  // 点击文件列表中已上传的文件时的钩子
  @Prop({ type: Function })
  public 'on-preview'!: () => void;

  // 文件列表移除文件时的钩子
  @Prop({ type: Function })
  public 'on-remove'!: () => void;

  // 文件上传成功时的钩子
  @Prop({ type: Function })
  public 'on-success'!: () => void;

  // 文件上传失败时的钩子
  @Prop({ type: Function })
  public 'on-error'!: () => void;

  // 文件上传时的钩子
  @Prop({ type: Function })
  public 'on-progress'!: () => void;

  // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
  @Prop({ type: Function })
  public 'on-change'!: () => void;

  // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
  @Prop({ type: Function })
  public 'before-upload'!: () => void;

  // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
  @Prop({ type: Function })
  public 'before-remove'!: () => void;

  // 文件列表的类型
  @Prop({ type: String, default: 'text' })
  public listType!: string;

  // 是否在选取文件后立即进行上传
  @Prop({ type: Boolean, default: true })
  public 'auto-upload'!: boolean;

  // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
  @Prop({ type: Array, default: () => [] })
  public 'file-list'!: object[];

  // 覆盖默认的上传行为，可以自定义上传的实现
  @Prop({ type: Function })
  public 'http-request'!: () => void;

  // 是否禁用
  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;

  // 最大允许上传个数
  @Prop({ type: Number })
  public limit!: number;

  // 文件超出个数限制时的钩子
  @Prop({ type: Function })
  public 'on-exceed'!: () => void;

  public dialogImageUrl = '';
  public dialogVisible = false;
  // 清空已上传的文件列表（该方法不支持在 before-upload 中调用）
  public clearFiles () {
    if (this.$listeners.clearFiles) {
      this.$emit('clearFiles')
    }
  }

  // 取消上传请求
  public abort (file: any) {
    if (this.$listeners.abort) {
      this.$emit('abort', file)
    }
  }

  // 手动上传文件列表
  public submit () {
    this.submitUpload()
  }

  // 移除图片
  public handleRemove (file: any, fileList: any) {
    console.log(file, fileList)
  }

  // 预览图片
  public handlePictureCardPreview (file: any) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }

  // 上传文件之前
  public beforeSubmit () {
    if (this.$listeners.beforeSubmit) {
      this.$emit('beforeSubmit', this['file-list'])
    }
  }

  // 上传到服务器
  public submitUpload () {
    (this.$refs.upload as ElUpload).submit()
  }
}
</script>
<style scoped>
@import "./main.css";
</style>
