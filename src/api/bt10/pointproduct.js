import request from '@/utils/request'

// 查询积分商城商品列表
export function listPointproduct(query) {
  return request({
    url: '/bt10/pointproduct/list',
    method: 'get',
    params: query
  })
}

// 查询积分商城商品详细
export function getPointproduct(id) {
  return request({
    url: '/bt10/pointproduct/' + id,
    method: 'get'
  })
}

// 新增积分商城商品
export function addPointproduct(data) {
  return request({
    url: '/bt10/pointproduct',
    method: 'post',
    data: data
  })
}

// 修改积分商城商品
export function updatePointproduct(data) {
  return request({
    url: '/bt10/pointproduct',
    method: 'put',
    data: data
  })
}

// 删除积分商城商品（支持单个 id 或 id 数组）
export function delPointproduct(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/pointproduct/${_ids}`,
    method: 'delete'
  })
}
