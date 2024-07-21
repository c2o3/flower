// import { toast } from './utils/extendsApi.js'
import './utils/extendsApi.js'
import {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  asyncSetStorage,
  asyncGetStorage,
  asyncClearStorage,
  asyncRemoveStorage
} from './utils/storage.js'
App({
  //全局共享的数据
  //点击收货地址时，需要将点击的收货地址赋值给address
  //在结算支付、订单结算页面，需要判断address是否存在数据
  //如果存在数据，就显示address数据，如果没有数据，就从接口获取数据进行渲染
  globalData: {
    address: {}
  },
  async onShow() {
    //获取当前小程序的账号信息
    const accountInfo = wx.getAccountInfoSync()
    //通过小程序的账号信息，就能获取小程序版本
    console.log(accountInfo.miniProgram.envVersion)
    asyncSetStorage('name', 'Jerry').then((res) => {
      console.log(res)
    })
    asyncSetStorage('age', '18').then((res) => {
      console.log(res)
    })
    // asyncGetStorage('name').then((res) => {
    //   console.log(res.data)
    // })

    // asyncRemoveStorage('name').then((res) => {
    //   console.log(res)
    // })

    asyncClearStorage().then((res) => {
      console.log(res)
    })
  }
})
