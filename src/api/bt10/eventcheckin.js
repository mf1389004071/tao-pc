import request from '@/utils/request'

// 查询单次签到记录列表
export function listEventcheckin(query) {
  return request({
    url: '/bt10/eventcheckin/list',
    method: 'get',
    params: query
  })
}

// 查询单次签到记录详细
export function getEventcheckin(id) {
  return request({
    url: '/bt10/eventcheckin/' + id,
    method: 'get'
  })
}

// 新增单次签到记录
export function addEventcheckin(data) {
  return request({
    url: '/bt10/eventcheckin',
    method: 'post',
    data: data
  })
}

// 修改单次签到记录
export function updateEventcheckin(data) {
  return request({
    url: '/bt10/eventcheckin',
    method: 'put',
    data: data
  })
}

// 删除单次签到记录（支持单个 id 或 id 数组）
export function delEventcheckin(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventcheckin/${_ids}`,
    method: 'delete'
  })
}
