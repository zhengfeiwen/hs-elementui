import { hasOwn } from '@/utils/util'

export default function (Vue: any) {
  /**
   * template
   *
   * @param {String} string
   * @param {Array} ...args
   * @return {String}
   */

  function template (string: any, ...args: any) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0]
    }

    if (!args || !args.hasOwnProperty) {
      args = {}
    }

    return string.replace(RE_NARGS, (match: any, prefix: any, i: any, index: any) => {
      let result

      if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
        return i
      } else {
        result = hasOwn(args, i) ? args[i] : null
        if (result === null || result === undefined) {
          return ''
        }

        return result
      }
    })
  }

  return template
}

const _util = require('element-ui/lib/utils/util')

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g
/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
