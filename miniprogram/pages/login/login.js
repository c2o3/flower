import { toast } from '../../utils/extendsApi.js'
import { reqLogin, reqUserInfo } from '../../api/user.js'
import { setStorage } from '../../utils/storage'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../stores/userstore.js'

ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },
  methods: {
    login() {
      wx.login({
        success: async ({ code }) => {
          if (code) {
            //在获取到临时登录凭证code后需要传递给开发者服务器
            const { data } = await reqLogin(code)
            setStorage('token', data.token)
            //将自定义登录态Token存储到store对象
            this.setToken(data.token)
            this.getUserInfo()
            wx.navigateBack()
          } else {
            toast({ title: '授权失败，请重新授权' })
          }
        }
      })
    },
    async getUserInfo() {
      const { data } = await reqUserInfo()
      setStorage('userInfo', data)
      this.setUserInfo(data)
    }
  }
})
