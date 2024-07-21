import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userstore'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllStatus,
  reqAddCart,
  reqDelCartGoods
} from '@/api/cart'
import { debounce } from 'licia'
import { swiperCellBehavior } from '@/behavior/swiperCell'

const computedBehavior = require('miniprogram-computed').behavior
// pages/cart/component/cart.js
ComponentWithStore({
  behaviors: [computedBehavior, swiperCellBehavior],
  // 让页面和store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  computed: {
    //判断是否是全选，控制全选按钮的选中效果
    //计算属性会被挂载到data对象中
    selectAllStatus() {
      //computed 不能使用this来访问data中的数据
      //如果想访问data中的数据，需要使用形参
      return (
        data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      )
    },
    totalPrice(data) {
      let totalPrice = 0
      data.cartList.forEach((item) => {
        if (item.isChecked === 1) {
          totalPrice += item.count * item.price
        }
      })
      return totalPrice
    }
  },
  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },

  // 组件的方法列表
  methods: {
    //跳转到订单结算页面
    toOrder() {
      //判断用户是否勾选了商品，如果没有勾选商品，不进行跳转
      if (this.data.totalPrice === 0) {
        wx.toast({
          title: '请选择商品',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    },
    //点击加减按钮，更新商品数量
    changeBuyNum: debounce(async function (event) {
      //如果用户输入的购买数量 > 200 需要将数量设置为200
      //最大购买数量是200，目前购买数量是1假设用户输入了666，666-1=665,665+1=666
      //最大购买数量是200，目前购买数量是1假设用户输入了666，重置为200，200-1=199,199+1=200
      const newBuyNum = event.detail > 200 ? 200 : event.detail
      //获取商品id 索引 之前的购买数量
      const { id, index, oldbuynum } = event.currentTarget.dataset
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      const regRes = reg.test(newBuyNum)
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        //如果验证没有通过，需要阻止代码运行
        return
      }
      //如果验证通过就需要计算差值，然后把插值发送给服务器，让服务器进行逻辑处理
      const disCount = newBuyNum - oldbuynum
      //判断购买数量是否发生变化，如果购买数量没有发生变化，不发送请求
      if (disCount === 0) return
      //如果购买数量发生变化，需要发送请求给服务器，让服务器进行逻辑处理
      const res = await reqAddCart({
        goodsId: id,
        count: disCount
      })
      //如果服务器更新购买数量成功，需要更新本地的购买数量
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: newBuyNum,
          //如果购买数量发生了变化，需要让当前商品变成选中的状态
          [`cartList[${index}].isChecked`]: 1
        })
      }
    }, 500),
    //实现全选和全不选
    async selectAllStatus(event) {
      //获取全选按钮的选中状态
      const { detail } = event
      //需要将选中的状态转换成接口需要的数据
      const idChecked = detail ? 1 : 0
      //调用接口实现全选和全不选
      const res = await reqCheckAllStatus(idChecked)
      if (res.code === 200) {
        // this.showTipGetList()
        const newCartList = JSON.parse(JSON.stringify(res.data.cartList))
        newCartList.forEach((item) => {
          item.isChecked = idChecked
        })
        this.setData({
          cartList: newCartList
        })
      }
    }, //更新商品的购买状态
    async updateChecked(event) {
      //获取最新的购买状态
      const { detail } = event
      //获取传递的商品id以及索引
      const { id, index } = event.currentTarget.dataset
      //将最新的购买状态转换成后端接口需要的 0 1
      const isChecked = detail ? 1 : 0
      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        //服务器更新购买状态以后，获取最新的购物车列表数据更新状态
        // this.showTipGetList()
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },
    //展示文案信息 同时获取购物车数据
    async showTipGetList() {
      //解构数据
      const { token } = this.data
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }
      //如果用户进行了登录，就需要获取购物车列表数据
      const { code, data: cartList } = await reqCartList()
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList.length === 0 ? '购物车空空如也，快去添加吧～' : ''
        })
      }
    },
    async delCartGoods(event) {
      const { id } = event.currentTarget.dataset
      //询问用户是否删除该商品
      const modalRes = await wx.modal({
        content: '您确认删除该商品吗？'
      })
      if (modalRes) {
        const res = await reqDelCartGoods(id)
        this.showTipGetList()
      }
    },
    //如果使用component 方法构建页面
    //生命周期钩子函数需要写到methods中 才可以
    onShow() {
      this.showTipGetList()
    },
    onHide() {
      //在页面隐藏的时候需要让删除滑块自动返回
      this.onSwiperCellCommonClick()
    }
  }
})
