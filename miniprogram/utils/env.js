//用来配置当前小程序项目的环境变量

//获取当前小程序的账号信息
const { miniProgram } = wx.getAccountInfoSync()
//获取小程序的版本
const { envVersion } = miniProgram

let env = {
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api'
}

switch (envVersion) {
  //开发版本
  case 'develop':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  //体验版本
  case 'trial':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  //正式版本
  case 'release':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
}

export { env }
