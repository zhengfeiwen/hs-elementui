# hs-elementui

## 一、使用方式

- 1、安装

  ```shell
  npm install hs-elementui@latest -registry=http://192.168.0.123:4873/
  ```

- 2、在项目中的`main.js`文件中引入

  ```js
  import HsElementui from 'hs-elementui';
  import 'hs-elementui/lib/hs-elementui.css';
  Vue.use(HsElementui);
  ```

* 3、组件中使用-举例

  ```html
  <hs-tabs
    tabType="divi"
    :tabs="tabs"
    :activeTab="0"
    @change="tabChange"
  ></hs-tabs>
  ```

  ```js
  export default {
    data () {
      return {
        curTab: 'documentary',
        tabs: [
          {
            id: 'documentary',
            name: '跟单数据'
          },
          {
            id: 'booking',
            name: '订单数据'
          }
        ]
      }
    },
    methods: {
      tabChange: function (id) {
        this.curTab = id
      }
    }
  };
  ```

## 二、主要的`API`

|       参数         |    类型    | 说明                           |  默认值  |
| :---------------: | :--------: | ----------------------------- | ------- |
|      `tabs`       |  `Array`   | tab数组                        |    空   |
|    `tabType`      | `String`   | tab类型                        |    空   |
|    `curTab`       | `String`   | 当前活动tab                     |    空   |
|    `tabChange`    | `Function` | tab切换事件                     |         |

##npm库(http://192.168.0.177:4873/)