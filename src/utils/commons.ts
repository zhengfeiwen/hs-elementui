import SparkMD5 from 'spark-md5'

export type TextOverflowParams = {
  lineNum: number
  fontSize: number
  extend: boolean
  text: string
}

export const TextOverflow = {
  block: ({ lineNum = 1, fontSize = 13, text = '', extend = !1 }, auto = !1, el: any = '.text-overflow-block') => {
    const $el = document.querySelector(el)
    text = text || ''
    let texts = 0
    texts = $el.offsetWidth / fontSize * (extend ? 10000 : lineNum) - 5
    const short = text.substring(0, texts)
    const innerText = (short === text) ? text : short + ' ...'
    if (auto) {
      document.querySelector(el).innerText = innerText
    }
    return { text: innerText, height: Math.floor(innerText.length * fontSize * fontSize / $el.offsetWidth) + fontSize }
  }
}

export const FileMd5 = (file: any, callback: any) => {
  const pFile: any = File.prototype
  const blobSlice = pFile.slice || pFile.mozSlice || pFile.webkitSlice
  const chunkSize = 2097152 // Read in chunks of 2MB
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  fileReader.onload = function (e: any) {
    console.log('read chunk nr', currentChunk + 1, 'of', chunks)
    spark.append(e.target.result) // Append array buffer
    currentChunk++

    if (currentChunk < chunks) {
      loadNext()
    } else {
      callback(null, spark.end())
      console.log('finished loading')
    }
  }
  fileReader.onerror = function () {
    const msg = 'oops, something went wrong.'
    callback(msg)
  }
  function loadNext () {
    const start = currentChunk * chunkSize
    const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }
  loadNext()
}

export const FileUrl = (file: any, callback: Function) => {
  if (!file || !/image\//.test(file.type)) return
  const fileReader = new FileReader()
  fileReader.onload = function () {
    callback(null, fileReader.result)
  }
  fileReader.onerror = function () {
    const msg = 'oops, something went wrong.'
    callback(msg)
  }
  fileReader.readAsDataURL(file)
}

export const noop = function (...args: any) {
  // do nothing.
}

export const getPropByPath = (obj: any, path: string, strict = !1) => {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!')
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
}

export const kebabCase = (str: any) => {
  const hyphenateRE = /([^-])([A-Z])/g
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase()
}

export const isDef = (val: any) => {
  return val !== undefined && val !== null
}

export const isKorean = (text: any) => {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi
  return reg.test(text)
}

export const random = function () {
  return Math.random().toString(36).substr(2, 5) + new Date().getTime() + Math.random().toString(36).substr(2, 6)
}
