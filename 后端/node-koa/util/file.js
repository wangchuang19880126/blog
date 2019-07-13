const fs = require('fs')
const mimes = require('./mimes')

/**
 * 读取文件方法
 * @param  {string} 文件本地的绝对路径
 * @return {string|binary} 
 */
function file ( filePath ) {
  let itemArr = filePath.split("\.");
  let itemMime = ( itemArr.length > 1 ) ? itemArr[ itemArr.length - 1 ] : "undefined";
// console.log(itemMime)
let isTxt = ['text/html',
  'text/css',
  'text/css',
  'text/javascript',
  'application/json',
  'text/plain',
  'text/xml'].some(item => mimes[itemMime] === item)

  let content = fs.readFileSync(filePath, isTxt ? 'utf8' : 'binary' )
  return content
}

module.exports = file