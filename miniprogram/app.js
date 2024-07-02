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
  async onShow() {
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
