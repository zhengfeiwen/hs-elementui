import { hasOwn } from '@/utils/util'

export function isVNode (node: any) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}
