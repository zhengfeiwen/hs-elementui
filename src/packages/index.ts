import Vue from 'vue'
import '@/styles/index-hs.scss'
import Navigation from './navigation'
import Plupload from './plupload'
import Progress from './progress'
import Button from './button'
import Svgicon from './svgicon'
import Image from './image'
import Drawer from './drawer'
import Card from './card'
import Divider from './divider'
import Calender from './calender'
import Layout from './layout'
import Table from './table/index'
import Radio from './radio'
import Tag from './tag'
import Container from './container'
import Checkbox from './checkbox'
import Switch from './switch'
import Input from './input'
import Inputnumber from './inputnumber'
import Transfer from './transfer'
import Slider from './slider'
import Tooltip from './tooltip'
import Rate from './rate'
import Collapse from './collapse'
import Link from './link'
import Tabs from './tabs'
import Carousel from './carousel'
import Dialog from './dialog'
import Select from './select'
import Alert from './alert'
import Steps from './steps'
import Dropdown from './dropdown'
import Echart from './echart'
import Frame from './frame'
import Coverlap from './coverlap'
import Querycondition from './busifunc'

const components: { [propsName: string]: any } = {
  ...Navigation,
  ...Progress,
  ...Button,
  ...Svgicon,
  ...Image,
  ...Drawer,
  ...Card,
  ...Divider,
  ...Calender,
  ...Layout,
  ...Table,
  ...Radio,
  ...Plupload,
  ...Tag,
  ...Container,
  ...Checkbox,
  ...Switch,
  ...Input,
  ...Inputnumber,
  ...Transfer,
  ...Slider,
  ...Tooltip,
  ...Rate,
  ...Collapse,
  ...Echart,
  ...Link,
  ...Tabs,
  ...Carousel,
  ...Dialog,
  ...Select,
  ...Alert,
  ...Steps,
  ...Dropdown,
  ...Frame,
  ...Coverlap,
  ...Querycondition
}

const install = (vue: typeof Vue, opts: any = {}): void => {
  // 安装全部的插件
  Object.keys(components).forEach((key) => {
    vue.component(key, components[key])
  })

  // Vue.use(InfiniteScroll);
  // Vue.use(Loading.directive);

  // Vue.prototype.$ELEMENT = {
  //   size: opts.size || '',
  //   zIndex: opts.zIndex || 2000
  // };

  // Vue.prototype.$loading = Loading.service;
  // Vue.prototype.$msgbox = MessageBox;
  // Vue.prototype.$alert = MessageBox.alert;
  // Vue.prototype.$confirm = MessageBox.confirm;
  // Vue.prototype.$prompt = MessageBox.prompt;
  // Vue.prototype.$notify = Notification;
  // Vue.prototype.$message = Message;
}

export default {
  install,
  ...components
}
