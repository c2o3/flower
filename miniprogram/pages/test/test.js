import instance from '../../utils/http'
Page({
  async handler() {
    //第一种调用方式 .then
    // instance
    //   .request({
    //     url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner',
    //     methods: 'GET'
    //   })
    //   .then((res) => {
    //     console.log(res)
    //   })
    //第二种调用方式 通过async await
    // const res = await instance.request({
    //   url: '/index/findBanner',
    //   methods: 'GET'
    // })
    // console.log(res)

    const res = await instance.get('/index/findBanner')
    console.log(res)
  },
  handler1() {
    wx.request({
      url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner666',
      methods: 'GET',
      success: (res) => {
        //在使用wx.request 发送请求时
        //只要成功接收到服务器返回的结果
        //无论状态码是多少，都会执行success
        //开发者需要根据业务逻辑，自行进行判断
        console.log('虽然接口错了，但是依然会走success')
        console.log(res)
      },
      fail: (err) => {
        //一般在网络出现异常时，会执行fail
        console.log(err)
      }
    })
  }
})
