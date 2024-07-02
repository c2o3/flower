/**
 * @description 存储数据
 * @param {*} key 本地缓存中指定的key
 * @param {*} data 需要缓存的数据
 */
export const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
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

/**
 * @description 异步将数据存储到本地
 * @param {*} key 本地存储中指定的key
 * @param {*} data 需要缓存的数据
 * @returns
 */
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete(res) {
        resolve(res)
      }
    })
  })
}
/**
 * @description 异步从本地缓存中获取指定key的数据
 * @param {*} key
 * @returns
 */
export const asyncGetStorage = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}

/**
 * @description 异步从本地缓存中移除指定key的数据
 * @param {*} key
 * @returns
 */
export const asyncRemoveStorage = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}

/**
 * @description 异步从本地缓存中清除、移除全部缓存数据
 */
export const asyncClearStorage = () => {
  return new Promise((resolve) => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}
