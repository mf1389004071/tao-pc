import request from '@/utils/request'

// 查询报名记录与活动角色的分配关系列表
export function listEventjoinerrole(query) {
  return request({
    url: '/bt10/eventjoinerrole/list',
    method: 'get',
    params: query
  })
}

// 查询报名记录与活动角色的分配关系详细
export function getEventjoinerrole(id) {
  return request({
    url: '/bt10/eventjoinerrole/' + id,
    method: 'get'
  })
}

// 新增报名记录与活动角色的分配关系
export function addEventjoinerrole(data) {
  return request({
    url: '/bt10/eventjoinerrole',
    method: 'post',
    data: data
  })
}

// 修改报名记录与活动角色的分配关系
export function updateEventjoinerrole(data) {
  return request({
    url: '/bt10/eventjoinerrole',
    method: 'put',
    data: data
  })
}

// 删除报名记录与活动角色的分配关系（支持单个 id 或 id 数组）
export function delEventjoinerrole(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventjoinerrole/${_ids}`,
    method: 'delete'
  })
}
