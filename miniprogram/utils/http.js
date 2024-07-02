import WxRequest from './request'
import { getStorage, clearStorage } from './storage'
import { modal, toast } from './extendsApi'
//实例化
//目前写到同一个文件中方便测试
const instance = new WxRequest({
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
  timeout: 15000
})
//配置请求拦截器
instance.interceptors.request = (config) => {
  //在请求发送之前做点什么

  //在发送请求之前，需要先判断本地是否存在令牌token
  const token = getStorage('token')
  //如果存在token，就需要在请求头中添加token字段
  if (token) {
    config.header['token'] = token
  }
  return config
}
//配置响应拦截器
instance.interceptors.response = async (response) => {
  //从response中解构isSuccess属性
  const { isSuccess, data } = response

  //如果isSuccess为false，说明请求失败，弹出提示
  if (!isSuccess) {
    wx.showToast({
      title: '网络请求异常',
      icon: 'error'
    })
    return response
  }
  //判断服务器响应的业务状态码
  switch (data.code) {
    case 200:
      //在响应数据返回之后做点什么
      return data

    //如果返回的状态码等于208，说明没有token，或者token失效
    //就需要让用户登录或者重新登录
    case 208:
      const res = await modal({
        title: '提示',
        content: '鉴权失败，请重新登录',
        showCancel: false,
        confirmColor: '#f3514f'
      }).then((res) => {
        if (res) {
          //清除之前失效的token,同时要清除本地存储的全部信息
          clearStorage()
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
        return Promise.reject(response)
      })
    default:
      toast({ title: '程序出现异常，请联系客服或者稍后重试' })
      return Promise.reject(response)
  }
}
export default instance
