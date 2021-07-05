import { Vue, Component } from 'vue-property-decorator'

const _zhCN = require('./lang/zh-CN')

const _zhCN2 = _interopRequireDefault(_zhCN)

const _vue = require('vue')

const _vue2 = _interopRequireDefault(_vue)

const _deepmerge = require('deepmerge')

const _deepmerge2 = _interopRequireDefault(_deepmerge)

const _format = require('./format.ts')

const _format2 = _interopRequireDefault(_format)

function _interopRequireDefault (obj: any) { return obj && obj.__esModule ? obj : { default: obj } }

const format = (_format2.default)(_vue2.default)
let lang = _zhCN2.default
let merged = false
let i18nHandler = function i18nHandler (this: any, ...args:any[]) {
  const vuei18n = Object.getPrototypeOf(this || _vue2.default).$t
  if (typeof vuei18n === 'function' && !!_vue2.default.locale) {
    if (!merged) {
      merged = true
      _vue2.default.locale(_vue2.default.config.lang, (_deepmerge2.default)(lang, _vue2.default.locale(_vue2.default.config.lang) || {}, { clone: true }))
    }
    return vuei18n.apply(this, args)
  }
}

export const t = function t (this: any, path: any, options: any = null, ...args: any[]) {
  let value = i18nHandler.apply(this, (args as any))
  if (value !== null && value !== undefined) return value

  const array = path ? path.split('.') : []
  let current = lang

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i]
    value = current[property]
    if (i === j - 1) return format(value, options)
    if (!value) return ''
    current = value
  }
  return ''
}

export const use = function use (l: any) {
  lang = l || lang
}

export const i18n = function i18n (fn: any) {
  i18nHandler = fn || i18nHandler
}

@Component
export default class locale extends Vue {
  static i18n (fn: any) {
    i18nHandler = fn || i18nHandler
  }

  private use = use
  private t = t
  private i18n = i18n
}
