<template>
  <div :class="coverlapClass">
    <div :class="coverlapHomeClass">
      <slot></slot>
    </div>
    <div :class="coverlapPageClass" v-if="coverlap">
      <div class="hs-coverlap_header_back">
        <hs-button type="info" plain size="mini" @click="back">返回</hs-button>
      </div>
      <slot name="coverlap"></slot>
  </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'hs-coverlap'
})
export default class HsCoverlap extends Vue {
  @Prop({ type: String })
  private coverClass!: string

  private coverlap = !1

  private back () {
    this.coverlap = !1
    this.$listeners.callback && this.$emit('callback')
  }

  get coverlapClass () {
    return {
      'hs-coverlap-container': !0,
      [this.coverClass]: this.coverClass
    }
  }

  get coverlapHomeClass () {
    return {
      'hs-coverlap_home': !0,
      shown: !this.coverlap
    }
  }

  get coverlapPageClass () {
    return {
      'hs-coverlap_page': !0,
      shown: this.coverlap
    }
  }

  public cover (flag: boolean) {
    if (this.$listeners['before-open']) {
      this.$emit('before-open', () => {
        this.coverlap = flag
      })
    } else {
      this.coverlap = flag
    }
  }

  mounted () {
    const cBtn = document.getElementById('coverlap-btn')
    if (cBtn) {
      cBtn.addEventListener('click', () => {
        console.log(this.coverlap, 'this.coverlap')
        this.cover(!0)
      })
    }
  }
}
</script>
<style lang="scss">
@import 'main.scss';
</style>
