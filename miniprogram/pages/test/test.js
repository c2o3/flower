import instance from '../../utils/http'
import { reqSwiperData } from '../../api/index'
Page({
  data: {
    avatarUrl: '../../assets/images/Jerry.jpg'
  },
  //获取微信头像
  async chooseavatar(event) {
    const { avatarUrl } = event.detail
    const { data: avatar } = await instance.upload('/fileUpload', avatarUrl, 'file')
    this.setData({
      avatarUrl: avatar
    })
    // wx.uploadFile({
    //   //上传文件路径
    //   filePath: avatarUrl,
    //   //文件对应的key
    //   name: 'file',
    //   //接口地址
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
    //   success: (res) => {
    //     //服务器返回的数据是json字符串，需要使用JSON.parse进行解析
    //     res.data = JSON.parse(res.data)
    //     console.log(res)
    //     this.setData({
    //       avatarUrl: res.data.data
    //     })
    //   }
    // })
  },
  async handler() {
    const res = await reqSwiperData()
    console.log(res)
  },
  handler1() {
    wx.request({
      url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner',
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
  },
  //测试并发请求
  async allhandler() {
    //演示通过async await 并发请求
    //async 和 await 能够控制异步任务以同步的流程来执行

    //如果通过async await方式发起多个请求
    //在当前请求结束以后，才能够发起下一个请求
    //会造成请求的阻塞，从而影响页面的渲染速度
    // await instance.get('/index/findBanner')
    // await instance.get('/index/findCategory1')
    // await instance.get('/index/findBanner')
    // await instance.get('/index/findCategory1')

    //演示通过Promise.all发起多个请求
    //Promise.all 接收一个数组，数组中的元素都是Promise对象
    //Promise.all能够将多个异步请求同时进行发送，也就是并行发送
    //并不会造成请求的阻塞。从而不会影响页面的渲染速度
    // await Promise.all([
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findCategory1'),
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findCategory1')
    // ])
    const res = await instance.all(
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1')
    )
    console.log(res)
  }
})
