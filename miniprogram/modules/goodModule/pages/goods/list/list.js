// pages/goods/list/index.js
import { reqGoodsList, reqGoodsInfo } from '../../../api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    total: 0,
    isFinish: false, // 判断数据是否加载完毕
    isLoading: false, //
    requestData: {
      page: 1,
      limit: 10,
      category1Id: '',
      category2Id: ''
    }
  },
  async getGoodsList() {
    //在发送请求之前，需要将isLoading设置为true,表示请求正在发送中
    this.data.isLoading = true
    //发送请求
    const { data } = await reqGoodsList(this.data.requestData)
    //在请求结束后需要将isLoading设置为false,表示请求已经发送完毕
    this.data.isLoading = false
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },
  //监听到页面的上拉操作
  onReachBottom() {
    const { goodsList, total, requestData, isLoading } = this.data
    const { page } = this.data.requestData
    //判断isLoading是否为true，
    //如果为true，则表示请求正在发送中，不能再次发送请求
    if (isLoading) return

    //开始让 goodsList 长度和total进行对比
    //如果数据相等，列表数据已经加载完毕，如果数据已经加载完毕
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }
    this.setData({
      requestData: { ...this.requestData, page: page + 1 }
    })
    this.getGoodsList()
  },
  onPullDownRefresh() {
    //将数据进行重置
    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: { ...this.requestData, page: 1 }
    })
    //使用最新的参数发送请求
    this.getGoodsList()
    //手动关闭下拉刷新的效果
    wx.stopPullDownRefresh()
  },
  onLoad(options) {
    //Object.assign 用来合并对象，后面对象对的属性悔往前进行合并
    Object.assign(this.data.requestData, options)
    this.getGoodsList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onShareTimeline: function () {}
})
