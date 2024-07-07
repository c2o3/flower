import { observable, action, set } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'

export const userStore = observable({
  //定义响应式数据
  token: getStorage('token') || '',
  //用户信息
  userInfo: getStorage('userInfo') || {},
  //setToken 用来修改更新Token
  setToken: action(function (token) {
    this.token = token
  }),
  //对用户信息赋值
  setUserInfo: action(function (userInfo) {
    this.userInfo = userInfo
  })
})
