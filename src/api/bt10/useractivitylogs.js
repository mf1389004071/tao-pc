import request from '@/utils/request'

// 查询用户行为轨迹日志列表
export function listUseractivitylogs(query) {
  return request({
    url: '/bt10/useractivitylogs/list',
    method: 'get',
    params: query
  })
}

// 查询用户行为轨迹日志详细
export function getUseractivitylogs(id) {
  return request({
    url: '/bt10/useractivitylogs/' + id,
    method: 'get'
  })
}

// 新增用户行为轨迹日志
export function addUseractivitylogs(data) {
  return request({
    url: '/bt10/useractivitylogs',
    method: 'post',
    data: data
  })
}

// 修改用户行为轨迹日志
export function updateUseractivitylogs(data) {
  return request({
    url: '/bt10/useractivitylogs',
    method: 'put',
    data: data
  })
}

// 删除用户行为轨迹日志（支持单个 id 或 id 数组）
export function delUseractivitylogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/useractivitylogs/${_ids}`,
    method: 'delete'
  })
}
