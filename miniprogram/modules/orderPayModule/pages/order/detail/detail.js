import {
  reqOrderAddress,
  reqOrderInfo,
  reqBuyNowGoods,
  reqSubmitOrder,
  reqPrePayInfo,
  reqPayStatus
} from '@/api/orderpay'
import { formatTime } from '@/utils/formatTime'
// 导入 async-validator 对参数进行验证
import Schema from 'async-validator'
Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    orderAddress: {}, // 收货地址
    orderInfo: {} // 订单商品详情
  },
  //处理提交订单
  async submitOrder() {
    //需要从data中结构数据
    const { buyName, buyPhone, deliveryDate, blessing, orderAddress, orderInfo } =
      this.data
    //需要根据接口要求阻止请求参数
    const params = {
      buyName,
      buyPhone,
      cartList: orderInfo.cartVoList,
      deliveryDate,
      remarks: blessing,
      userAddressId: orderAddress.id
    }
    //对请求参数进行验证
    const { valid } = await this.validatorPerson(params)
    if (!valid) return
    const res = await reqSubmitOrder(params)
    if (res.code === 200) {
      this.orderNo = res.data
      this.advancePay()
    }
  },
  async advancePay() {
    const payParams = await reqPrePayInfo(this.orderNo)
    try {
      if (payParams.code === 200) {
        const payInfo = wx.requestPayment(payParams.data)
        if (payInfo.errMsg === 'requestPayment:ok') {
          const payStatus = await reqPayStatus(this.orderNo)
          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/modules/orderPayModule/page/order/list/list',
              success: () => {
                wx.toast({
                  title: '支付成功',
                  icon: 'success'
                })
              }
            })
          }
        }
      }
    } catch {
      wx.toast({
        title: '支付失败',
        icon: 'error'
      })
    }
  },
  // 对收货人、订购人信息
  validatorPerson(params) {
    // 验证订购人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证订购人手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 创建验证规则
    const rules = {
      userAddressId: {
        required: true,
        message: '请选择收货地址'
      },
      buyName: [
        { required: true, message: '请输入订购人姓名' },
        { pattern: nameRegExp, message: '订购人姓名不合法' }
      ],
      buyPhone: [
        { required: true, message: '请输入订购人手机号' },
        { pattern: phoneReg, message: '订购人手机号不合法' }
      ],
      deliveryDate: { required: true, message: '请选择送达日期' }
    }

    // 传入验证规则进行实例化
    const validator = new Schema(rules)

    // 调用实例方法对请求参数进行验证
    // 注意：我们希望将验证结果通过 Promise 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({ title: errors[0].message })
          // 如果属性值是 false，说明验证失败
          resolve({ valid: false })
        } else {
          // 如果属性值是 true，说明验证成功
          resolve({ valid: true })
        }
      })
    })
  },
  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    //使用Vant提供的时间选择组件，获取的时间是时间戳
    //可以调用小程序给提供的时间格式化方法
    const timeRes = formatTime(new Date(event.detail))
    this.setData({
      show: false,
      deliveryDate: timeRes
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/modules/settingModule/pages/address/list/index'
    })
  },
  async getAddress() {
    //判断全局共享的address中是否存在数据
    //如果存在数据，就需要从全局共享的address中获取数据并赋值
    const addressId = app.globalData.address.id
    if (addressId) {
      this.setData({
        orderAddress: app.globalData.address
      })
      return
    }
    //如果全局共享的address中没有数据，就需要请求接口获取数据
    const { data: orderAddress } = await reqOrderAddress()
    this.setData({
      orderAddress
    })
  },
  async getOrderInfo() {
    const { goodsId, blessing } = this.data
    const { data: orderInfo } = goodsId
      ? await reqBuyNowGoods({ goodsId, blessing })
      : await reqOrderInfo()
    //判断是否存在祝福语
    //如果需要购买的是多个商品，筛选第一个存在祝福语的商品进行赋值
    const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')
    this.setData({
      orderInfo,
      blessing: !orderGoods ? '' : orderGoods.blessing
    })
  },
  onLoad(options) {
    //获取立即购买商品传递的参数
    //
    this.setData({
      ...options
    })
  },
  onShow() {
    this.getAddress()
    this.getOrderInfo()
  },
  //在页面销毁以后，需要将全局贡献的address也进行销毁
  //如果用户再次进入结算支付页面，需要从接口地址获取默认的收货地址进行渲染
  onUnload() {
    app.globalData.address = {}
  }
})
