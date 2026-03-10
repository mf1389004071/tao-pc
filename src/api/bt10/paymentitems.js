import request from '@/utils/request'

// 查询统一支付订单明细表列表
export function listPaymentitems(query) {
  return request({
    url: '/bt10/paymentitems/list',
    method: 'get',
    params: query
  })
}

// 查询统一支付订单明细表详细
export function getPaymentitems(id) {
  return request({
    url: '/bt10/paymentitems/' + id,
    method: 'get'
  })
}

// 新增统一支付订单明细表
export function addPaymentitems(data) {
  return request({
    url: '/bt10/paymentitems',
    method: 'post',
    data: data
  })
}

// 修改统一支付订单明细表
export function updatePaymentitems(data) {
  return request({
    url: '/bt10/paymentitems',
    method: 'put',
    data: data
  })
}

// 删除统一支付订单明细表（支持单个 id 或 id 数组）
export function delPaymentitems(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/paymentitems/${_ids}`,
    method: 'delete'
  })
}
