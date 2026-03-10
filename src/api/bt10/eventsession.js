import request from '@/utils/request'

// 查询周期活动的单场次列表
export function listEventsession(query) {
  return request({
    url: '/bt10/eventsession/list',
    method: 'get',
    params: query
  })
}

// 查询周期活动的单场次详细
export function getEventsession(id) {
  return request({
    url: '/bt10/eventsession/' + id,
    method: 'get'
  })
}

// 新增周期活动的单场次
export function addEventsession(data) {
  return request({
    url: '/bt10/eventsession',
    method: 'post',
    data: data
  })
}

// 修改周期活动的单场次
export function updateEventsession(data) {
  return request({
    url: '/bt10/eventsession',
    method: 'put',
    data: data
  })
}

// 删除周期活动的单场次（支持单个 id 或 id 数组）
export function delEventsession(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventsession/${_ids}`,
    method: 'delete'
  })
}
