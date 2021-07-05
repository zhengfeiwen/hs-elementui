<template>
  <div style="width:100%;height:100%;margin:60px;">
     <!-- <hs-progress-demo></hs-progress-demo>
    <hs-upload-demo></hs-upload-demo>
    <hs-tabs-demo></hs-tabs-demo>
    <hs-button-demo></hs-button-demo>
    <hs-shortstroy-demo></hs-shortstroy-demo>
    <hs-tinymce-demo></hs-tinymce-demo>
    <hs-image-demo></hs-image-demo>
    <hs-divider-demo></hs-divider-demo>
    <hs-shortstroy-demo></hs-shortstroy-demo>
    <hs-drawer-demo></hs-drawer-demo>
    <hs-card-demo></hs-card-demo>
    <hs-actionline-demo></hs-actionline-demo>
    <hs-datepicker-demo></hs-datepicker-demo>
    <hs-querycondition-demo></hs-querycondition-demo>
    <hs-calender-demo></hs-calender-demo>
    <hs-tag-demo></hs-tag-demo>
    <hs-container-demo></hs-container-demo>
    <hs-form-demo></hs-form-demo>
    <hs-checkbox-demo></hs-checkbox-demo>
     <hs-plupload-demo></hs-plupload-demo>
    <hs-form-demo></hs-form-demo>
     <hs-form-demo></hs-form-demo>
    <hs-checkbox-demo></hs-checkbox-demo>
    <hs-chart-demo></hs-chart-demo>
    <hs-table-demo></hs-table-demo> -->
    <hs-table-demo></hs-table-demo>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
// import ProgressDemo from './examples/components/progress/index.vue'
// import UploadDemo from './examples/components/upload/index.vue'
// import PluploadDemo from './examples/components/plupload/index.vue'
// import TabsDemo from './examples/components/navigation/index.vue'
// import ButtonDemo from './examples/components/button/index.vue'
// import ShortstoryDemo from './examples/busifunc/shortstory/index.vue'
// import TinymceEditorDemo from './examples/components/tiny/index.vue'
// import ImageDemo from './examples/components/image/index.vue'
// import DividerDemo from './examples/components/divider/index.vue'
// import DrawerDemo from './examples/components/drawer/index.vue'
// import CardDemo from './examples/components/card/index.vue'
// import Actionline from './examples/busifunc/actionline/index.vue'
// import Querycondition from './examples/busifunc/querycondition/index.vue'
// import Datepicker from './examples/components/datepicker/index.vue'
// import Calender from './examples/components/calender/index.vue'
// import Layout from './examples/components/layout/index.vue'
import Table from './examples/components/table/index.vue'
// import { TextOverflow } from '@/utils/commons'
// import LinkDemo from './examples/components/link/index.vue'
// import RadioDemo from './examples/components/radio/index.vue'
// import ContainerDemo from './examples/components/container/index.vue'
// import TagDemo from './examples/components/tag/index.vue'
// import CheckboxDemo from './examples/components/checkbox/index.vue'
// import EchartDemo from './examples/echart/index.vue'
// import DraggableDemo from './examples/components/draggable/index.vue'
// import FormDemo from './examples/components/form/index.vue'
import FormDemo from './examples/components/form/index.vue'
@Component({
  components: {
    // 'hs-progress-demo': ProgressDemo,
    // 'hs-upload-demo': UploadDemo,
    // 'hs-plupload-demo': PluploadDemo,
    // 'hs-tabs-demo': TabsDemo,
    // 'hs-button-demo': ButtonDemo,
    // 'hs-container-demo': ContainerDemo,
    // 'hs-checkbox-demo': CheckboxDemo,
    // 'hs-shortstroy-demo': ShortstoryDemo,
    // 'hs-tinymce-demo': TinymceEditorDemo,
    // 'hs-image-demo': ImageDemo,
    // 'hs-divider-demo': DividerDemo,
    // 'hs-drawer-demo': DrawerDemo,
    // 'hs-card-demo': CardDemo,
    // 'hs-actionline-demo': Actionline,
    // 'hs-datepicker-demo': Datepicker,
    // 'hs-calender-demo': Calender,
    // 'hs-querycondition-demo': Querycondition,
    // 'hs-layout-demo': Layout,
    // 'hs-link-demo': LinkDemo,
    // 'hs-radio-demo': RadioDemo,
    'hs-form-demo': FormDemo,
    'hs-table-demo': Table
    // 'hs-tag-demo': TagDemo,
    // 'hs-chart-demo': EchartDemo,
    // 'hs-draggable-demo': DraggableDemo
  }
})
export default class App extends Vue {
}
</script>

<style lang='scss'>
@import "../src/styles/hs/container.scss";
.hs-header, .hs-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .hs-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .hs-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .hs-container {
    margin-bottom: 40px;
  }

  .hs-container:nth-child(5) .hs-aside,
  .hs-container:nth-child(6) .hs-aside {
    line-height: 260px;
  }

  .hs-container:nth-child(7) .hs-aside {
    line-height: 320px;
  }
</style>
