<template>
  <div class="childer-item">
    <div class="childer-info">{{author}} <span>{{date}}</span></div>
    <div class="childer-content">{{content}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'hs-reply-childer',
  components: {
  }
})
export default class HsReplyChilder extends Vue {
  @Prop({ type: String })
  public author!: string

  @Prop({ type: String })
  public date!: string

  @Prop({ type: String })
  public content!: string
}
</script>

<style lang='scss' scope>
.childer-item{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 6px;
    padding-right: 0;
    border-top: 1px solid #e6e6e6;
    .childer-info{
      font-size:16px;
      margin-bottom: 3px;
      span{
        float: right;
      }
    }
    .childer-content{
      font-size: 14px;
      color: #444;
      padding-left: 12px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
  }
</style>
