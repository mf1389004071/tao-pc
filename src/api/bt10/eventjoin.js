import request from '@/utils/request'

// 查询用户活动报名记录列表
export function listEventjoin(query) {
  return request({
    url: '/bt10/eventjoin/list',
    method: 'get',
    params: query
  })
}

// 查询用户活动报名记录详细
export function getEventjoin(id) {
  return request({
    url: '/bt10/eventjoin/' + id,
    method: 'get'
  })
}

// 新增用户活动报名记录
export function addEventjoin(data) {
  return request({
    url: '/bt10/eventjoin',
    method: 'post',
    data: data
  })
}

// 修改用户活动报名记录
export function updateEventjoin(data) {
  return request({
    url: '/bt10/eventjoin',
    method: 'put',
    data: data
  })
}

// 删除用户活动报名记录（支持单个 id 或 id 数组）
export function delEventjoin(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventjoin/${_ids}`,
    method: 'delete'
  })
}
