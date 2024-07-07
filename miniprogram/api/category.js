import http from '../utils/http'

/**
 * @description 获取分类数据
 * @return Promise
 */
export const reqCategoryData = () => {
  return http.get('/index/findCategoryTree')
}
