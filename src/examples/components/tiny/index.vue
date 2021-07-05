<template>
  <div>
    <hs-tnymce :value="value" ref="editor" menubar="" @input="value = $event"></hs-tnymce>
    <el-button @click="click">dssada</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tinymce from '@/packages/tinymce/main.vue'

@Component({
  name: 'hs-tinymce-demo',
  components: {
    'hs-tnymce': Tinymce
  }
})
export default class extends Vue {
  private value = 'zfw'
  private click () {
    const msg = (this.$refs.editor as Tinymce).tinymceContent
    alert(msg)
  }
}
</script>
