import request from '@/utils/request'

// 查询活动所需角色列表
export function listEventrole(query) {
  return request({
    url: '/bt10/eventrole/list',
    method: 'get',
    params: query
  })
}

// 查询活动所需角色详细
export function getEventrole(id) {
  return request({
    url: '/bt10/eventrole/' + id,
    method: 'get'
  })
}

// 新增活动所需角色
export function addEventrole(data) {
  return request({
    url: '/bt10/eventrole',
    method: 'post',
    data: data
  })
}

// 修改活动所需角色
export function updateEventrole(data) {
  return request({
    url: '/bt10/eventrole',
    method: 'put',
    data: data
  })
}

// 删除活动所需角色（支持单个 id 或 id 数组）
export function delEventrole(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventrole/${_ids}`,
    method: 'delete'
  })
}
