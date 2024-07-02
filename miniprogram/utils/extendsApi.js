const toast = ({
  title = '数据加载中',
  icon = 'none',
  duration = 2000,
  mask = true
} = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

const modal = (options = {}) => {
  //在方法内部需要用Promise返回用户操作
  //如果点击确定，resolve返回true
  //如果点击取消，resolve返回false
  return new Promise((resolve, reject) => {
    const defaultOpt = {
      title: '提示',
      content: '您确定执行该操作吗？',
      confirmColor: '#f3514f'
    }
    //通过Object.assign将默认参数和传入的参数合并
    //需要使用传入的参数覆盖磨人的参数
    //为了不影响默认的参数，需要将合并以后的参数赋值给一个空对象
    const opts = Object.assign({}, defaultOpt, options)
    wx.showModal({
      //将合并以后的参数通过展开运算符赋值给 wx.showModal对象
      ...opts,
      complete({ confirm, cancel }) {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}
//如果想全局生效，要执行一次
wx.toast = toast
wx.modal = modal

export { toast, modal }
