import { reqIndexData } from '../../api/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeList: [], //活动渲染区域
    bannerList: [], //轮播图数据
    categoryList: [], //商品导航数据
    hotList: [], //人气推荐
    guessList: [], //猜你喜欢
    loading: true
  },

  //获取首页数据
  async getIndexData() {
    const res = await reqIndexData()
    this.setData({
      bannerList: res[0].data,
      categoryList: res[1].data,
      activeList: res[2].data,
      guessList: res[3].data,
      hotList: res[4].data,
      loading: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onShareTimeline: function () {}
})
