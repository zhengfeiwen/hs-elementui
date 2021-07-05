<template>
  <hs-card v-if="custom === 'card'" :class="'hs-plupload' + extClass" shadow="hover">
    <div class="hs-plupload_main" id="hs-plupload_main">
      <div class="hs-plupload_btn">
        <svg-icon name="upload" id="plupload_sel"/>
      </div>
      <div class="hs-plupload_progress">
        <div class="progress_title">
          <span>{{progressPercentage.percent}}</span>
          <span>{{progressPercentage.status}}</span>
        </div>
        <hs-progress :percentage="progressPercentage.percent" :color="'#fff'" :show-text="!1"></hs-progress>
      </div>
      <div class="hs-plupload_opera">
        <svg-icon :name="progress.plupload_opera" @click="progressOp"/>
      </div>
    </div>
    <div class="hs-plupload_ext" @click="extClick">
      <div class="ani" title="详细信息"><i :class="extIClass"/></div>
    </div>
    <p class="hs-plupload_detail_title">详细信息</p>
    <div class="hs-plupload_detail">
      <div class="hs-plupload_detail_item" v-for="(file, i) in files" :key="i">
        <div>{{file.name}}</div>
        <div>{{file.percent}}%</div>
      </div>
    </div>
  </hs-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import plupload from 'plupload'
import { prop, preInitMethod } from './types'
import HsCard from '@/packages/card/main.vue'
import HsProgress from '@/packages/progress/main.vue'
@Component({
  name: 'hs-plupload',
  components: {
    'hs-card': HsCard,
    'hs-progress': HsProgress
  }
})
export default class Plupload extends Vue {
  @Prop({ type: String })
  private browseButton!: string

  @Prop({ type: String })
  private custom!: string

  @Prop({ type: String })
  private container!: string

  @Prop({ type: String })
  private url!: string

  @Prop({ type: Object })
  private filters!: object

  @Prop({ type: Object })
  private headers!: object

  @Prop({ type: Object })
  private multipartParams!: object

  @Prop({ type: Object })
  private resize!: object

  @Prop({ type: String })
  private dropElement!: string

  @Prop({ type: String })
  private requiredFeatures!: string

  @Prop({ type: String, default: 'html5,flash,silverlight,html4' })
  private runtimes!: string

  @Prop({ type: String, default: '0' })
  private chunkSize!: string

  @Prop({ type: Boolean, default: !0 })
  private multipart!: boolean

  @Prop({ type: Number, default: 0 })
  private maxRetries!: number

  @Prop({ type: Boolean, default: !0 })
  private multiSelection!: boolean

  @Prop({ type: Boolean, default: !1 })
  private uniqueNames!: boolean

  @Prop({ type: String, default: 'file' })
  private fileDataName!: string

  @Prop({ type: String, default: 'plupload/js/Moxie.swf' })
  private flashSwfUrl!: string

  @Prop({ type: String, default: 'plupload/js/Moxie.xap' })
  private silverlightXapUrl!: string

  @Prop({ type: Function })
  private Init!: Function

  @Prop({ type: Function })
  private PostInit!: Function

  @Prop({ type: Function })
  private Browse!: Function

  @Prop({ type: Function })
  private OptionChanged!: Function

  @Prop({ type: Function })
  private Refresh!: Function

  @Prop({ type: Function })
  private StateChanged!: Function

  @Prop({ type: Function })
  private UploadFile!: Function

  @Prop({ type: Function })
  private BeforeUpload!: Function

  @Prop({ type: Function })
  private QueueChanged!: Function

  @Prop({ type: Function })
  private UploadProgress!: Function

  @Prop({ type: Function })
  private FilesRemoved!: Function

  @Prop({ type: Function })
  private FileFiltered!: Function

  @Prop({ type: Function })
  private FilesAdded!: Function

  @Prop({ type: Function })
  private FileUploaded!: Function

  @Prop({ type: Function })
  private ChunkUploaded!: Function

  @Prop({ type: Function })
  private UploadComplete!: Function

  @Prop({ type: Function })
  private Error!: Function

  @Prop({ type: Function })
  private Destroy!: Function

  public up!: any

  private files = []

  get progressPercentage () {
    const len = this.files.length
    let res = {
      percent: 0,
      status: ''
    }
    if (len === 1) {
      res = {
        percent: (this.files[0] as any).percent,
        status: ''
      }
    } else if (len > 1) {
      let finished = 0
      this.files.forEach((val) => {
        if ((val as any).percent >= 100) {
          finished++
        }
      })
      res.percent = (finished / len) * 100
      res.status = res.percent < 0 ? '下载中' : res.percent >= 100 ? '完成' : ''
    }
    if (res.percent >= 100) {
      this.extIClass = 'hs-icon-d-arrow-right'
    }
    return res
  }

  get status () {
    const files = this.files.length > 0 ? this.files[0] : null
    return files ? (files as any).status : null
  }

  private progress = {
    percentage: 10,
    status: 'Uploading...',
    num: 10,
    plupload_opera: 'start'
  }

  private extClass = ''

  private extIClass = 'hs-icon-d-arrow-right'

  private extClick () {
    if (this.extIClass.includes('left')) {
      this.extIClass = 'hs-icon-d-arrow-right'
      this.extClass = ''
    } else {
      this.extIClass = 'hs-icon-d-arrow-left'
      this.extClass = ' ext'
    }
  }

  private progressOp () {
    this.$emit('beforeProgressOpera', this.progress.plupload_opera)
    if (!this.files || this.files.length < 1) {
      this.$message('请添加文件')
      return
    }
    if (this.progress.plupload_opera === 'start') {
      this.progress.plupload_opera = 'stop'
      this.up.start()
    } else {
      this.progress.plupload_opera = 'start'
      this.up.stop()
    }
    this.$emit('afterProgressOpera', this.progress.plupload_opera)
  }

  @Watch('up', { deep: !0 })
  private changeUp (val: any, nVal: any) {
    if (this.up) {
      this.files = this.up.files
      this.$emit('inputUploader', this.up)
    }
  }

  @Watch('files', { deep: !0 })
  private changeFiles (val: any, nVal: any) {
    this.progress.plupload_opera = 'start'
  }

  private init () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const preInitMethod: preInitMethod = {
      Init (up: any, info: any) {
        that.Init && that.Init(up, info)
      },
      UploadFile (up: any, file: any) {
        that.UploadFile && that.UploadFile(up, file)
      }
    }
    const initMethod = {
      PostInit () {
        that.PostInit && that.PostInit()
      },
      Browse (up: any) {
        that.Browse && that.Browse(up)
      },
      OptionChanged (up: any, name: any, value: any, oldValue: any) {
        that.OptionChanged && that.OptionChanged(up, name, value, oldValue)
      },
      Refresh (up: any) {
        that.Refresh && that.Refresh(up)
      },
      StateChanged (up: any) {
        that.StateChanged && that.StateChanged(up)
      },
      BeforeUpload (up: any, file: any) {
        that.BeforeUpload && that.BeforeUpload(up, file)
      },
      QueueChanged (up: any) {
        that.QueueChanged && that.QueueChanged(up)
      },
      UploadProgress (up: any, file: any) {
        that.UploadProgress && that.UploadProgress(up, file)
      },
      FilesRemoved (up: any, files: any) {
        that.FilesRemoved && that.FilesRemoved(up, files)
      },
      FileFiltered (up: any, file: any) {
        that.FileFiltered && that.FileFiltered(up, file)
      },
      FilesAdded (up: any, files: any) {
        that.FilesAdded && that.FilesAdded(up, files)
      },
      FileUploaded (up: any, file: any, info: any) {
        that.FileUploaded && that.FileUploaded(up, file, info)
      },
      ChunkUploaded (up: any, file: any, info: any) {
        that.ChunkUploaded && that.ChunkUploaded(up, file, info)
      },
      UploadComplete (up: any, files: any) {
        that.UploadComplete && that.UploadComplete(up, files)
      },
      Error (up: any, args: any) {
        that.Error && that.Error(up, args)
      },
      Destroy (up: any) {
        that.Destroy && that.Destroy(up)
      }
    }
    const prop:prop = {
      runtimes: this.runtimes,
      browse_button: this.browseButton,
      container: this.container,
      url: this.url,
      chunk_size: this.chunkSize,
      headers: this.headers,
      multipart: this.multipart,
      max_retries: this.maxRetries,
      multi_selection: this.multiSelection,
      unique_names: this.uniqueNames,
      file_data_name: this.fileDataName,
      flash_swf_url: this.flashSwfUrl,
      silverlight_xap_url: this.silverlightXapUrl,
      preinit: preInitMethod,
      init: initMethod
    }
    if (this.dropElement != null) {
      prop.drop_element = this.dropElement
    }
    if (this.custom === 'card') {
      prop.browse_button = 'plupload_sel'
      prop.drop_element = 'hs-plupload_main'
    }
    if (this.filters != null) {
      prop.filters = this.filters
    }
    if (this.multipartParams != null) {
      prop.multipart_params = this.multipartParams
    }
    if (this.resize != null) {
      prop.resize = this.resize
    }
    if (this.requiredFeatures != null) {
      prop.required_features = this.requiredFeatures
    }
    const uploader = new plupload.Uploader(prop)
    uploader.init()
    this.up = uploader
    this.files = this.up.files
    this.$emit('inputUploader', this.up)
  }

  private mounted () {
    this.init()
    if (this.dropElement) {
      document.addEventListener('dragleave', function (e) {
        e.preventDefault()
      }, !1)
      document.addEventListener('drop', function (e) {
        e.preventDefault()
      }, !1)
      document.addEventListener('dragenter', function (e) {
        e.preventDefault()
      }, !1)
      document.addEventListener('dragover', function (e) {
        e.preventDefault()
      }, !1)
    }
  }
}
</script>
<style lang="scss">
@import './main.scss'
</style>
