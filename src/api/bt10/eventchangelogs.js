import request from '@/utils/request'

// 查询活动关键信息变更记录列表
export function listEventchangelogs(query) {
  return request({
    url: '/bt10/eventchangelogs/list',
    method: 'get',
    params: query
  })
}

// 查询活动关键信息变更记录详细
export function getEventchangelogs(id) {
  return request({
    url: '/bt10/eventchangelogs/' + id,
    method: 'get'
  })
}

// 新增活动关键信息变更记录
export function addEventchangelogs(data) {
  return request({
    url: '/bt10/eventchangelogs',
    method: 'post',
    data: data
  })
}

// 修改活动关键信息变更记录
export function updateEventchangelogs(data) {
  return request({
    url: '/bt10/eventchangelogs',
    method: 'put',
    data: data
  })
}

// 删除活动关键信息变更记录（支持单个 id 或 id 数组）
export function delEventchangelogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventchangelogs/${_ids}`,
    method: 'delete'
  })
}
