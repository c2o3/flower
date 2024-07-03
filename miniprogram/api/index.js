//导入封装的网络请求模块实例
import http from '../utils/http'
export const reqIndexData = () => {
  //通过并发请求获取首页数据，提升页面的渲染速度
  //   return Promise.all([
  //     http.get('/index/findBanner'),
  //     http.get('/index/findCategory1'),
  //     http.get('/index/advertisement'),
  //     http.get('/index/findListGoods'),
  //     http.get('/index/findRecommendGoods')
  //   ])
  //使用all方法，将多个请求合并成一个请求
  return http.all(
    http.get('/index/findBanner'),
    http.get('/index/findCategory1'),
    http.get('/index/advertisement'),
    http.get('/index/findListGoods'),
    http.get('/index/findRecommendGoods')
  )
}
