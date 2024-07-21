import { reqGoodsInfo } from '@/api/goods'
import { reqAddCart, reqCartList } from '@/api/cart'
import { userBehavior } from '@/behaviors/userBehavior'
// pages/goods/detail/index.js
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, //判断是加入购物车还是立即购买，0加入购物车，1立即购买
    allCount: 0 //购物车中商品的数量
  },
  //弹窗确定按钮触发的事件处理函数
  async handleSubmit() {
    const { token, count, blessing, buyNow } = this.data
    const goodsId = this.goodsId
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    //区分处理加入购物车和立即购买
    if (buyNow === 0) {
      const res = await reqAddCart({ goodsId, count, blessing })
      if (res.code === 200) {
        wx.toast({ title: '加入购物车成功' })
        //再加入购物车成功以后，需要重新计算购物车商品的购买数量
        this.getCartCount()
        this.setData({
          show: false
        })
      }
    } else {
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },
  //全屏预览图片
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },
  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handleGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    console.log(event.detail)
    this.setData({
      count: Number(event.detail)
    })
  },
  //获取商品详情数据
  async getGoodsInfo() {
    const { data: goodsInfo } = await reqGoodsInfo(this.goodsId)
    this.setData({
      goodsInfo
    })
  },
  async getCartCount() {
    //使用token判断用户是否登录
    //如果没登录不执行后续逻辑
    if (!this.data.token) return
    const res = await reqCartList()
    //判断购物车中是否存在商品
    if (res.data.length !== 0) {
      //用来累加得出商品购买数量
      let allCount = 0
      res.data.forEach((item) => {
        allCount += item.count
      })
      this.setData({
        //info属性值的要求是 字符串类型
        //而且如果购买的数量大于99，页面上需要显示99+
        allCount: allCount > 99 ? '99+' : allCount
      })
    }
  },
  onLoad(options) {
    //接收传递的商品Id，并且将商品id挂载到this上面
    this.goodsId = options.goodsId
    this.getGoodsInfo()
    this.getCartCount()
  }
})
