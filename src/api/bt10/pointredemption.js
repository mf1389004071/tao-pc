import request from '@/utils/request'

// 查询用户积分兑换记录列表
export function listPointredemption(query) {
  return request({
    url: '/bt10/pointredemption/list',
    method: 'get',
    params: query
  })
}

// 查询用户积分兑换记录详细
export function getPointredemption(id) {
  return request({
    url: '/bt10/pointredemption/' + id,
    method: 'get'
  })
}

// 新增用户积分兑换记录
export function addPointredemption(data) {
  return request({
    url: '/bt10/pointredemption',
    method: 'post',
    data: data
  })
}

// 修改用户积分兑换记录
export function updatePointredemption(data) {
  return request({
    url: '/bt10/pointredemption',
    method: 'put',
    data: data
  })
}

// 删除用户积分兑换记录（支持单个 id 或 id 数组）
export function delPointredemption(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/pointredemption/${_ids}`,
    method: 'delete'
  })
}
