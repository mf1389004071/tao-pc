import request from '@/utils/request'

// 查询统一支付订单列表
export function listPaymentinfo(query) {
  return request({
    url: '/bt10/paymentinfo/list',
    method: 'get',
    params: query
  })
}

// 查询统一支付订单详细
export function getPaymentinfo(id) {
  return request({
    url: '/bt10/paymentinfo/' + id,
    method: 'get'
  })
}

// 新增统一支付订单
export function addPaymentinfo(data) {
  return request({
    url: '/bt10/paymentinfo',
    method: 'post',
    data: data
  })
}

// 修改统一支付订单
export function updatePaymentinfo(data) {
  return request({
    url: '/bt10/paymentinfo',
    method: 'put',
    data: data
  })
}

// 删除统一支付订单（支持单个 id 或 id 数组）
export function delPaymentinfo(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/paymentinfo/${_ids}`,
    method: 'delete'
  })
}
