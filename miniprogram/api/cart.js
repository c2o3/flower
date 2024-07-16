import http from '@/utils/http'

/**
 * @description [商品详情加入购物车] 以及 [购物车更新商品数量]
 * @param {*} param { goodsId, count, blessing }
 * @returns Promise
 */
export const reqAddCart = ({ goodsId, count, ...data }) => {
  return http.get(`/cart/addToCart/${goodsId}/${count}`, data)
}
/**
 * @description 获取购物车列表数据
 * @returns Promise
 */
export const reqCartList = () => {
  return http.get('/cart/getCartList')
}
/**
 * @description 更新商品的选中状态
 * @param {*} goodsId
 * @param {*} isChecked 0 需要取消勾选 1 需要勾选
 * @returns
 */
export const reqUpdateCart = ({ goodsId, isChecked }) => {
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}
/**
 * @description 实现全选和全不选功能
 * @param {*} isChecked 0 全不选 1 全选
 * @returns Promise
 */
export const reqCheckAllStatus = (isChecked) => {
  return http.get(`/cart/checkAllCart/${isChecked}`)
}
/**
 * @description 删除购物车商品
 * @param {*} goodsId
 * @returns
 */
export const reqDelCartGoods = (goodsId) => {
  return http.get(`/cart/delete/${goodsId}`)
}
