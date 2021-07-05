<template>
  <div class="item">
    <div class="info">{{author}} <span>{{date}}</span></div>
    <div class="content">{{content}}</div>
    <div class="actions">
      <span @click="handlegood"><svg-icon name="good"></svg-icon>{{clicknumber}}</span>
      <span @click="changeReply"><svg-icon name="link"></svg-icon>回复</span>
    </div>
    <div :class="reply">
      <input placeholder="输入回复" type="text" v-model="replyTxt">
      <el-button size="mini" type="primary" plain @click="handlereply">回复</el-button>
    </div>
    <div class="childer">
      <hs-reply-childer v-for="(item,i) in replyChilder" :key="i"
        :author="item.author||item.createName"
        :date="item.date||formatDate(item.createTime)"
        :content="item.content"
      ></hs-reply-childer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ReplyChilder from './childer.vue'

@Component({
  name: 'hs-reply-child',
  components: {
    'hs-reply-childer': ReplyChilder
  }
})
export default class HsReplyChild extends Vue {
  @Prop({ type: String })
  public author!: string

  @Prop({ type: String })
  public date!: string

  @Prop({ type: String })
  public content!: string

  @Prop({ type: Number })
  public clickNumber!: number

  @Prop({ type: Array })
  public replyChilder!: object[]

  @Prop({ type: Number })
  public id!: number

  @Prop({ type: Boolean, default: false })
  public good!: boolean

  private reply = {
    reply: true,
    active: false
  }

  private clicknumber = this.clickNumber

  private isGood = this.good
  private replyTxt = ''

  private formatDate (date: string) {
    if (!date) { return '' }
    date = '' + date
    return date.substring(4, 6) + '月' + date.substring(6, 8) + '日'
  }

  private handlegood () {
    if (this.isGood) {
      this.clicknumber--
    } else {
      this.clicknumber++
    }
    this.isGood = !this.isGood
    this.$emit('handlegood', this.id, this.isGood)
  }

  private changeReply () {
    this.reply.active = !this.reply.active
  }

  private handlereply () {
    this.$emit('handlereply', this.id, this.replyTxt)
  }
}
</script>

<style lang='scss' scoped>
.item{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 6px;
    border-bottom: 1px solid #d9d9d9;
    .info{
      font-size:16px;
      margin-bottom: 3px;
      span{
        float: right;
      }
    }
    .content{
      font-size: 14px;
      color: #444;
      padding-left: 12px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .actions{
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      span{
        svg{
          margin-right:6px;
        }
        &:nth-child(2){
          margin-left:16px;
        }
        &:hover{
          color: #175199;
        }
      }
    }
    .childer{
      margin-top: 6px;
      margin-left:16px;
    }
    .reply{
      display: none;
      width: 100%;
      margin-top: 6px;
      input{
        width: calc(100% - 70px);
        margin-right: 6px;
        border: 1px solid #d9d9d9;
        outline: none;
        padding-left: 6px;
        border-radius: 4px;
        &:focus{
          border: 1px solid #175199;
        }
      }
    }
    .active{
      display: flex;
    }
  }
</style>
