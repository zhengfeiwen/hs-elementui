<template>
  <div class="shortstory">
   <div class="shortstory_item">
     <div class="shortstory_title" v-if="!order">
       <a href="#"  @click.prevent="handletitle">{{title}}</a>
     </div>
     <div  v-if='!isEx' class="shortstory_mid_body">
        <div class="shortstory_order" v-if="order">
          <span :class="(order < 4 ? 'top' : '')"></span>{{order}}
        </div>
        <div :class="'shortstory_body ' + (order ? 'reverse' : '')">
          <div v-if='titlepic' class="shortstory_titlepic">
            <img :src="titlepic" alt="">
          </div>
          <div class="shortstory_content" @click="exChange">
            <div class="shortstory_content_title" v-if="order">{{title}}</div>
            <div class="shortstory_content_story">{{fStory(story)}}&nbsp;
              <hs-extendbutton
              :titles="['阅读全文','收起']"
              @click.native="exChange"
              ></hs-extendbutton>
            </div>
            <div class="shortstory_shorttools" v-if="order">
              <div class="hot">
                <hs-iconbuttion
                icon="hot"
                :desc ="shorttools.hot">
                </hs-iconbuttion>
              </div>
              <div class="share">
                <hs-iconbuttion
                icon="share"
                :desc ="shorttools.share">
                </hs-iconbuttion>
              </div>
            </div>
          </div>
        </div>
     </div>
     <div class="whole" v-else>
       <!-- 这是完整的文章 -->
       <slot name="whole"></slot>
       <hs-extendbutton
        :titles="['阅读全文','收起']"
        @click.native="exChange"
        state="ex"
        ></hs-extendbutton>
     </div>
      <div class="shortstory_tools">
        <div class="agree_group">
          <div href="#" :class="'agree '+ (agreeSelf === 1 ? 'is_active': '')">
            <i class="el-icon-caret-top" /><span>赞同&nbsp;{{(clicknum > 9999 ? (clicknum / 10000).toFixed(1) + '万' : clicknum)}}</span>
          </div>
        </div>
        <hs-iconbuttion
          icon="wechat"
          :desc ="tools.comment" @click="iconclick('wechat', id)">
        </hs-iconbuttion>
        <hs-iconbuttion
          :icon="like"
          v-if="tools.like"
          desc ="关注" @click="iconclick('like', id)">
        </hs-iconbuttion>
        <hs-iconbuttion
          :icon="like"
          v-else
          desc ="关注" @click="iconclick('like', id)">
        </hs-iconbuttion>
      </div>
      <div :class="wechat">
        <div class="wechat_reply">
          <input placeholder="写下您的评论" type="text" v-model="replyTxt">
          <el-button size="mini" type="primary" plain @click="handlereplyproblem">回复</el-button>
        </div>
        <hs-reply
        :problemReplyList="problemReplyList"
        @handlereply="handlereply"
        @handlegood="handlegood"
      ></hs-reply>
      </div>
   </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import HsExtendbutton from '@/packages/button/extendbutton/main.vue'
import HsIconbutton from '@/packages/button/iconbutton/main.vue'
import HsReply from './reply/main.vue'

@Component({
  name: 'hs-shortstory-child',
  components: {
    'hs-extendbutton': HsExtendbutton,
    'hs-iconbuttion': HsIconbutton,
    'hs-reply': HsReply
  }
})
export default class HsShortstoryChild extends Vue {
  @Prop({ type: String })
  public title!: string

  @Prop({ type: String })
  public titlepic!: string

  @Prop({ type: Number })
  public id!: number

  @Prop({ type: String })
  public url!: string

  @Prop({ type: String })
  public story!: string

  @Prop({ type: Number })
  public order!: number

  @Prop({ type: Number })
  public problemId!: number

  @Prop({ type: Number })
  public clickNum!: number

  @Prop({ type: Object })
  public shorttools!: object

  @Prop({ type: Object })
  public tools!: any

  @Prop({ type: Boolean, default: false })
  public agree!: boolean

  @Prop({ type: Array })
  public problemReplyList!: any[]

  private agreeSelf:any = !!this.agree

  private isEx = false

  private good = false

  private clicknum = this.clickNum

  private replyTxt = ''

  private wechat = {
    wechat: true,
    active: false
  }

  private reply = {
    reply: true,
    active: false
  }

  private like: any = !this.tools.like ? 'like' : 'liked'

  private handletitle () {
    this.$emit('handletitle', this.url, this.problemId, this.clicknum)
  }

  private iconclick (flag: string, id: string, url: string) {
    if (flag === 'like' || flag === 'wechat') {
      if (flag === 'like') {
        this.like = this.like === 'liked' ? 'like' : 'liked'
      }
      this.$emit('iconclick', flag, id, this.problemId, this.like)
    } else {
      this.$emit('iconclick', flag, id, this.problemId, url)
    }
    if (flag === 'wechat') {
      this.wechat.active = !this.wechat.active
      this.wechat.active && this.$emit('getproblemreplylist', this.problemId)
    }
  }

  private fagree (flag: number) {
    if (flag === this.agreeSelf) {
      this.agreeSelf = 0
      this.clicknum = this.clickNum
    } else {
      this.agreeSelf = flag
      if (this.agreeSelf === 1) {
        this.clicknum = this.clickNum + 1
      } else if (this.agreeSelf === -1) {
        this.clicknum = (this.clickNum - 1 > -1) ? this.clickNum - 1 : 0
      } else {
        this.clicknum = this.clickNum
      }
    }
    this.$emit('fagree', this.agreeSelf, this.id, this.problemId)
  }

  private handlegood (id: string, good: boolean) {
    this.$emit('handlegood', id, this.problemId, good)
  }

  private handlereply (id: number, replyTxt: string) {
    this.$emit('handlereply', this.problemId, id, replyTxt)
  }

  private handlereplyproblem () {
    this.$emit('handlereply', this.problemId, 0, this.replyTxt)
  }

  private exChange () {
    this.isEx = !this.isEx
  }

  private fStory (story: string) {
    const content = story.replace(/<[^>]*>|/g, '')
    const len = content.length
    if (len > 50) {
      return content.slice(0, 50) + '...'
    }
    return content
  }
}
</script>

<style lang='scss' scope>
.shortstory{
  width: 100%;
  display: flex;
  flex-direction: column;
  .shortstory_item{
    width: 100%;
    min-height: 226px;
    padding: 5px;
    border-bottom: 1px solid rgb(240, 242, 247);
    .shortstory_title{
      width: 100%;
      padding-bottom: 10px;
      font-size: 18px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      &:hover{
        color:#175199;
      }
      a{
        text-decoration: none;
      }
    }
    .shortstory_mid_body{
      height:120px;
      width: 100%;
      .shortstory_order{
        width:40px;
        height:100%;
        padding-top:10px;
        text-align: center;
        span{
          color{
            color:#999999
          }
        }
        .top{
          color: #ff9607;
        }
      }
      .shortstory_body{
        width: auto;
        height: 100%;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        .shortstory_titlepic{
          width: 190px;
          height: 106px;
          margin-right:10px;
          border-radius: 5px;
          img{
            width: 190px;
            height: 106px;
            border-radius: 5px;
          }
        }
        .shortstory_content{
          width: auto;
          height: 100%;
          max-height: 100px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .shortstory_content_title{
            height:30px;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
            padding-left: 10px;
          }
          .shortstory_content_story{
            height:75px;
            font-size: 13px;
            text-align: left;
            padding-left: 10px;
            &:hover{
              opacity: 0.6;
              #story-ac{
                opacity: 1;
              }
            }
            #story-ac{
              color: #175199;
              user-select: none;
              display: inline-block;
              &:hover{
                opacity: 0.9;
                color: #999999;
              }
            }
          }
          .shortstory_shorttools{
            height:auto;
            width: 100%;
            display: flex;
            flex-direction: row;
            padding: 0;
          }
        }
      }
      .shortstory_body.reverse{
        flex-direction: row-reverse;
      }
    }
    .whole{
      font-size: 13px;
      padding-left: 12px;
    }
    .shortstory_tools{
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .agree_group{
        display: flex;
        flex-direction: row;
        width: 150px;
        height: 40px;
        padding: 6px;
        color:#0084ff;
        cursor: pointer;
        user-select: none;
        .agree{
          height: 28px;
          width: 90px;
          border-radius: 4px;
          text-align: center;
          line-height: 28px;
          background-color: rgba(0, 132, 255, 0.1);
          margin-right: 10px;
          font-size: 14px;
          &:hover{
            background-color: rgba(0,132,255,.15);
            color:#0084ff;
          }
        }
        .unagree{
          height: 28px;
          width: 30px;
          border-radius: 4px;
          text-align: center;
          line-height: 28px;
          background-color: rgba(0, 132, 255, 0.1);
          &:hover{
            background-color: rgba(0,132,255,.15);
            color:#0084ff;
          }
        }
        .is_active{
          background-color: #0084ff;
          color: #fff;
          &:hover{
            background-color: #0084ff;
            color: #fff;
          }
        }
      }
    }
    .wechat{
      display: none;
      flex-direction: column;
      .wechat_reply{
        width:100%;
        input{
          width: calc(100% - 70px);
          height:28px;
          margin-right: 6px;
          border: 1px solid #d9d9d9;
          outline: none;
          padding-left: 6px;
          border-radius: 4px;
        }
        button{
          color: #409EFF;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
    }
    .active{
      display: flex;
    }
  }
}
</style>
