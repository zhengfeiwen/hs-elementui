
import {
  DatePicker, Loading, Button, Icon, Image, Input, Radio, Checkbox, CheckboxGroup, Switch, Upload, Form, FormItem, Progress, Pagination, Select, OptionGroup,
  InfiniteScroll, Drawer, Divider, Card, Tabs, Menu, Message, Cascader, Option, Calendar, Table, TableColumn, PageHeader, Dialog, Tag
} from 'element-ui'

const elementui = {
  install: function (Vue: any) {
    Vue.use(DatePicker)
    Vue.use(Button)
    Vue.use(Icon)
    Vue.use(Input)
    Vue.use(Image)
    Vue.use(Input)
    Vue.use(Radio)
    Vue.use(CheckboxGroup)
    Vue.use(Checkbox)
    Vue.use(Switch)
    Vue.use(Upload)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Pagination)
    Vue.use(Select)
    Vue.use(OptionGroup)
    Vue.use(Progress)
    Vue.use(InfiniteScroll)
    Vue.use(Drawer)
    Vue.use(Divider)
    Vue.use(Card)
    Vue.use(Tabs)
    Vue.use(Menu)
    Vue.use(Message)
    Vue.use(Cascader)
    Vue.use(Option)
    Vue.use(Calendar)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(PageHeader)
    Vue.use(Dialog)
    Vue.use(Tag)
    Vue.use(Loading.directive)
  }
}

export default elementui
