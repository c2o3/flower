/**
 * @description 存储数据
 * @param {*} key 本地缓存中指定的key
 * @param {*} value 需要缓存的数据
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    console.log(`存储指定 ${key} 数据发生了异常`, error)
  }
}
/**
 * @description 从本地读取指定key的数据
 * @param {*} key
 * @returns
 */
export const getStorage = (key) => {
  try {
    const value = wx.getStorageSync(key)
    if (value) {
      return value
    }
  } catch (error) {
    console.log(`获取指定 ${key} 数据发生了异常`, error)
  }
}

/**
 * @description 移除本地缓存中指定key的数据
 * @param {*} key
 */
export const removeStorage = () => {
  try {
    wx.removeStorageSync()
  } catch {
    console.log(`移除指定 ${key} 数据发生了异常`, error)
  }
}

/**
 * @description 清除本地缓存中所有数据
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
  } catch {
    console.log('清除、清空数据发生了异常', error)
  }
}
