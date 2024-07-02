// import { toast } from './utils/extendsApi.js'
import './utils/extendsApi.js'
import { setStorage, getStorage, removeStorage, clearStorage } from './utils/storage.js'
App({
  async onShow() {
    setStorage('isLogin', true)
    const res = getStorage('isLogin')
    console.log(res)
    removeStorage('isLogin')
  }
})
