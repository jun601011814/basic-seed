/**
 * 生成指定长度字符串
 * @param length
 * @param maxLength
 * @param randomLength
 * @returns {string}
 */
function getRandomString (length, maxLength = 0, randomLength = false) {
  length = length || 32

  let result = ''

  if (randomLength && maxLength > length) {
    length = Math.floor(Math.random() * (maxLength - length)) + length
  }

  for (let i = 0; i < length; i++) {
    result += getChar()
  }

  return result
}

/**
 * 随机生成一个字符串
 * @returns {string}
 */
function getChar () {
  // const baseStrings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  const baseStrings = 'abcdefghijklmnopqrstuvwxyz1234567890'
  let char = ''
  do {
    char = baseStrings.charAt(Math.floor(Math.random() * baseStrings.length))
  } while (!char && char !== '0')

  return char
}

export default {
  getRandomString
}
